from datetime import datetime
from app import mongo
from app.models.alert import Alert


class NotificationService:
    @staticmethod
    def create_alert(asset_id, alert_type, severity, message, asset_name=''):
        alert_data = {
            'asset_id': asset_id,
            'asset_name': asset_name,
            'type': alert_type,
            'severity': severity,
            'message': message,
            'is_read': False,
            'created_at': datetime.utcnow().isoformat()
        }
        alert_id = Alert.save(alert_data)
        return alert_id

    @staticmethod
    def send_email_notification(user, subject, body):
        try:
            print(f'[EMAIL] To: {user.get("email", "unknown")}')
            print(f'[EMAIL] Subject: {subject}')
            print(f'[EMAIL] Body: {body}')
            return True
        except Exception as e:
            print(f'[EMAIL] Failed: {str(e)}')
            return False

    @staticmethod
    def get_user_alerts(user_id, limit=50):
        alerts = list(mongo.db.alerts.find().sort('created_at', -1).limit(limit))
        return [Alert.to_dict(a) for a in alerts]

    @staticmethod
    def get_unread_count():
        return mongo.db.alerts.count_documents({'is_read': False})
