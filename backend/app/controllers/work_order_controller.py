from flask import request, jsonify
from datetime import datetime
from app.models.work_order import WorkOrder


class WorkOrderController:
    @staticmethod
    def get_all(current_user):
        try:
            page = int(request.args.get('page', 1))
            limit = int(request.args.get('limit', 10))
            status_f = request.args.get('status', '')
            search = request.args.get('search', '')

            all_orders = WorkOrder.find_all()
            if status_f:
                all_orders = [o for o in all_orders if o.get('status', '').lower() == status_f.lower()]
            if search:
                s = search.lower()
                all_orders = [o for o in all_orders if s in o.get('ticketNumber', '').lower() or s in o.get('assetId', '').lower()]

            total = len(all_orders)
            total_pages = max(1, (total + limit - 1) // limit)
            start = (page - 1) * limit

            return jsonify({
                'success': True,
                'workOrders': [WorkOrder.to_dict(o) for o in all_orders[start:start + limit]],
                'totalPages': total_pages,
                'total': total,
                'page': page
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def get_by_id(current_user, order_id):
        try:
            order = WorkOrder.find_by_id(order_id)
            if not order:
                return jsonify({'success': False, 'message': 'Work order not found'}), 404
            return jsonify({'success': True, 'data': WorkOrder.to_dict(order)}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def create(current_user):
        try:
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No input data provided'}), 400
            if not data.get('description'):
                return jsonify({'success': False, 'message': 'Description is required'}), 400
            data['status'] = 'Open'
            data['assignedTo'] = data.get('assignedTo', data.get('assignedEngineer', ''))
            data['ticketNumber'] = data.get('ticketNumber', f'WO-{datetime.utcnow().strftime("%y%m%d%H%M%S")}')
            order_id = WorkOrder.save(data)
            order = WorkOrder.find_by_id(order_id)
            return jsonify({
                'success': True,
                'message': 'Work order created',
                'data': WorkOrder.to_dict(order)
            }), 201
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def update(current_user, order_id):
        try:
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No input data provided'}), 400
            if not WorkOrder.find_by_id(order_id):
                return jsonify({'success': False, 'message': 'Work order not found'}), 404
            if 'status' in data and data['status'] == 'Completed':
                data['completedDate'] = datetime.utcnow().isoformat()
            if not WorkOrder.update(order_id, data):
                return jsonify({'success': False, 'message': 'Update failed'}), 500
            return jsonify({'success': True, 'message': 'Work order updated'}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def update_status(current_user, order_id):
        try:
            data = request.get_json()
            new_status = data.get('status', '') if data else ''
            if new_status not in ('Open', 'In Progress', 'Completed'):
                return jsonify({'success': False, 'message': 'Invalid status'}), 400
            if not WorkOrder.find_by_id(order_id):
                return jsonify({'success': False, 'message': 'Work order not found'}), 404
            update_data = {'status': new_status}
            if new_status == 'Completed':
                update_data['completedDate'] = datetime.utcnow().isoformat()
            if not WorkOrder.update(order_id, update_data):
                return jsonify({'success': False, 'message': 'Update failed'}), 500
            return jsonify({'success': True, 'message': f'Status updated to {new_status}'}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def delete(current_user, order_id):
        try:
            if not WorkOrder.find_by_id(order_id):
                return jsonify({'success': False, 'message': 'Work order not found'}), 404
            WorkOrder.delete(order_id)
            return jsonify({'success': True, 'message': 'Work order deleted'}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
