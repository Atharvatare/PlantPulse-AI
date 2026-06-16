from datetime import datetime, timedelta
from app.models.asset import Asset
from app.models.maintenance import Maintenance
from app.models.work_order import WorkOrder
from app.models.alert import Alert
from app.models.sensor_data import SensorData


class ReportService:
    @staticmethod
    def generate_asset_report(asset_id):
        asset = Asset.find_by_id(asset_id)
        if not asset:
            return None

        maintenance_records = Maintenance.find_by_asset(asset_id)
        work_orders = [wo for wo in WorkOrder.find_all() if wo.get('assetId') == asset_id or wo.get('asset_id') == asset_id]
        sensor_readings = SensorData.find_by_asset(asset_id)[:50]

        return {
            'asset': Asset.to_dict(asset),
            'maintenance_history': [Maintenance.to_dict(m) for m in maintenance_records],
            'work_orders': [WorkOrder.to_dict(wo) for wo in work_orders],
            'sensor_readings': [{
                'temperature': s.get('temperature', 0),
                'current_load': s.get('current', s.get('current_load', 0)),
                'recorded_at': s.get('timestamp', s.get('recorded_at', ''))
            } for s in sensor_readings],
            'generated_at': datetime.utcnow().isoformat()
        }

    @staticmethod
    def generate_maintenance_report(start_date, end_date):
        records = Maintenance.find_all()
        if start_date and end_date:
            records = [r for r in records if start_date <= r.get('createdAt', r.get('date', '')) <= end_date]

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
        faulty_assets = [a for a in Asset.find_all() if a.get('status') == 'Faulty']
        critical_alerts = [al for al in Alert.find_all() if al.get('severity') in ['High', 'Critical']][:100]

        return {
            'total_faulty_assets': len(faulty_assets),
            'assets': [Asset.to_dict(a) for a in faulty_assets],
            'critical_alerts': [Alert.to_dict(a) for a in critical_alerts],
            'generated_at': datetime.utcnow().isoformat()
        }

    @staticmethod
    def generate_monthly_report(month, year):
        start_date = f'{year}-{month:02d}-01'
        if month == 12:
            end_date = f'{year + 1}-01-01'
        else:
            end_date = f'{year}-{month + 1:02d}-01'

        maintenance = [m for m in Maintenance.find_all() if start_date <= m.get('createdAt', m.get('date', '')) < end_date]
        work_orders = [w for w in WorkOrder.find_all() if start_date <= w.get('createdAt', w.get('date', '')) < end_date]
        alerts = [a for a in Alert.find_all() if start_date <= a.get('timestamp', a.get('createdAt', '')) < end_date]

        assets = Asset.find_all()
        total_assets = len(assets)
        new_assets = sum(1 for a in assets if start_date <= a.get('createdAt', a.get('installationDate', '')) < end_date)

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
