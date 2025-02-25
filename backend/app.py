from flask import Flask, request, jsonify
from config import Config
from flask_mysqldb import MySQL
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from db import app
from routes import auth
app.register_blueprint(auth)
app = Flask(__name__)
app.config.from_object(Config)
mysql = MySQL(app)
CORS(app)


@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']
        
        hashed_password = generate_password_hash(password)

        cursor = mysql.connection.cursor()
        cursor.execute('INSERT INTO students (username, email, password) VALUES (%s, %s, %s)',
                       (username, email, hashed_password))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "Student created successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']

        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM students WHERE email = %s', (email,))
        user = cursor.fetchone()
        cursor.close()

        if user and check_password_hash(user[3], password):  # user[3] is the hashed password
            return jsonify({"message": "Login successful!"}), 200
        else:
            return jsonify({"message": "Invalid credentials!"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/admin/<int:admin_id>', methods=['GET'])
def get_admin_details(admin_id):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM admins WHERE id = %s', (admin_id,))
        admin = cursor.fetchone()
        cursor.close()

        if admin:
            admin_details = {
                "id": admin[0],
                "username": admin[1],
                "email": admin[2],
                "timestamp": admin[4]  # Assuming this is the correct order
            }
            return jsonify({"admin": admin_details}), 200
        else:
            return jsonify({"message": "Admin not found!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print(app.url_map)  # Print all registered routes
    app.run(debug=True)
