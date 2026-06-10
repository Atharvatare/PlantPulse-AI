from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from app.models.local_store import store
from app.config import USE_MONGO


class User:

    @staticmethod
    def _db():
        if USE_MONGO:
            try:
                from app import mongo
                return mongo.db.users
            except Exception:
                pass
        return None

    @staticmethod
    def save(data):
        data['password'] = generate_password_hash(data['password'])
        data['created_at'] = data.get('created_at', datetime.utcnow().isoformat())
        data['updated_at'] = data.get('updated_at', datetime.utcnow().isoformat())
        db = User._db()
        if db is not None:
            try:
                result = db.insert_one(data)
                return str(result.inserted_id)
            except Exception:
                pass
        return store.insert('users', data)

    @staticmethod
    def find_by_email(email):
        db = User._db()
        if db is not None:
            try:
                user = db.find_one({'email': email})
                if user:
                    return user
            except Exception:
                pass
        return store.find_one('users', {'email': email})

    @staticmethod
    def find_by_id(user_id):
        db = User._db()
        if db is not None:
            try:
                return db.find_one({'_id': ObjectId(user_id)})
            except Exception:
                pass
        return store.find_by_id('users', user_id)

    @staticmethod
    def find_all():
        db = User._db()
        if db is not None:
            try:
                return list(db.find())
            except Exception:
                pass
        return store.find('users')

    @staticmethod
    def update(user_id, data):
        data['updated_at'] = datetime.utcnow().isoformat()
        db = User._db()
        if db is not None:
            try:
                db.update_one({'_id': ObjectId(user_id)}, {'$set': data})
                return True
            except Exception:
                pass
        return store.update('users', user_id, data)

    @staticmethod
    def delete(user_id):
        db = User._db()
        if db is not None:
            try:
                db.delete_one({'_id': ObjectId(user_id)})
                return True
            except Exception:
                pass
        return store.delete('users', user_id)

    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)

    @staticmethod
    def to_dict(user):
        if user is None:
            return None
        return {
            'id': str(user.get('_id', '')),
            'name': user.get('name', ''),
            'email': user.get('email', ''),
            'role': user.get('role', 'Operator'),
            'department': user.get('department', ''),
            'phone': user.get('phone', ''),
            'avatar': user.get('avatar', ''),
            'is_active': user.get('is_active', True),
            'created_at': user.get('created_at', user.get('createdAt', '')),
            'updated_at': user.get('updated_at', user.get('updatedAt', ''))
        }
