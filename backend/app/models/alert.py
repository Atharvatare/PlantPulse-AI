from bson.objectid import ObjectId
from datetime import datetime
from app.models.local_store import store
from app.config import USE_MONGO


class Alert:

    @staticmethod
    def _db():
        if USE_MONGO:
            try:
                from app import mongo
                return mongo.db.alerts
            except Exception:
                pass
        return None

    @staticmethod
    def save(data):
        now = datetime.utcnow().isoformat()
        data['timestamp'] = data.get('timestamp', now)
        data['createdAt'] = data.get('createdAt', now)
        data['isAcknowledged'] = data.get('isAcknowledged', False)
        db = Alert._db()
        if db is not None:
            try:
                result = db.insert_one(data)
                return str(result.inserted_id)
            except Exception:
                pass
        return store.insert('alerts', data)

    @staticmethod
    def find_all():
        db = Alert._db()
        if db is not None:
            try:
                return list(db.find().sort('timestamp', -1))
            except Exception:
                pass
        return store.find('alerts')

    @staticmethod
    def find_by_id(alert_id):
        db = Alert._db()
        if db is not None:
            try:
                return db.find_one({'_id': ObjectId(alert_id)})
            except Exception:
                pass
        return store.find_by_id('alerts', alert_id)

    @staticmethod
    def find_by_severity(severity):
        all_alerts = Alert.find_all()
        return [a for a in all_alerts if a.get('severity', '').lower() == severity.lower()]

    @staticmethod
    def update(alert_id, data):
        db = Alert._db()
        if db is not None:
            try:
                db.update_one({'_id': ObjectId(alert_id)}, {'$set': data})
                return True
            except Exception:
                pass
        return store.update('alerts', alert_id, data)

    @staticmethod
    def delete(alert_id):
        db = Alert._db()
        if db is not None:
            try:
                db.delete_one({'_id': ObjectId(alert_id)})
                return True
            except Exception:
                pass
        return store.delete('alerts', alert_id)

    @staticmethod
    def to_dict(alert):
        if alert is None:
            return None
        return {
            'id': str(alert.get('_id', '')),
            'assetId': alert.get('assetId', ''),
            'alertType': alert.get('alertType', alert.get('type', '')),
            'type': alert.get('type', alert.get('alertType', '')),
            'severity': alert.get('severity', 'Info'),
            'message': alert.get('message', ''),
            'isAcknowledged': alert.get('isAcknowledged', False),
            'timestamp': alert.get('timestamp', alert.get('createdAt', '')),
            'createdAt': alert.get('createdAt', '')
        }
