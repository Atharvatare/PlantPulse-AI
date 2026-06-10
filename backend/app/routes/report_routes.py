from flask import Blueprint, request, jsonify
from app.middleware.auth import token_required, admin_required
from app.services.report_service import ReportService
from app.models.ai_report import AIReport

report_bp = Blueprint('reports', __name__)


@report_bp.route('/api/reports/asset/<asset_id>', methods=['GET'])
@token_required
def asset_report(current_user, asset_id):
    try:
        report = ReportService.generate_asset_report(asset_id)
        if not report:
            return jsonify({'success': False, 'message': 'Asset not found'}), 404
        return jsonify({'success': True, 'data': report}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@report_bp.route('/api/reports/maintenance', methods=['GET'])
@token_required
def maintenance_report(current_user):
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        report = ReportService.generate_maintenance_report(start_date, end_date)
        return jsonify({'success': True, 'data': report}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@report_bp.route('/api/reports/failure', methods=['GET'])
@token_required
def failure_report(current_user):
    try:
        report = ReportService.generate_failure_report()
        return jsonify({'success': True, 'data': report}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@report_bp.route('/api/reports/monthly', methods=['GET'])
@token_required
def monthly_report(current_user):
    try:
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)

        from datetime import datetime
        now = datetime.utcnow()
        if not month:
            month = now.month
        if not year:
            year = now.year

        report = ReportService.generate_monthly_report(month, year)
        return jsonify({'success': True, 'data': report}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@report_bp.route('/api/reports/save', methods=['POST'])
@admin_required
def save_report(current_user):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No input data provided'}), 400

        data['created_by'] = str(current_user['_id'])
        report_id = AIReport.save(data)
        report = AIReport.find_by_id(report_id)

        return jsonify({
            'success': True,
            'message': 'Report saved successfully',
            'data': AIReport.to_dict(report)
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@report_bp.route('/api/reports', methods=['GET'])
@token_required
def get_all_reports(current_user):
    try:
        filters = {}
        if request.args.get('asset_id'):
            filters['asset_id'] = request.args['asset_id']
        if request.args.get('report_type'):
            filters['report_type'] = request.args['report_type']

        all_reports = AIReport.find_all()
        if filters.get('asset_id'):
            all_reports = [r for r in all_reports if r.get('assetId') == filters['asset_id']]
        if filters.get('report_type'):
            all_reports = [r for r in all_reports if r.get('type') == filters['report_type']]
        return jsonify({
            'success': True,
            'reports': [AIReport.to_dict(r) for r in all_reports],
            'count': len(all_reports)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@report_bp.route('/api/reports/<report_id>', methods=['GET'])
@token_required
def get_report(current_user, report_id):
    try:
        report = AIReport.find_by_id(report_id)
        if not report:
            return jsonify({'success': False, 'message': 'Report not found'}), 404
        return jsonify({'success': True, 'data': AIReport.to_dict(report)}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@report_bp.route('/api/reports/<report_id>', methods=['DELETE'])
@admin_required
def delete_report(current_user, report_id):
    try:
        if not AIReport.find_by_id(report_id):
            return jsonify({'success': False, 'message': 'Report not found'}), 404
        AIReport.delete(report_id)
        return jsonify({'success': True, 'message': 'Report deleted successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
