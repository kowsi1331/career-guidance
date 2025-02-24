from flask import Blueprint, request, jsonify
from db import init_db
from models import Student, Admin
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_student = Student(username=data['username'], email=data['email'], password=hashed_password)
    init_db.session.add(new_student)
    init_db.session.commit()
    return jsonify({"message": "Student registered successfully!"})

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    user = Admin.query.filter_by(email=data['email']).first() or Student.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({"message": "Login successful!"})
    return jsonify({"error": "Invalid credentials!"}), 401