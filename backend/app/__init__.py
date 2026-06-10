import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from dotenv import load_dotenv

load_dotenv()

mongo = PyMongo()
jwt = JWTManager()


def _auto_seed(app):
    with app.app_context():
        from app.models.local_store import store
        from datetime import datetime, timedelta
        if store.find_one('users', {'email': 'admin@plantpulse.ai'}):
            return
        from app.models.user import User
        User.save({
            'name': 'Admin User', 'email': 'admin@plantpulse.ai',
            'password': 'admin123', 'role': 'Admin', 'is_active': True
        })
        User.save({
            'name': 'Engineer User', 'email': 'engineer@plantpulse.ai',
            'password': 'engineer123', 'role': 'Engineer', 'is_active': True
        })
        assets = [
            {'assetId': 'MTR-101', 'assetName': 'Main Conveyor Motor', 'category': 'Motor', 'location': 'Plant A - Line 1', 'capacity': '50 HP', 'vendor': 'ABB', 'installationDate': '2023-06-15', 'healthScore': 88, 'status': 'Running'},
            {'assetId': 'MTR-102', 'assetName': 'Cooling Pump Motor', 'category': 'Motor', 'location': 'Plant A - Cooling Tower', 'capacity': '25 HP', 'vendor': 'Siemens', 'installationDate': '2023-08-20', 'healthScore': 72, 'status': 'Running'},
            {'assetId': 'CMP-201', 'assetName': 'Air Compressor', 'category': 'Compressor', 'location': 'Plant B - Utility Room', 'capacity': '100 PSI', 'vendor': 'Atlas Copco', 'installationDate': '2022-11-01', 'healthScore': 65, 'status': 'Maintenance'},
            {'assetId': 'TRF-301', 'assetName': 'Main Step-Down Transformer', 'category': 'Transformer', 'location': 'Substation 1', 'capacity': '2 MVA', 'vendor': 'Siemens', 'installationDate': '2021-03-10', 'healthScore': 91, 'status': 'Running'},
            {'assetId': 'PMP-401', 'assetName': 'Chemical Feed Pump', 'category': 'Pump', 'location': 'Plant A - Chemical Area', 'capacity': '15 HP', 'vendor': 'Grundfos', 'installationDate': '2023-01-25', 'healthScore': 45, 'status': 'Faulty'},
            {'assetId': 'CNV-501', 'assetName': 'Belt Conveyor', 'category': 'Conveyor', 'location': 'Plant B - Packing', 'capacity': '200 TPH', 'vendor': 'Fenner', 'installationDate': '2022-06-30', 'healthScore': 78, 'status': 'Running'},
            {'assetId': 'MTR-103', 'assetName': 'Exhaust Fan Motor', 'category': 'Motor', 'location': 'Plant A - Ventilation', 'capacity': '10 HP', 'vendor': 'CG Power', 'installationDate': '2024-02-10', 'healthScore': 95, 'status': 'Running'},
            {'assetId': 'PMP-402', 'assetName': 'Boiler Feed Pump', 'category': 'Pump', 'location': 'Plant B - Boiler Room', 'capacity': '75 HP', 'vendor': 'KSB', 'installationDate': '2022-09-15', 'healthScore': 55, 'status': 'Stopped'},
        ]
        now = datetime.utcnow().isoformat()
        for a in assets:
            store.insert('assets', {**a, 'createdAt': now, 'updatedAt': now})
        wos = [
            {'ticketNumber': 'WO-001', 'assetId': 'CMP-201', 'assignedTo': 'Raj Kumar', 'priority': 'High', 'status': 'In Progress', 'description': 'Compressor vibration above threshold - inspect and repair bearings', 'createdDate': (datetime.utcnow() - timedelta(days=2)).isoformat()},
            {'ticketNumber': 'WO-002', 'assetId': 'PMP-401', 'assignedTo': 'Priya Sharma', 'priority': 'Critical', 'status': 'Open', 'description': 'Chemical feed pump failed - emergency repair needed', 'createdDate': (datetime.utcnow() - timedelta(hours=6)).isoformat()},
            {'ticketNumber': 'WO-003', 'assetId': 'MTR-102', 'assignedTo': 'Amit Singh', 'priority': 'Medium', 'status': 'Completed', 'description': 'Routine bearing lubrication and inspection', 'createdDate': (datetime.utcnow() - timedelta(days=5)).isoformat()},
            {'ticketNumber': 'WO-004', 'assetId': 'TRF-301', 'assignedTo': 'Sneha Patel', 'priority': 'Low', 'status': 'Open', 'description': 'Quarterly oil sample analysis and dielectric test', 'createdDate': (datetime.utcnow() - timedelta(days=1)).isoformat()},
            {'ticketNumber': 'WO-005', 'assetId': 'PMP-402', 'assignedTo': 'Vikram Joshi', 'priority': 'High', 'status': 'In Progress', 'description': 'Boiler feed pump seal replacement', 'createdDate': (datetime.utcnow() - timedelta(days=3)).isoformat()},
        ]
        for wo in wos:
            store.insert('work_orders', {**wo, 'createdAt': now, 'updatedAt': now})
        alerts = [
            {'assetId': 'PMP-401', 'alertType': 'Fault', 'severity': 'Critical', 'message': 'Chemical feed pump stopped unexpectedly', 'isAcknowledged': False},
            {'assetId': 'CMP-201', 'alertType': 'Vibration', 'severity': 'Warning', 'message': 'Air compressor vibration level exceeds threshold (7.2 mm/s)', 'isAcknowledged': False},
            {'assetId': 'MTR-102', 'alertType': 'Temperature', 'severity': 'Warning', 'message': 'Cooling pump motor temperature rising (89°C)', 'isAcknowledged': False},
            {'assetId': 'TRF-301', 'alertType': 'Performance', 'severity': 'Info', 'message': 'Transformer efficiency dropped by 2.1%', 'isAcknowledged': True},
            {'assetId': 'PMP-402', 'alertType': 'Pressure', 'severity': 'Warning', 'message': 'Boiler feed pump discharge pressure below minimum', 'isAcknowledged': False},
        ]
        for al in alerts:
            store.insert('alerts', {'timestamp': now, **al})
        maint = [
            {'assetId': 'MTR-101', 'maintenanceType': 'Preventive', 'description': 'Quarterly bearing inspection', 'engineer': 'Raj Kumar', 'date': (datetime.utcnow() - timedelta(days=15)).isoformat(), 'cost': 2500, 'status': 'Completed'},
            {'assetId': 'CMP-201', 'maintenanceType': 'Corrective', 'description': 'Vibration analysis and rotor balancing', 'engineer': 'Amit Singh', 'date': (datetime.utcnow() - timedelta(days=7)).isoformat(), 'cost': 5800, 'status': 'Completed'},
            {'assetId': 'PMP-401', 'maintenanceType': 'Emergency', 'description': 'Seal replacement and shaft alignment', 'engineer': 'Priya Sharma', 'date': (datetime.utcnow() - timedelta(days=1)).isoformat(), 'cost': 0, 'status': 'In Progress'},
            {'assetId': 'TRF-301', 'maintenanceType': 'Preventive', 'description': 'Oil filtration and dielectric testing', 'engineer': 'Sneha Patel', 'date': (datetime.utcnow() + timedelta(days=10)).isoformat(), 'cost': 0, 'status': 'Scheduled'},
        ]
        for m in maint:
            store.insert('maintenance', {**m, 'createdAt': now, 'updatedAt': now})
        print('[PlantPulse] Demo data seeded: admin@plantpulse.ai / admin123')


def _init_mongo(app):
    uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/plantpulse')
    app.config['MONGO_URI'] = uri
    try:
        mongo.init_app(app)
    except Exception:
        pass


def create_app(config_name=None):
    app = Flask(__name__)

    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    config_path = 'app.config.DevelopmentConfig'
    if config_name == 'production':
        config_path = 'app.config.ProductionConfig'
    elif config_name == 'testing':
        config_path = 'app.config.TestingConfig'
    app.config.from_object(config_path)

    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'plantpulse-jwt-secret-key-32bytes!!!!')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'

    CORS(app, resources={r'/api/*': {'origins': '*'}})

    _init_mongo(app)
    jwt.init_app(app)

    from app.routes import blueprints
    for bp in blueprints:
        app.register_blueprint(bp)

    _auto_seed(app)

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'success': False, 'message': 'Bad request', 'error': str(error)}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'success': False, 'message': 'Unauthorized', 'error': str(error)}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'success': False, 'message': 'Forbidden', 'error': str(error)}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'success': False, 'message': 'Resource not found', 'error': str(error)}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'success': False, 'message': 'Internal server error', 'error': str(error)}), 500

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'success': True,
            'message': 'PlantPulse AI API is running',
            'version': '1.0.0'
        }), 200

    return app
