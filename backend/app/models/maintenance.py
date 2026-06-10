from bson.objectid import ObjectId
from datetime import datetime
from app.models.local_store import store
from app.config import USE_MONGO


class Maintenance:

    @staticmethod
    def _db():
        if USE_MONGO:
            try:
                from app import mongo
                return mongo.db.maintenance
            except Exception:
                pass
        return None

    @staticmethod
    def save(data):
        now = datetime.utcnow().isoformat()
        data['createdAt'] = data.get('createdAt', now)
        data['updatedAt'] = data.get('updatedAt', now)
        db = Maintenance._db()
        if db is not None:
            try:
                result = db.insert_one(data)
                return str(result.inserted_id)
            except Exception:
                pass
        return store.insert('maintenance', data)

    @staticmethod
    def find_all():
        db = Maintenance._db()
        if db is not None:
            try:
                return list(db.find().sort('date', -1))
            except Exception:
                pass
        return store.find('maintenance')

    @staticmethod
    def find_by_id(record_id):
        db = Maintenance._db()
        if db is not None:
            try:
                return db.find_one({'_id': ObjectId(record_id)})
            except Exception:
                pass
        return store.find_by_id('maintenance', record_id)

    @staticmethod
    def find_by_asset(asset_id):
        all_records = Maintenance.find_all()
        return [r for r in all_records if r.get('assetId') == asset_id]

    @staticmethod
    def update(record_id, data):
        data['updatedAt'] = datetime.utcnow().isoformat()
        db = Maintenance._db()
        if db is not None:
            try:
                db.update_one({'_id': ObjectId(record_id)}, {'$set': data})
                return True
            except Exception:
                pass
        return store.update('maintenance', record_id, data)

    @staticmethod
    def delete(record_id):
        db = Maintenance._db()
        if db is not None:
            try:
                db.delete_one({'_id': ObjectId(record_id)})
                return True
            except Exception:
                pass
        return store.delete('maintenance', record_id)

    @staticmethod
    def to_dict(record):
        if record is None:
            return None
        return {
            'id': str(record.get('_id', '')),
            'assetId': record.get('assetId', ''),
            'maintenanceType': record.get('maintenanceType', record.get('type', 'Preventive')),
            'type': record.get('type', record.get('maintenanceType', 'Preventive')),
            'description': record.get('description', ''),
            'engineer': record.get('engineer', record.get('assignedTo', '')),
            'assignedTo': record.get('assignedTo', record.get('engineer', '')),
            'date': record.get('date', ''),
            'cost': record.get('cost', 0),
            'remarks': record.get('remarks', ''),
            'status': record.get('status', 'Completed'),
            'createdAt': record.get('createdAt', ''),
            'updatedAt': record.get('updatedAt', '')
        }
