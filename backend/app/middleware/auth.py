from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.find_by_id(user_id)
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User not found'
                }), 401
            if not user.get('is_active', True):
                return jsonify({
                    'success': False,
                    'message': 'Account is deactivated'
                }), 401
            return f(user, *args, **kwargs)
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Token is invalid or expired',
                'error': str(e)
            }), 401
    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.find_by_id(user_id)
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User not found'
                }), 401
            if user.get('role') != 'Admin':
                return jsonify({
                    'success': False,
                    'message': 'Admin privileges required'
                }), 403
            return f(user, *args, **kwargs)
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Token is invalid or expired',
                'error': str(e)
            }), 401
    return decorated


def manager_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.find_by_id(user_id)
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User not found'
                }), 401
            if user.get('role') not in ['Admin', 'Manager']:
                return jsonify({
                    'success': False,
                    'message': 'Manager or Admin privileges required'
                }), 403
            return f(user, *args, **kwargs)
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Token is invalid or expired',
                'error': str(e)
            }), 401
    return decorated
