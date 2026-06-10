from flask import request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity
from datetime import datetime
from app.models.user import User


class AuthController:
    @staticmethod
    def register():
        try:
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No input data provided'}), 400

            name = data.get('name', '').strip()
            email = data.get('email', '').strip().lower()
            password = data.get('password', '')
            role = data.get('role', 'Operator')
            department = data.get('department', '')
            phone = data.get('phone', '')

            if not name or not email or not password:
                return jsonify({'success': False, 'message': 'Name, email and password are required'}), 400

            if len(password) < 6:
                return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400

            if User.find_by_email(email):
                return jsonify({'success': False, 'message': 'Email already registered'}), 409

            user_data = {
                'name': name,
                'email': email,
                'password': password,
                'role': role,
                'department': department,
                'phone': phone,
                'avatar': '',
                'is_active': True,
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }

            user_id = User.save(user_data)
            token = create_access_token(identity=str(user_id))

            return jsonify({
                'success': True,
                'message': 'User registered successfully',
                'data': {
                    'token': token,
                    'user': User.to_dict(User.find_by_id(user_id))
                }
            }), 201

        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def login():
        try:
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No input data provided'}), 400

            email = data.get('email', '').strip().lower()
            password = data.get('password', '')

            if not email or not password:
                return jsonify({'success': False, 'message': 'Email and password are required'}), 400

            user = User.find_by_email(email)
            if not user:
                return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

            if not user.get('is_active', True):
                return jsonify({'success': False, 'message': 'Account is deactivated'}), 401

            if not User.verify_password(user['password'], password):
                return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

            token = create_access_token(identity=str(user['_id']))

            return jsonify({
                'success': True,
                'message': 'Login successful',
                'data': {
                    'token': token,
                    'user': User.to_dict(user)
                }
            }), 200

        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def get_profile(current_user):
        try:
            user = User.find_by_id(str(current_user['_id']))
            return jsonify({
                'success': True,
                'data': User.to_dict(user)
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def update_profile(current_user):
        try:
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No input data provided'}), 400

            update_data = {}
            for field in ['name', 'department', 'phone', 'avatar']:
                if field in data:
                    update_data[field] = data[field]

            if not update_data:
                return jsonify({'success': False, 'message': 'No valid fields to update'}), 400

            user_id = str(current_user['_id'])
            if not User.update(user_id, update_data):
                return jsonify({'success': False, 'message': 'Update failed'}), 500

            user = User.find_by_id(user_id)
            return jsonify({
                'success': True,
                'message': 'Profile updated successfully',
                'data': User.to_dict(user)
            }), 200

        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
