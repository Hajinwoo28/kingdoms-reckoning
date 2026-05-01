# app.py — Kingdom's Reckoning (Vercel Edition)
from flask import Flask, request, jsonify, render_template, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import psycopg2
import os
import secrets

load_dotenv()

# templates/ and static/ are in the same folder as this file (project root)
app = Flask(__name__, template_folder='templates', static_folder='static')

_secret = os.getenv("SECRET_KEY")
if not _secret:
    _secret = secrets.token_hex(32)
    print("[WARNING] SECRET_KEY not set — sessions will reset on every cold start.")
app.secret_key = _secret

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[],
    storage_uri="memory://"
)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("[ERROR] DATABASE_URL is not set in environment variables.")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL, sslmode='require')

def init_db():
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL
        )''')
        c.execute('''CREATE TABLE IF NOT EXISTS scores (
            id SERIAL PRIMARY KEY,
            player VARCHAR(50) NOT NULL,
            score INTEGER NOT NULL
        )''')
        c.execute('''CREATE TABLE IF NOT EXISTS player_saves (
            username VARCHAR(50) PRIMARY KEY,
            gold INTEGER DEFAULT 40,
            diamonds INTEGER DEFAULT 0,
            wave INTEGER DEFAULT 1,
            score INTEGER DEFAULT 0,
            castle_skin VARCHAR(50) DEFAULT 'Wooden',
            tower_skin VARCHAR(50) DEFAULT 'Basic'
        )''')

        admin_pw_plain = os.getenv("ADMIN_PASSWORD")
        if not admin_pw_plain:
            admin_pw_plain = secrets.token_urlsafe(16)
            print(f"[INFO] ADMIN_PASSWORD not set. Generated: {admin_pw_plain}")

        admin_pw_hash = generate_password_hash(admin_pw_plain)
        c.execute("SELECT * FROM users WHERE username = 'admin'")
        if not c.fetchone():
            c.execute("INSERT INTO users (username, password_hash) VALUES (%s, %s)", ('admin', admin_pw_hash))
            c.execute("INSERT INTO player_saves (username) VALUES (%s)", ('admin',))
        else:
            c.execute("UPDATE users SET password_hash=%s WHERE username='admin'", (admin_pw_hash,))

        conn.commit()
        c.close()
        conn.close()
    except Exception as e:
        print(f"[ERROR] Database init failed: {e}")

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
@limiter.limit("3 per minute")
def register():
    data = request.get_json(force=True, silent=True) or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')
    if not username or not password:
        return jsonify({"error": "Required fields missing"}), 400
    if username.lower() == 'admin':
        return jsonify({"error": "Cannot register as admin. Use login."}), 400
    hashed_pw = generate_password_hash(password)
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('INSERT INTO users (username, password_hash) VALUES (%s, %s)', (username, hashed_pw))
        c.execute('INSERT INTO player_saves (username) VALUES (%s)', (username,))
        conn.commit()
        c.close()
        conn.close()
        return jsonify({"message": "Registration successful! You can now log in."})
    except psycopg2.errors.UniqueViolation:
        return jsonify({"error": "Username already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.get_json(force=True, silent=True) or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT password_hash FROM users WHERE username = %s', (username,))
        user = c.fetchone()
        c.close()
        conn.close()
        if user and check_password_hash(user[0], password):
            session['username'] = username
            return jsonify({"message": "Login successful", "username": username})
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Too many attempts. Please wait a moment."}), 429

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({"message": "Logged out successfully"})

@app.route('/api/current_user', methods=['GET'])
def current_user():
    if 'username' in session:
        return jsonify({"username": session['username']})
    return jsonify({"username": None})

@app.route('/api/save_state', methods=['POST'])
def save_state():
    if 'username' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json(force=True, silent=True) or {}
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''UPDATE player_saves SET
            gold=%s, diamonds=%s, wave=%s, score=%s, castle_skin=%s, tower_skin=%s
            WHERE username=%s''',
            (data.get('gold', 40), data.get('diamonds', 0), data.get('wave', 1),
             data.get('score', 0), data.get('castle_skin', 'Wooden'),
             data.get('tower_skin', 'Basic'), session['username']))
        conn.commit()
        c.close()
        conn.close()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/load_state', methods=['GET'])
def load_state():
    if 'username' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT gold, diamonds, wave, score, castle_skin, tower_skin FROM player_saves WHERE username=%s',
                  (session['username'],))
        row = c.fetchone()
        c.close()
        conn.close()
        if row:
            return jsonify({"gold": row[0], "diamonds": row[1], "wave": row[2],
                            "score": row[3], "castle_skin": row[4], "tower_skin": row[5]})
        return jsonify({"error": "No save found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/score', methods=['POST'])
def save_score():
    if 'username' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    score = (request.get_json(force=True, silent=True) or {}).get('score', 0)
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('INSERT INTO scores (player, score) VALUES (%s, %s)', (session['username'], score))
        conn.commit()
        c.close()
        conn.close()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error"}), 500

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT player, MAX(score) FROM scores GROUP BY player ORDER BY MAX(score) DESC LIMIT 10')
        scores = [{"player": row[0], "score": row[1]} for row in c.fetchall()]
        c.close()
        conn.close()
        return jsonify(scores)
    except Exception:
        return jsonify([]), 500
