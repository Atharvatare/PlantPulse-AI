from flask import jsonify
from datetime import datetime, timedelta
import random
from app.models.asset import Asset
from app.models.alert import Alert
from app.models.work_order import WorkOrder
from app.models.maintenance import Maintenance


class DashboardController:
    @staticmethod
    def get_kpis(current_user):
        try:
            all_assets = Asset.find_all()
            total_assets = len(all_assets)
            running = sum(1 for a in all_assets if a.get('status') == 'Running')
            faulty = sum(1 for a in all_assets if a.get('status') == 'Faulty')

            all_orders = WorkOrder.find_all()
            open_wo = sum(1 for o in all_orders if o.get('status') in ('Open', 'In Progress'))

            all_maint = Maintenance.find_all()
            maint_tasks = len(all_maint)

            return jsonify({
                'success': True,
                'data': {
                    'totalAssets': total_assets,
                    'runningAssets': running,
                    'faultyAssets': faulty,
                    'openWorkOrders': open_wo,
                    'energyConsumption': f'{random.randint(120, 180)} kWh',
                    'maintenanceTasks': maint_tasks,
                    'assetTrend': '+12%',
                    'runningTrend': '+5%',
                    'faultyTrend': '-3%',
                    'workOrderTrend': '+8%',
                    'energyChange': '-2.4% vs last month',
                    'tasksDue': f'{random.randint(3, 8)} due this week'
                }
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def get_chart_data(current_user):
        try:
            return jsonify({
                'success': True,
                'data': {
                    'healthTrend': [88, 85, 82, 86, 84, 80, 78, 82, 85, 83, 86, 89],
                    'failureTrend': [12, 15, 18, 14, 11, 20, 22, 17, 13, 10, 8, 6],
                    'costTrend': [45, 52, 38, 41, 55, 48, 35, 42, 39, 33, 28, 25],
                    'downtimeBreakdown': [35, 25, 25, 15]
                }
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def get_recent_alerts(current_user):
        try:
            alerts = Alert.find_all()[:10]
            return jsonify({
                'success': True,
                'data': {
                    'alerts': [Alert.to_dict(a) for a in alerts]
                }
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @staticmethod
    def get_maintenance_summary(current_user):
        try:
            all_maint = Maintenance.find_all()
            total = len(all_maint)
            scheduled = sum(1 for m in all_maint if m.get('status') == 'Scheduled')
            in_progress = sum(1 for m in all_maint if m.get('status') == 'In Progress')
            completed = sum(1 for m in all_maint if m.get('status') == 'Completed')
            total_cost = sum(m.get('cost', 0) for m in all_maint)
            return jsonify({
                'success': True,
                'data': {
                    'total': total, 'scheduled': scheduled,
                    'in_progress': in_progress, 'completed': completed,
                    'total_cost': total_cost
                }
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
