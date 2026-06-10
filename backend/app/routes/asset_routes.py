from flask import Blueprint
from app.controllers.asset_controller import AssetController
from app.middleware.auth import token_required, admin_required

asset_bp = Blueprint('assets', __name__)


@asset_bp.route('/api/assets', methods=['GET'])
@token_required
def get_all(current_user):
    return AssetController.get_all_assets(current_user)


@asset_bp.route('/api/assets/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    return AssetController.get_asset_stats(current_user)


@asset_bp.route('/api/assets/<asset_id>', methods=['GET'])
@token_required
def get_asset(current_user, asset_id):
    return AssetController.get_asset(current_user, asset_id)


@asset_bp.route('/api/assets', methods=['POST'])
@admin_required
def create_asset(current_user):
    return AssetController.create_asset(current_user)


@asset_bp.route('/api/assets/<asset_id>', methods=['PUT'])
@admin_required
def update_asset(current_user, asset_id):
    return AssetController.update_asset(current_user, asset_id)


@asset_bp.route('/api/assets/<asset_id>', methods=['DELETE'])
@admin_required
def delete_asset(current_user, asset_id):
    return AssetController.delete_asset(current_user, asset_id)
