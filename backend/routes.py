from flask import Blueprint, request, jsonify
from db import mysql,app,db
from models import Student, Admin
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']

        # 🔹 Hash password before storing
        hashed_password = generate_password_hash(password)

        cursor = mysql.connection.cursor()
        cursor.execute('INSERT INTO students (username, email, password) VALUES (%s, %s, %s)',
                       (username, email, hashed_password))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"success": True, "message": "Student created successfully!"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']

        cursor = mysql.connection.cursor()

        # 🔹 Check if the user is an admin
        cursor.execute('SELECT id, username, email, password FROM admins WHERE email = %s', (email,))
        admin = cursor.fetchone()

        if admin and check_password_hash(admin[3], password):  
            return jsonify({"success": True, "message": "Admin Login successful!", "user": {"id": admin[0], "username": admin[1], "email": admin[2], "role": "admin"}})

        # 🔹 If not admin, check if user is a student
        cursor.execute('SELECT id, username, email, password FROM students WHERE email = %s', (email,))
        student = cursor.fetchone()

        cursor.close()

        if student and check_password_hash(student[3], password):
            return jsonify({"success": True, "message": "Student Login successful!", "user": {"id": student[0], "username": student[1], "email": student[2], "role": "student"}})

        return jsonify({"success": False, "error": "Invalid credentials!"}), 401

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


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
                "timestamp": str(admin[4]) 
            }
            return jsonify({"admin": admin_details}), 200
        else:
            return jsonify({"message": "Admin not found!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
