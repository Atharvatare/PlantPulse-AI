from bson.objectid import ObjectId
from datetime import datetime
from app.models.local_store import store
from app.config import USE_MONGO


class Asset:

    @staticmethod
    def _db():
        if USE_MONGO:
            try:
                from app import mongo
                return mongo.db.assets
            except Exception:
                pass
        return None

    @staticmethod
    def save(data):
        now = datetime.utcnow().isoformat()
        data['createdAt'] = data.get('createdAt', now)
        data['updatedAt'] = data.get('updatedAt', now)
        db = Asset._db()
        if db is not None:
            try:
                result = db.insert_one(data)
                return str(result.inserted_id)
            except Exception:
                pass
        return store.insert('assets', data)

    @staticmethod
    def find_all():
        db = Asset._db()
        if db is not None:
            try:
                return list(db.find().sort('createdAt', -1))
            except Exception:
                pass
        return store.find('assets')

    @staticmethod
    def find_by_id(asset_id):
        db = Asset._db()
        if db is not None:
            try:
                return db.find_one({'_id': ObjectId(asset_id)})
            except Exception:
                pass
        return store.find_by_id('assets', asset_id)

    @staticmethod
    def update(asset_id, data):
        data['updatedAt'] = datetime.utcnow().isoformat()
        db = Asset._db()
        if db is not None:
            try:
                db.update_one({'_id': ObjectId(asset_id)}, {'$set': data})
                return True
            except Exception:
                pass
        return store.update('assets', asset_id, data)

    @staticmethod
    def delete(asset_id):
        db = Asset._db()
        if db is not None:
            try:
                db.delete_one({'_id': ObjectId(asset_id)})
                return True
            except Exception:
                pass
        return store.delete('assets', asset_id)

    @staticmethod
    def to_dict(asset):
        if asset is None:
            return None
        return {
            'id': str(asset.get('_id', '')),
            'assetId': asset.get('assetId', ''),
            'assetName': asset.get('assetName', ''),
            'category': asset.get('category', ''),
            'location': asset.get('location', ''),
            'capacity': asset.get('capacity', ''),
            'vendor': asset.get('vendor', ''),
            'installationDate': asset.get('installationDate', ''),
            'healthScore': asset.get('healthScore', 100),
            'status': asset.get('status', 'Running'),
            'createdAt': asset.get('createdAt', ''),
            'updatedAt': asset.get('updatedAt', '')
        }
