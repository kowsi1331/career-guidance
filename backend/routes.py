from flask import Blueprint, request, jsonify
from db import db
from models import Student, Admin
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_student = Student(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_student)
    db.session.commit()
    return jsonify({"message": "Student registered successfully!"})

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    user = Admin.query.filter_by(email=data['email']).first() or Student.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({"message": "Login successful!"})
    return jsonify({"error": "Invalid credentials!"}), 401
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
