# app.py
from flask import Flask, request, jsonify, render_template, session
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
import os
import socket

try:
    from pyngrok import ngrok
    NGROK_ENABLED = True
except ImportError:
    print("\n[WARNING] pyngrok is not installed! The worldwide link will not work.")
    print("Please stop the server and run: pip install pyngrok\n")
    NGROK_ENABLED = False

app = Flask(__name__)
app.secret_key = "super_secret_game_key_123"

# ========================================================
# 🛑 PASTE YOUR NGROK AUTHTOKEN HERE INSIDE THE QUOTES!
NGROK_AUTH_TOKEN = "3AyP3mYp7zfag331VgnhHQBxXWY_3k5PyK8ANU64HqwknERyW" 
# ========================================================

global_public_url = None

DB_NAME = "game_development"
DB_USER = os.getenv("PG_USER", "postgres")
DB_PASSWORD = "12345"
DB_HOST = os.getenv("PG_HOST", "localhost")
DB_PORT = os.getenv("PG_PORT", "5432")

def get_db_connection():
    return psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)

def init_db():
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL)''')
        c.execute('''CREATE TABLE IF NOT EXISTS scores (id SERIAL PRIMARY KEY, player VARCHAR(50) NOT NULL, score INTEGER NOT NULL)''')
        c.execute('''CREATE TABLE IF NOT EXISTS player_saves (
            username VARCHAR(50) PRIMARY KEY,
            gold INTEGER DEFAULT 40,
            diamonds INTEGER DEFAULT 0,
            wave INTEGER DEFAULT 1,
            score INTEGER DEFAULT 0,
            castle_skin VARCHAR(50) DEFAULT 'Wooden',
            tower_skin VARCHAR(50) DEFAULT 'Basic'
        )''')
        
        admin_pw = generate_password_hash("12345")
        c.execute("SELECT * FROM users WHERE username = 'admin'")
        if not c.fetchone():
            c.execute("INSERT INTO users (username, password_hash) VALUES (%s, %s)", ('admin', admin_pw))
            c.execute("INSERT INTO player_saves (username) VALUES (%s)", ('admin',))
            
        conn.commit()
        c.close()
        conn.close()
    except Exception as e:
        print(f"Error initializing database: {e}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password: return jsonify({"error": "Required fields missing"}), 400
    if username.lower() == 'admin': return jsonify({"error": "Cannot register as admin. Use login."}), 400
        
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
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
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

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({"message": "Logged out successfully"})

@app.route('/api/current_user', methods=['GET'])
def current_user():
    if 'username' in session: return jsonify({"username": session['username']})
    return jsonify({"username": None})

@app.route('/api/save_state', methods=['POST'])
def save_state():
    if 'username' not in session: return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            UPDATE player_saves SET 
            gold=%s, diamonds=%s, wave=%s, score=%s, castle_skin=%s, tower_skin=%s
            WHERE username=%s
        ''', (
            data.get('gold', 40), data.get('diamonds', 0), data.get('wave', 1), data.get('score', 0),
            data.get('castle_skin', 'Wooden'), data.get('tower_skin', 'Basic'), session['username']
        ))
        conn.commit()
        c.close()
        conn.close()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/load_state', methods=['GET'])
