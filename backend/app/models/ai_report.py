from bson.objectid import ObjectId
from datetime import datetime
from app.models.local_store import store
from app.config import USE_MONGO


class AIReport:

    @staticmethod
    def _db():
        if USE_MONGO:
            try:
                from app import mongo
                return mongo.db.ai_reports
            except Exception:
                pass
        return None

    @staticmethod
    def save(data):
        now = datetime.utcnow().isoformat()
        data['createdAt'] = data.get('createdAt', now)
        db = AIReport._db()
        if db is not None:
            try:
                result = db.insert_one(data)
                return str(result.inserted_id)
            except Exception:
                pass
        return store.insert('ai_reports', data)

    @staticmethod
    def find_by_asset(asset_id):
        db = AIReport._db()
        if db is not None:
            try:
                return list(db.find({'assetId': asset_id}).sort('createdAt', -1))
            except Exception:
                pass
        all_reports = store.find('ai_reports')
        return [r for r in all_reports if r.get('assetId') == asset_id]

    @staticmethod
    def find_by_id(report_id):
        db = AIReport._db()
        if db is not None:
            try:
                return db.find_one({'_id': ObjectId(report_id)})
            except Exception:
                pass
        all_reports = store.find('ai_reports')
        for r in all_reports:
            if str(r.get('_id')) == report_id:
                return r
        return None

    @staticmethod
    def find_all():
        db = AIReport._db()
        if db is not None:
            try:
                return list(db.find().sort('createdAt', -1))
            except Exception:
                pass
        return store.find('ai_reports')

    @staticmethod
    def to_dict(report):
        if report is None:
            return None
        r_type = report.get('type', report.get('reportType', 'Health Analysis'))
        return {
            'id': str(report.get('_id', '')),
            'assetId': report.get('assetId', ''),
            'reportType': report.get('reportType', 'Health Analysis'),
            'type': r_type,
            'name': report.get('name', f"{r_type.capitalize()} Report"),
            'analysis': report.get('analysis', ''),
            'recommendation': report.get('recommendation', ''),
            'healthScore': report.get('healthScore'),
            'failureProbability': report.get('failureProbability'),
            'riskLevel': report.get('riskLevel'),
            'parameters': report.get('parameters', {}),
            'createdAt': report.get('createdAt', '')
        }
