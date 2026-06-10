from datetime import datetime, timedelta
from app import mongo
from app.models.asset import Asset
from app.models.maintenance import Maintenance
from app.models.work_order import WorkOrder


class ReportService:
    @staticmethod
    def generate_asset_report(asset_id):
        asset = Asset.find_by_id(asset_id)
        if not asset:
            return None

        maintenance_records = Maintenance.find_by_asset(asset_id)
        work_orders = list(mongo.db.work_orders.find({'asset_id': asset_id}))
        sensor_readings = list(mongo.db.sensor_data.find(
            {'asset_id': asset_id}
        ).sort('recorded_at', -1).limit(50))

        return {
            'asset': Asset.to_dict(asset),
            'maintenance_history': [Maintenance.to_dict(m) for m in maintenance_records],
            'work_orders': [WorkOrder.to_dict(wo) for wo in work_orders],
            'sensor_readings': [{
                'temperature': s.get('temperature'),
                'current_load': s.get('current_load'),
                'recorded_at': s.get('recorded_at')
            } for s in sensor_readings],
            'generated_at': datetime.utcnow().isoformat()
        }

    @staticmethod
    def generate_maintenance_report(start_date, end_date):
        query = {}
        if start_date and end_date:
            query['created_at'] = {
                '$gte': start_date,
                '$lte': end_date
            }

        records = list(mongo.db.maintenance.find(query).sort('created_at', -1))

        total_cost = sum(r.get('cost', 0) for r in records)
        scheduled = sum(1 for r in records if r.get('status') == 'Scheduled')
        in_progress = sum(1 for r in records if r.get('status') == 'In Progress')
        completed = sum(1 for r in records if r.get('status') == 'Completed')

        return {
            'total_records': len(records),
            'total_cost': total_cost,
            'scheduled': scheduled,
            'in_progress': in_progress,
            'completed': completed,
            'records': [Maintenance.to_dict(r) for r in records],
            'generated_at': datetime.utcnow().isoformat()
        }

    @staticmethod
    def generate_failure_report():
        faulty_assets = Asset.find_all({'status': 'Faulty'})
        critical_alerts = list(mongo.db.alerts.find({
            'severity': {'$in': ['High', 'Critical']}
        }).sort('created_at', -1).limit(100))

        return {
            'total_faulty_assets': len(faulty_assets),
            'assets': [Asset.to_dict(a) for a in faulty_assets],
            'critical_alerts': [{
                'id': str(a['_id']),
                'message': a.get('message'),
                'severity': a.get('severity'),
                'created_at': a.get('created_at')
            } for a in critical_alerts],
            'generated_at': datetime.utcnow().isoformat()
        }

    @staticmethod
    def generate_monthly_report(month, year):
        start_date = f'{year}-{month:02d}-01'
        if month == 12:
            end_date = f'{year + 1}-01-01'
        else:
            end_date = f'{year}-{month + 1:02d}-01'

        maintenance = list(mongo.db.maintenance.find({
            'created_at': {'$gte': start_date, '$lt': end_date}
        }))

        work_orders = list(mongo.db.work_orders.find({
            'created_at': {'$gte': start_date, '$lt': end_date}
        }))

        alerts = list(mongo.db.alerts.find({
            'created_at': {'$gte': start_date, '$lt': end_date}
        }))

        total_assets = mongo.db.assets.count_documents({})
        new_assets = mongo.db.assets.count_documents({
            'created_at': {'$gte': start_date, '$lt': end_date}
        })

        return {
            'month': month,
            'year': year,
            'total_assets': total_assets,
            'new_assets': new_assets,
            'maintenance_count': len(maintenance),
            'work_orders_count': len(work_orders),
            'alerts_count': len(alerts),
            'maintenance_cost': sum(r.get('cost', 0) for r in maintenance),
            'generated_at': datetime.utcnow().isoformat()
        }