def load_state():
    if 'username' not in session: return jsonify({"error": "Unauthorized"}), 401
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT gold, diamonds, wave, score, castle_skin, tower_skin FROM player_saves WHERE username=%s', (session['username'],))
        row = c.fetchone()
        c.close()
        conn.close()
        if row:
            return jsonify({"gold": row[0], "diamonds": row[1], "wave": row[2], "score": row[3], "castle_skin": row[4], "tower_skin": row[5]})
        return jsonify({"error": "No save found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/score', methods=['POST'])
def save_score():
    if 'username' not in session: return jsonify({"error": "Unauthorized"}), 401
    score = request.json.get('score', 0)
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
        scores =[{"player": row[0], "score": row[1]} for row in c.fetchall()]
        c.close()
        conn.close()
        return jsonify(scores)
    except Exception: return jsonify([]), 500

@app.route('/api/admin/link', methods=['GET'])
def get_admin_link():
    if session.get('username') != 'admin': return jsonify({"error": "Unauthorized"}), 403
    global global_public_url
    if global_public_url: return jsonify({"link": global_public_url})
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception: local_ip = "127.0.0.1"
    return jsonify({"link": f"http://{local_ip}:5000"})

<<<<<<< HEAD
=======
@app.route('/api/admin/players', methods=['GET'])
def admin_get_players():
    if session.get('username') != 'admin': return jsonify({"error": "Unauthorized"}), 403
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            SELECT u.username, ps.gold, ps.diamonds, ps.wave, ps.score, ps.castle_skin, ps.tower_skin,
                   COALESCE((SELECT MAX(s.score) FROM scores s WHERE s.player = u.username), 0) as best_score,
                   COALESCE((SELECT COUNT(*) FROM scores s WHERE s.player = u.username), 0) as games_played
            FROM users u
            LEFT JOIN player_saves ps ON u.username = ps.username
            ORDER BY best_score DESC
        ''')
        rows = c.fetchall()
        c.close(); conn.close()
        return jsonify([{
            "username": r[0], "gold": r[1], "diamonds": r[2], "wave": r[3],
            "score": r[4], "castle_skin": r[5], "tower_skin": r[6],
            "best_score": r[7], "games_played": r[8]
        } for r in rows])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/delete_player', methods=['POST'])
def admin_delete_player():
    if session.get('username') != 'admin': return jsonify({"error": "Unauthorized"}), 403
    username = request.json.get('username')
    if username == 'admin': return jsonify({"error": "Cannot delete admin"}), 400
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('DELETE FROM scores WHERE player = %s', (username,))
        c.execute('DELETE FROM player_saves WHERE username = %s', (username,))
        c.execute('DELETE FROM users WHERE username = %s', (username,))
        conn.commit(); c.close(); conn.close()
        return jsonify({"status": "success", "message": f"Player '{username}' deleted."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/reset_score', methods=['POST'])
def admin_reset_score():
    if session.get('username') != 'admin': return jsonify({"error": "Unauthorized"}), 403
    username = request.json.get('username')
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('DELETE FROM scores WHERE player = %s', (username,))
        c.execute('UPDATE player_saves SET score=0, wave=1 WHERE username=%s', (username,))
        conn.commit(); c.close(); conn.close()
        return jsonify({"status": "success", "message": f"Scores reset for '{username}'."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/give_currency', methods=['POST'])
def admin_give_currency():
    if session.get('username') != 'admin': return jsonify({"error": "Unauthorized"}), 403
    data = request.json
    username = data.get('username')
    gold = int(data.get('gold', 0))
    diamonds = int(data.get('diamonds', 0))
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('UPDATE player_saves SET gold=gold+%s, diamonds=diamonds+%s WHERE username=%s', (gold, diamonds, username))
        conn.commit(); c.close(); conn.close()
        return jsonify({"status": "success", "message": f"Gave {gold}g / {diamonds}💎 to '{username}'."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/all_scores', methods=['GET'])
def admin_all_scores():
    if session.get('username') != 'admin': return jsonify({"error": "Unauthorized"}), 403
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT player, score, id FROM scores ORDER BY score DESC LIMIT 50')
        rows = c.fetchall()
        c.close(); conn.close()
        return jsonify([{"player": r[0], "score": r[1], "id": r[2]} for r in rows])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/delete_score', methods=['POST'])
def admin_delete_score():
    if session.get('username') != 'admin': return jsonify({"error": "Unauthorized"}), 403
    score_id = request.json.get('id')
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('DELETE FROM scores WHERE id = %s', (score_id,))
        conn.commit(); c.close(); conn.close()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/stats', methods=['GET'])
def admin_stats():
    if session.get('username') != 'admin': return jsonify({"error": "Unauthorized"}), 403
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT COUNT(*) FROM users')
        total_users = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM users WHERE username != 'admin'")
        player_count = c.fetchone()[0]
        c.execute('SELECT COUNT(*) FROM scores')
        total_games = c.fetchone()[0]
        c.execute('SELECT MAX(score) FROM scores')
        top_score = c.fetchone()[0] or 0
        c.execute('SELECT player FROM scores ORDER BY score DESC LIMIT 1')
        top_player_row = c.fetchone()
        top_player = top_player_row[0] if top_player_row else 'N/A'
        c.execute('SELECT AVG(score) FROM scores')
        avg_score = round(c.fetchone()[0] or 0)
        c.close(); conn.close()
        return jsonify({
            "total_users": total_users,
            "player_count": player_count,
            "total_games": total_games,
            "top_score": top_score,
            "top_player": top_player,
            "avg_score": avg_score,
            "server_link": global_public_url or "Local only"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

>>>>>>> fd12a7adb7477c7464908299a05ec670f5f9eaf4
if __name__ == '__main__':
    init_db()
    if NGROK_ENABLED:
        try:
            if NGROK_AUTH_TOKEN: ngrok.set_auth_token(NGROK_AUTH_TOKEN)
            public_tunnel = ngrok.connect(5000)
            global_public_url = public_tunnel.public_url
            print(f"\n🌍 WORLDWIDE PUBLIC LINK: {global_public_url}\n")
        except Exception as e: print(f"Ngrok error: {e}")
    app.run(host='0.0.0.0', debug=True, port=5000, use_reloader=False)