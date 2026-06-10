from flask import Blueprint
from app.controllers.work_order_controller import WorkOrderController
from app.middleware.auth import token_required, admin_required, manager_required

work_order_bp = Blueprint('work_orders', __name__)


@work_order_bp.route('/api/work-orders', methods=['GET'])
@token_required
def get_all(current_user):
    return WorkOrderController.get_all(current_user)


@work_order_bp.route('/api/work-orders/<order_id>', methods=['GET'])
@token_required
def get_by_id(current_user, order_id):
    return WorkOrderController.get_by_id(current_user, order_id)


@work_order_bp.route('/api/work-orders', methods=['POST'])
@manager_required
def create(current_user):
    return WorkOrderController.create(current_user)


@work_order_bp.route('/api/work-orders/<order_id>', methods=['PUT'])
@token_required
def update(current_user, order_id):
    return WorkOrderController.update(current_user, order_id)


@work_order_bp.route('/api/work-orders/<order_id>/status', methods=['PUT'])
@token_required
def update_status(current_user, order_id):
    return WorkOrderController.update_status(current_user, order_id)


@work_order_bp.route('/api/work-orders/<order_id>', methods=['DELETE'])
@admin_required
def delete(current_user, order_id):
    return WorkOrderController.delete(current_user, order_id)
