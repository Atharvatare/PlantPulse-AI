from bson.objectid import ObjectId
from datetime import datetime
from app.models.local_store import store
from app.config import USE_MONGO


class WorkOrder:

    @staticmethod
    def _db():
        if USE_MONGO:
            try:
                from app import mongo
                return mongo.db.work_orders
            except Exception:
                pass
        return None

    @staticmethod
    def save(data):
        now = datetime.utcnow().isoformat()
        data['createdAt'] = data.get('createdAt', now)
        data['updatedAt'] = data.get('updatedAt', now)
        if 'status' not in data:
            data['status'] = 'Open'
        db = WorkOrder._db()
        if db is not None:
            try:
                result = db.insert_one(data)
                return str(result.inserted_id)
            except Exception:
                pass
        return store.insert('work_orders', data)

    @staticmethod
    def find_all():
        db = WorkOrder._db()
        if db is not None:
            try:
                return list(db.find().sort('createdAt', -1))
            except Exception:
                pass
        return store.find('work_orders')

    @staticmethod
    def find_by_id(order_id):
        db = WorkOrder._db()
        if db is not None:
            try:
                return db.find_one({'_id': ObjectId(order_id)})
            except Exception:
                pass
        return store.find_by_id('work_orders', order_id)

    @staticmethod
    def update(order_id, data):
        data['updatedAt'] = datetime.utcnow().isoformat()
        db = WorkOrder._db()
        if db is not None:
            try:
                db.update_one({'_id': ObjectId(order_id)}, {'$set': data})
                return True
            except Exception:
                pass
        return store.update('work_orders', order_id, data)

    @staticmethod
    def update_status(order_id, status):
        return WorkOrder.update(order_id, {'status': status})

    @staticmethod
    def delete(order_id):
        db = WorkOrder._db()
        if db is not None:
            try:
                db.delete_one({'_id': ObjectId(order_id)})
                return True
            except Exception:
                pass
        return store.delete('work_orders', order_id)

    @staticmethod
    def to_dict(order):
        if order is None:
            return None
        return {
            'id': str(order.get('_id', '')),
            'ticketNumber': order.get('ticketNumber', ''),
            'assetId': order.get('assetId', ''),
            'assignedTo': order.get('assignedTo', order.get('assignedEngineer', '')),
            'assignedEngineer': order.get('assignedEngineer', ''),
            'priority': order.get('priority', 'Medium'),
            'status': order.get('status', 'Open'),
            'description': order.get('description', ''),
            'date': order.get('date', order.get('createdDate', '')),
            'createdDate': order.get('createdDate', ''),
            'completedDate': order.get('completedDate', ''),
            'createdAt': order.get('createdAt', ''),
            'updatedAt': order.get('updatedAt', '')
        }
