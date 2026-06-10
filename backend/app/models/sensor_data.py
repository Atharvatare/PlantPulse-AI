from bson.objectid import ObjectId
from datetime import datetime
from app.models.local_store import store
from app.config import USE_MONGO


class SensorData:

    @staticmethod
    def _db():
        if USE_MONGO:
            try:
                from app import mongo
                return mongo.db.sensor_data
            except Exception:
                pass
        return None

    @staticmethod
    def save(data):
        now = datetime.utcnow().isoformat()
        data['timestamp'] = data.get('timestamp', now)
        db = SensorData._db()
        if db is not None:
            try:
                result = db.insert_one(data)
                return str(result.inserted_id)
            except Exception:
                pass
        return store.insert('sensor_data', data)

    @staticmethod
    def find_by_asset(asset_id):
        db = SensorData._db()
        if db is not None:
            try:
                return list(db.find({'assetId': asset_id}).sort('timestamp', -1))
            except Exception:
                pass
        all_data = store.find('sensor_data')
        return [d for d in all_data if d.get('assetId') == asset_id]

    @staticmethod
    def to_dict(data):
        if data is None:
            return None
        return {
            'id': str(data.get('_id', '')),
            'assetId': data.get('assetId', ''),
            'temperature': data.get('temperature', 0),
            'current': data.get('current', 0),
            'voltage': data.get('voltage', 0),
            'runningHours': data.get('runningHours', 0),
            'vibrationLevel': data.get('vibrationLevel', 0),
            'pressure': data.get('pressure', 0),
            'flowRate': data.get('flowRate', 0),
            'timestamp': data.get('timestamp', '')
        }
