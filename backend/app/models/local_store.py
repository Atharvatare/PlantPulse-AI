from datetime import datetime
from bson.objectid import ObjectId
import threading
import itertools

_lock = threading.Lock()
_counters = itertools.count(1)


class LocalStore:
    _stores = {
        'users': {},
        'assets': {},
        'maintenance': {},
        'work_orders': {},
        'alerts': {},
        'ai_reports': {},
        'sensor_data': {}
    }

    @classmethod
    def _new_id(cls):
        return ObjectId()

    @classmethod
    def insert(cls, collection, data):
        doc = data.copy()
        doc['_id'] = cls._new_id()
        with _lock:
            key = str(doc['_id'])
            cls._stores[collection][key] = doc
        return key

    @classmethod
    def find(cls, collection, query=None):
        with _lock:
            items = list(cls._stores[collection].values())
        if query:
            for key, value in query.items():
                items = [i for i in items if i.get(key) == value]
        return items

    @classmethod
    def find_one(cls, collection, query):
        with _lock:
            for doc in cls._stores[collection].values():
                match = True
                for key, value in query.items():
                    if doc.get(key) != value:
                        match = False
                        break
                if match:
                    return doc.copy()
        return None

    @classmethod
    def find_by_id(cls, collection, doc_id):
        with _lock:
            doc = cls._stores[collection].get(str(doc_id))
            return doc.copy() if doc else None

    @classmethod
    def update(cls, collection, doc_id, data):
        with _lock:
            if str(doc_id) in cls._stores[collection]:
                cls._stores[collection][str(doc_id)].update(data)
                return True
            return False

    @classmethod
    def delete(cls, collection, doc_id):
        with _lock:
            return cls._stores[collection].pop(str(doc_id), None) is not None

    @classmethod
    def count(cls, collection, query=None):
        return len(cls.find(collection, query))


store = LocalStore()
