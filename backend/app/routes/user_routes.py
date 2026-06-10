from flask import Blueprint, request, jsonify
from app.middleware.auth import admin_required
from app.models.user import User
from datetime import datetime

user_bp = Blueprint('users', __name__)


@user_bp.route('/api/users', methods=['GET'])
@admin_required
def get_all_users(current_user):
    try:
        users = User.find_all()
        return jsonify({
            'success': True,
            'data': [User.to_dict(u) for u in users],
            'count': len(users)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@user_bp.route('/api/users/<user_id>/role', methods=['PUT'])
@admin_required
def update_role(current_user, user_id):
    try:
        data = request.get_json()
        if not data or not data.get('role'):
            return jsonify({'success': False, 'message': 'Role is required'}), 400

        valid_roles = ['Admin', 'Manager', 'Operator', 'Technician', 'Viewer']
        if data['role'] not in valid_roles:
            return jsonify({
                'success': False,
                'message': f'Invalid role. Must be one of: {", ".join(valid_roles)}'
            }), 400

        if not User.find_by_id(user_id):
            return jsonify({'success': False, 'message': 'User not found'}), 404

        User.update(user_id, {
            'role': data['role'],
            'updated_at': datetime.utcnow().isoformat()
        })

        user = User.find_by_id(user_id)
        return jsonify({
            'success': True,
            'message': 'User role updated successfully',
            'data': User.to_dict(user)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@user_bp.route('/api/users/<user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id):
    try:
        if not User.find_by_id(user_id):
            return jsonify({'success': False, 'message': 'User not found'}), 404

        user = User.find_by_id(user_id)
        User.update(user_id, {
            'is_active': False,
            'updated_at': datetime.utcnow().isoformat()
        })

        return jsonify({
            'success': True,
            'message': 'User deactivated successfully'
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@user_bp.route('/api/users/<user_id>', methods=['GET'])
@admin_required
def get_user(current_user, user_id):
    try:
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        return jsonify({
            'success': True,
            'data': User.to_dict(user)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
