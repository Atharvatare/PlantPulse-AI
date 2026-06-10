from flask import Blueprint
from app.controllers.dashboard_controller import DashboardController
from app.middleware.auth import token_required

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/api/dashboard/kpis', methods=['GET'])
@token_required
def get_kpis(current_user):
    return DashboardController.get_kpis(current_user)


@dashboard_bp.route('/api/dashboard/charts', methods=['GET'])
@token_required
def get_charts(current_user):
    return DashboardController.get_chart_data(current_user)


@dashboard_bp.route('/api/dashboard/recent-alerts', methods=['GET'])
@token_required
def get_recent_alerts(current_user):
    return DashboardController.get_recent_alerts(current_user)


@dashboard_bp.route('/api/dashboard/maintenance-summary', methods=['GET'])
@token_required
def get_maintenance_summary(current_user):
    return DashboardController.get_maintenance_summary(current_user)
