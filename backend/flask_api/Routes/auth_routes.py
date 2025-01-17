from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from Database.db import db
from __main__ import app
from functools import wraps

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = db.Users.find_one({'email': data['email']})
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/user', methods=['GET'])
@token_required
def get_user(current_user):
    user_data = {
        'id': str(current_user['_id']),
        'email': current_user['email'],
        'firstName': current_user.get('firstName', ''),
        'lastName': current_user.get('lastName', ''),
        'phone': current_user.get('phone', '')
    }
    print(user_data)
    return jsonify({'user': user_data}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']
    firstName = request.json['firstName']
    lastName = request.json['lastName']
    phone = request.json['phone']

    if 'edu' in email:
        user = db.Users.find_one({'email': email})
        if user:
            return jsonify({'error': 'User already exists'}), 409

        hashed_password = generate_password_hash(password)
        user = {
            'email': email,
            'password': hashed_password,
            'name': f"{firstName} {lastName}",
            # ... any other fields you want to include
        }
        db.Users.insert_one(user)
        user_from_db = db.Users.find_one({'email': email})
        token = jwt.encode({
            'user_id': str(user_from_db['_id']),
            'email': email,
            'name': user['name'],
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({"token": token}), 200
    else:
        return jsonify({'error': 'Not a school email'}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    user = db.Users.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'email': user['email'],
            'name': user.get('name', ''),
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({"token": token}), 200
    else:
        return jsonify({'error': 'Invalid login credentials'}), 400

# Protected route example
@auth_bp.route('/protected', methods=['GET'])
@token_required
def protected():
    return jsonify({'message': 'This is a protected route'})