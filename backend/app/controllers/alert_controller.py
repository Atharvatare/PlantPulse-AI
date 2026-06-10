from flask import request, jsonify
from app.models.alert import Alert


class AlertController:
    @staticmethod
    def get_all(current_user):
        try:
            alerts = Alert.find_all()
            return jsonify({
                'success': True,
                'alerts': [Alert.to_dict(a) for a in alerts]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def get_by_severity(current_user, severity):
        try:
            alerts = Alert.find_by_severity(severity)
            return jsonify({
                'success': True,
                'alerts': [Alert.to_dict(a) for a in alerts]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def create(current_user):
        try:
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No input data provided'}), 400
            alert_id = Alert.save(data)
            alert = Alert.find_by_id(alert_id)
            return jsonify({
                'success': True,
                'message': 'Alert created',
                'alert': Alert.to_dict(alert)
            }), 201
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def delete(current_user, alert_id):
        try:
            if not Alert.find_by_id(alert_id):
                return jsonify({'success': False, 'message': 'Alert not found'}), 404
            Alert.delete(alert_id)
            return jsonify({'success': True, 'message': 'Alert deleted'}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def acknowledge(current_user, alert_id):
        try:
            if not Alert.find_by_id(alert_id):
                return jsonify({'success': False, 'message': 'Alert not found'}), 404
            Alert.update(alert_id, {'isAcknowledged': True})
            return jsonify({'success': True, 'message': 'Alert acknowledged'}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
