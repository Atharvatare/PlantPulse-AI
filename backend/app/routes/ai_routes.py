from flask import Blueprint, request, jsonify
from app.middleware.auth import token_required
from app.services.openai_service import OpenAIService
from app.models.asset import Asset
from app.ai.predictive_model import PredictiveModel

ai_bp = Blueprint('ai', __name__)
openai_service = OpenAIService()


@ai_bp.route('/api/ai/analyze', methods=['POST'])
@token_required
def analyze(current_user):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No input data provided'}), 400

        result = openai_service.analyze_asset(
            temperature=data.get('temperature', 0),
            current_load=data.get('current', data.get('current_load', 0)),
            voltage=data.get('voltage', 0),
            hours_operated=data.get('runningHours', data.get('hours_operated', 0)),
            vibration=data.get('vibration', data.get('vibrationLevel', 0))
        )
        return jsonify({'success': True, 'data': {'result': result}}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@ai_bp.route('/api/ai/chat', methods=['POST'])
@token_required
def chat(current_user):
    try:
        data = request.get_json()
        if not data or not data.get('message'):
            return jsonify({'success': False, 'message': 'Message is required'}), 400
        response = openai_service.chat_with_ai(data['message'])
        return jsonify({'success': True, 'data': {'response': response}}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@ai_bp.route('/api/ai/report/<asset_id>', methods=['POST'])
@token_required
def generate_report(current_user, asset_id):
    try:
        asset = Asset.find_by_id(asset_id)
        if not asset:
            return jsonify({'success': False, 'message': 'Asset not found'}), 404
        report = openai_service.generate_report(Asset.to_dict(asset))
        return jsonify({'success': True, 'data': {'report': report}}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@ai_bp.route('/api/ai/fault-analysis', methods=['POST'])
@token_required
def fault_analysis(current_user):
    try:
        data = request.get_json()
        asset_id = data.get('assetId', data.get('asset_id', ''))
        if not asset_id:
            return jsonify({'success': False, 'message': 'assetId is required'}), 400
        asset = Asset.find_by_id(asset_id)
        if not asset:
            asset_data = {'assetId': asset_id, 'assetName': asset_id}
        else:
            asset_data = Asset.to_dict(asset)
        symptoms = data.get('symptoms', 'General fault')
        analysis = openai_service.analyze_fault(asset_data, symptoms)
        model = PredictiveModel()
        params = {
            'temperature': data.get('temperature', 50),
            'current_load': data.get('current', 15),
            'voltage': data.get('voltage', 400),
            'hours_operated': data.get('runningHours', 2000),
            'vibration': data.get('vibration', 2.0)
        }
        probability = model.predict_failure_probability(params)
        risk_level = model.get_risk_level(probability)
        health_score = model.predict_health_score(params)
        recommendation = model.get_recommendation(health_score)

        return jsonify({
            'success': True,
            'data': {
                'analysis': analysis,
                'failureProbability': probability,
                'riskLevel': risk_level,
                'healthScore': health_score,
                'recommendedAction': recommendation
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@ai_bp.route('/api/ai/predict', methods=['POST'])
@token_required
def predict(current_user):
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
