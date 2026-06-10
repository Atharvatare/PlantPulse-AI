from flask import Blueprint, request, jsonify
from app.controllers.maintenance_controller import MaintenanceController
from app.middleware.auth import token_required, admin_required
from app.ai.predictive_model import PredictiveModel

maintenance_bp = Blueprint('maintenance', __name__)


@maintenance_bp.route('/api/maintenance', methods=['GET'])
@token_required
def get_all(current_user):
    return MaintenanceController.get_all(current_user)


@maintenance_bp.route('/api/maintenance/asset/<asset_id>', methods=['GET'])
@token_required
def get_by_asset(current_user, asset_id):
    return MaintenanceController.get_by_asset(current_user, asset_id)


@maintenance_bp.route('/api/maintenance', methods=['POST'])
@admin_required
def create(current_user):
    return MaintenanceController.create(current_user)


@maintenance_bp.route('/api/maintenance/<record_id>', methods=['PUT'])
@token_required
def update(current_user, record_id):
    return MaintenanceController.update(current_user, record_id)


@maintenance_bp.route('/api/maintenance/<record_id>', methods=['DELETE'])
@admin_required
def delete(current_user, record_id):
    return MaintenanceController.delete(current_user, record_id)


@maintenance_bp.route('/api/maintenance/analyze', methods=['POST'])
@token_required
def analyze(current_user):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No input data provided'}), 400

        model = PredictiveModel()
        params = {
            'temperature': data.get('temperature', 0),
            'current_load': data.get('current', data.get('current_load', 0)),
            'voltage': data.get('voltage', 0),
            'hours_operated': data.get('runningHours', data.get('hours_operated', 0)),
            'vibration': data.get('vibration', data.get('vibrationLevel', 0))
        }

        health_score = model.predict_health_score(params)
        probability = model.predict_failure_probability(params)
        risk_level = model.get_risk_level(probability)
        recommendation = model.get_recommendation(health_score)

        return jsonify({
            'success': True,
            'data': {
                'result': {
                    'healthScore': health_score,
                    'failureProbability': probability,
                    'riskLevel': risk_level,
                    'recommendedAction': recommendation
                }
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@maintenance_bp.route('/api/maintenance/predictions', methods=['GET'])
@token_required
def predictions(current_user):
    from app.models.asset import Asset
    model = PredictiveModel()
    all_assets = Asset.find_all()
    results = []
    for a in all_assets:
        params = {
            'temperature': a.get('temperature', 50 + hash(a.get('assetId', '')) % 40),
            'current_load': a.get('current', 10 + hash(a.get('assetId', '')) % 30),
            'voltage': a.get('voltage', 400 + hash(a.get('assetId', '')) % 50),
            'hours_operated': a.get('runningHours', 1000 + hash(a.get('assetId', '')) % 5000),
            'vibration': a.get('vibration', 1 + hash(a.get('assetId', '')) % 5)
        }
        hs = model.predict_health_score(params)
        fp = model.predict_failure_probability(params)
        rl = model.get_risk_level(fp)
        results.append({
            'assetId': a.get('assetId', ''),
            'assetName': a.get('assetName', ''),
            'healthScore': hs,
            'failureProbability': fp,
            'riskLevel': rl
        })
    return jsonify({'success': True, 'data': {'predictions': results}}), 200


@maintenance_bp.route('/api/maintenance/history/<asset_id>', methods=['GET'])
@token_required
def history(current_user, asset_id):
    records = MaintenanceController.get_by_asset(current_user, asset_id)
    return records
