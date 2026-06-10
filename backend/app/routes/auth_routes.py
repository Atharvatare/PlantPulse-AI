from flask import Blueprint
from app.controllers.auth_controller import AuthController
from app.middleware.auth import token_required

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    return AuthController.register()


@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    return AuthController.login()


@auth_bp.route('/api/auth/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return AuthController.get_profile(current_user)


@auth_bp.route('/api/auth/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    return AuthController.update_profile(current_user)
