from flask import request, jsonify
from app.models.maintenance import Maintenance


class MaintenanceController:
    @staticmethod
    def get_all(current_user):
        try:
            records = Maintenance.find_all()
            return jsonify({
                'success': True,
                'records': [Maintenance.to_dict(r) for r in records]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def get_by_asset(current_user, asset_id):
        try:
            records = Maintenance.find_by_asset(asset_id)
            return jsonify({
                'success': True,
                'records': [Maintenance.to_dict(r) for r in records]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def create(current_user):
        try:
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No input data provided'}), 400
            record_id = Maintenance.save(data)
            record = Maintenance.find_by_id(record_id)
            return jsonify({
                'success': True,
                'message': 'Maintenance record created',
                'data': Maintenance.to_dict(record)
            }), 201
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def update(current_user, record_id):
        try:
            if not Maintenance.find_by_id(record_id):
                return jsonify({'success': False, 'message': 'Record not found'}), 404
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No input data provided'}), 400
            Maintenance.update(record_id, data)
            return jsonify({'success': True, 'message': 'Record updated'}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def delete(current_user, record_id):
        try:
            if not Maintenance.find_by_id(record_id):
                return jsonify({'success': False, 'message': 'Record not found'}), 404
            Maintenance.delete(record_id)
            return jsonify({'success': True, 'message': 'Record deleted'}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
