from flask import Blueprint, jsonify
from app.controllers.alert_controller import AlertController
from app.middleware.auth import token_required, admin_required
from app.models.alert import Alert

alert_bp = Blueprint('alerts', __name__)


@alert_bp.route('/api/alerts', methods=['GET'])
@token_required
def get_all(current_user):
    return AlertController.get_all(current_user)


@alert_bp.route('/api/alerts/severity/<severity>', methods=['GET'])
@token_required
def get_by_severity(current_user, severity):
    return AlertController.get_by_severity(current_user, severity)


@alert_bp.route('/api/alerts', methods=['POST'])
@admin_required
def create(current_user):
    return AlertController.create(current_user)


@alert_bp.route('/api/alerts/<alert_id>/acknowledge', methods=['PUT'])
@token_required
def acknowledge(current_user, alert_id):
    return AlertController.acknowledge(current_user, alert_id)


@alert_bp.route('/api/alerts/acknowledge-all', methods=['PUT'])
@token_required
def acknowledge_all(current_user):
    try:
        all_alerts = Alert.find_all()
        for alert in all_alerts:
            Alert.update(str(alert['_id']), {'isAcknowledged': True})
        return jsonify({'success': True, 'message': 'All alerts acknowledged'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@alert_bp.route('/api/alerts/<alert_id>', methods=['DELETE'])
@admin_required
def delete(current_user, alert_id):
    return AlertController.delete(current_user, alert_id)
