from flask import request, jsonify
from bson.objectid import ObjectId
from app.models.asset import Asset
from app.models.local_store import store


class AssetController:
    @staticmethod
    def get_all_assets(current_user):
        try:
            page = int(request.args.get('page', 1))
            limit = int(request.args.get('limit', 10))
            search = request.args.get('search', '')
            status_f = request.args.get('status', '')
            category = request.args.get('category', '')

            all_assets = Asset.find_all()
            if status_f:
                all_assets = [a for a in all_assets if a.get('status', '').lower() == status_f.lower()]
            if category:
                all_assets = [a for a in all_assets if a.get('category', '').lower() == category.lower()]
            if search:
                s = search.lower()
                all_assets = [a for a in all_assets if s in a.get('assetName', '').lower() or s in a.get('assetId', '').lower()]

            total = len(all_assets)
            total_pages = max(1, (total + limit - 1) // limit)
            start = (page - 1) * limit
            page_items = [Asset.to_dict(a) for a in all_assets[start:start + limit]]

            return jsonify({
                'success': True,
                'assets': page_items,
                'totalPages': total_pages,
                'total': total,
                'page': page
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def get_asset(current_user, asset_id):
        try:
            asset = Asset.find_by_id(asset_id)
            if not asset:
                return jsonify({'success': False, 'message': 'Asset not found'}), 404
            return jsonify({'success': True, 'asset': Asset.to_dict(asset)}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def create_asset(current_user):
        try:
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No input data provided'}), 400
            required = ['assetName', 'category']
            for field in required:
                if field not in data or not data[field]:
                    return jsonify({'success': False, 'message': f'{field} is required'}), 400
            data['healthScore'] = data.get('healthScore', 100)
            data['status'] = data.get('status', 'Running')
            asset_id = Asset.save(data)
            asset = Asset.find_by_id(asset_id)
            return jsonify({
                'success': True,
                'message': 'Asset created successfully',
                'asset': Asset.to_dict(asset)
            }), 201
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def update_asset(current_user, asset_id):
        try:
            if not Asset.find_by_id(asset_id):
                return jsonify({'success': False, 'message': 'Asset not found'}), 404
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No input data provided'}), 400
            if not Asset.update(asset_id, data):
                return jsonify({'success': False, 'message': 'Update failed'}), 500
            asset = Asset.find_by_id(asset_id)
            return jsonify({
                'success': True,
                'message': 'Asset updated successfully',
                'asset': Asset.to_dict(asset)
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def delete_asset(current_user, asset_id):
        try:
            if not Asset.find_by_id(asset_id):
                return jsonify({'success': False, 'message': 'Asset not found'}), 404
            Asset.delete(asset_id)
            return jsonify({'success': True, 'message': 'Asset deleted successfully'}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def get_asset_stats(current_user):
        try:
            all_assets = Asset.find_all()
            total = len(all_assets)
            running = sum(1 for a in all_assets if a.get('status') == 'Running')
            faulty = sum(1 for a in all_assets if a.get('status') == 'Faulty')
            maintenance = sum(1 for a in all_assets if a.get('status') == 'Maintenance')
            stopped = sum(1 for a in all_assets if a.get('status') == 'Stopped')
            return jsonify({
                'success': True,
                'data': {
                    'total': total, 'running': running, 'faulty': faulty,
                    'maintenance': maintenance, 'stopped': stopped
                }
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
