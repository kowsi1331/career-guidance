from flask import Blueprint, request, jsonify
from db import mysql,app,db
from models import Student, Admin


auth = Blueprint('auth', __name__)
@auth.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({"success": False, "error": "All fields are required!"}), 400

        cursor = mysql.connection.cursor()

        # 🔹 Check if email already exists
        cursor.execute('SELECT * FROM students WHERE email = %s', (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({"success": False, "error": "Email already exists!"}), 400

        # 🔹 Insert new student
        cursor.execute('INSERT INTO students (username, email, password) VALUES (%s, %s, %s)', (username, email, password))
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

        if admin:
            print(f"Admin found: {admin}")  # ✅ Debugging print
        else:
            print("Admin not found")

        if admin and admin[3] == password:  # ✅ Compare plain text passwords
            return jsonify({"success": True, "message": "Admin Login successful!", "user": {"id": admin[0], "username": admin[1], "email": admin[2], "role": "admin"}}), 200

        # 🔹 If not admin, check if user is a student
        cursor.execute('SELECT id, username, email, password FROM students WHERE email = %s', (email,))
        student = cursor.fetchone()

        cursor.close()

        if student:
            print(f"Student found: {student}")  # ✅ Debugging print
        else:
            print("Student not found")

        if student and student[3] == password:  # ✅ Compare plain text passwords
            return jsonify({"success": True, "message": "Student Login successful!", "user": {"id": student[0], "username": student[1], "email": student[2], "role": "student"}}), 200

        return jsonify({"success": False, "error": "Invalid credentials!"}), 401

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
