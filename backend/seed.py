"""Seed demo data for PlantPulse AI."""
import os
from datetime import datetime, timedelta
from app import create_app
from app.models.user import User
from app.models.asset import Asset
from app.models.work_order import WorkOrder
from app.models.alert import Alert
from app.models.maintenance import Maintenance

app = create_app()

with app.app_context():
    admin_pw = os.getenv('DEMO_ADMIN_PASSWORD', 'admin123')
    engineer_pw = os.getenv('DEMO_ENGINEER_PASSWORD', 'engineer123')

    admin = User.find_by_email('admin@plantpulse.ai')
    if not admin:
        uid = User.save({
            'name': 'Admin User',
            'email': 'admin@plantpulse.ai',
            'password': admin_pw,
            'role': 'Admin',
            'is_active': True
        })
        print(f'Created admin (id={uid})')
    else:
        print('Admin user exists')

    engineer = User.find_by_email('engineer@plantpulse.ai')
    if not engineer:
        uid = User.save({
            'name': 'Engineer User',
            'email': 'engineer@plantpulse.ai',
            'password': engineer_pw,
            'role': 'Engineer',
            'is_active': True
        })
        print(f'Created engineer (id={uid})')
    else:
        print('Engineer user exists')

    assets_data = [
        {'assetId': 'MTR-101', 'assetName': 'Main Conveyor Motor', 'category': 'Motor', 'location': 'Plant A - Line 1', 'capacity': '50 HP', 'vendor': 'ABB', 'installationDate': '2023-06-15', 'healthScore': 88, 'status': 'Running'},
        {'assetId': 'MTR-102', 'assetName': 'Cooling Pump Motor', 'category': 'Motor', 'location': 'Plant A - Cooling Tower', 'capacity': '25 HP', 'vendor': 'Siemens', 'installationDate': '2023-08-20', 'healthScore': 72, 'status': 'Running'},
        {'assetId': 'CMP-201', 'assetName': 'Air Compressor', 'category': 'Compressor', 'location': 'Plant B - Utility Room', 'capacity': '100 PSI', 'vendor': 'Atlas Copco', 'installationDate': '2022-11-01', 'healthScore': 65, 'status': 'Maintenance'},
        {'assetId': 'TRF-301', 'assetName': 'Main Step-Down Transformer', 'category': 'Transformer', 'location': 'Substation 1', 'capacity': '2 MVA', 'vendor': 'Siemens', 'installationDate': '2021-03-10', 'healthScore': 91, 'status': 'Running'},
        {'assetId': 'PMP-401', 'assetName': 'Chemical Feed Pump', 'category': 'Pump', 'location': 'Plant A - Chemical Area', 'capacity': '15 HP', 'vendor': 'Grundfos', 'installationDate': '2023-01-25', 'healthScore': 45, 'status': 'Faulty'},
        {'assetId': 'CNV-501', 'assetName': 'Belt Conveyor', 'category': 'Conveyor', 'location': 'Plant B - Packing', 'capacity': '200 TPH', 'vendor': 'Fenner', 'installationDate': '2022-06-30', 'healthScore': 78, 'status': 'Running'},
        {'assetId': 'MTR-103', 'assetName': 'Exhaust Fan Motor', 'category': 'Motor', 'location': 'Plant A - Ventilation', 'capacity': '10 HP', 'vendor': 'CG Power', 'installationDate': '2024-02-10', 'healthScore': 95, 'status': 'Running'},
        {'assetId': 'PMP-402', 'assetName': 'Boiler Feed Pump', 'category': 'Pump', 'location': 'Plant B - Boiler Room', 'capacity': '75 HP', 'vendor': 'KSB', 'installationDate': '2022-09-15', 'healthScore': 55, 'status': 'Stopped'},
    ]
    for a in assets_data:
        # Check if exists by assetId
        existing = [item for item in Asset.find_all() if item.get('assetId') == a['assetId']]
        if not existing:
            Asset.save({**a, 'createdAt': datetime.utcnow().isoformat(), 'updatedAt': datetime.utcnow().isoformat()})
            print(f'  + Asset: {a["assetId"]}')
        else:
            print(f'  = Exists: {a["assetId"]}')

    work_orders_data = [
        {'ticketNumber': 'WO-001', 'assetId': 'CMP-201', 'assignedEngineer': 'Raj Kumar', 'assignedTo': 'Raj Kumar', 'priority': 'High', 'status': 'In Progress', 'description': 'Compressor vibration above threshold - inspect and repair bearings', 'createdDate': (datetime.utcnow() - timedelta(days=2)).isoformat()},
        {'ticketNumber': 'WO-002', 'assetId': 'PMP-401', 'assignedEngineer': 'Priya Sharma', 'assignedTo': 'Priya Sharma', 'priority': 'Critical', 'status': 'Open', 'description': 'Chemical feed pump failed - emergency repair needed', 'createdDate': (datetime.utcnow() - timedelta(hours=6)).isoformat()},
        {'ticketNumber': 'WO-003', 'assetId': 'MTR-102', 'assignedEngineer': 'Amit Singh', 'assignedTo': 'Amit Singh', 'priority': 'Medium', 'status': 'Completed', 'description': 'Routine bearing lubrication and inspection', 'createdDate': (datetime.utcnow() - timedelta(days=5)).isoformat(), 'completedDate': (datetime.utcnow() - timedelta(days=1)).isoformat()},
        {'ticketNumber': 'WO-004', 'assetId': 'TRF-301', 'assignedEngineer': 'Sneha Patel', 'assignedTo': 'Sneha Patel', 'priority': 'Low', 'status': 'Open', 'description': 'Quarterly oil sample analysis and dielectric test', 'createdDate': (datetime.utcnow() - timedelta(days=1)).isoformat()},
        {'ticketNumber': 'WO-005', 'assetId': 'PMP-402', 'assignedEngineer': 'Vikram Joshi', 'assignedTo': 'Vikram Joshi', 'priority': 'High', 'status': 'In Progress', 'description': 'Boiler feed pump seal replacement', 'createdDate': (datetime.utcnow() - timedelta(days=3)).isoformat()},
    ]
    for wo in work_orders_data:
        existing = [item for item in WorkOrder.find_all() if item.get('ticketNumber') == wo['ticketNumber']]
        if not existing:
            WorkOrder.save({**wo, 'createdAt': datetime.utcnow().isoformat(), 'updatedAt': datetime.utcnow().isoformat()})
            print(f'  + WO: {wo["ticketNumber"]}')
        else:
            print(f'  = Exists: {wo["ticketNumber"]}')

    alerts_data = [
        {'assetId': 'PMP-401', 'alertType': 'Fault', 'severity': 'Critical', 'message': 'Chemical feed pump stopped unexpectedly - immediate attention required', 'isAcknowledged': False},
        {'assetId': 'CMP-201', 'alertType': 'Vibration', 'severity': 'Warning', 'message': 'Air compressor vibration level exceeds threshold (7.2 mm/s)', 'isAcknowledged': False},
        {'assetId': 'MTR-102', 'alertType': 'Temperature', 'severity': 'Warning', 'message': 'Cooling pump motor temperature rising (89°C)', 'isAcknowledged': False},
        {'assetId': 'TRF-301', 'alertType': 'Performance', 'severity': 'Info', 'message': 'Transformer efficiency dropped by 2.1% - schedule inspection', 'isAcknowledged': True},
        {'assetId': 'PMP-402', 'alertType': 'Pressure', 'severity': 'Warning', 'message': 'Boiler feed pump discharge pressure below minimum', 'isAcknowledged': False},
    ]
    for al in alerts_data:
        Alert.save({'timestamp': datetime.utcnow().isoformat(), **al})

    print('Alerts seeded')

    maintenance_data = [
        {'assetId': 'MTR-101', 'maintenanceType': 'Preventive', 'description': 'Quarterly bearing inspection and lubrication', 'engineer': 'Raj Kumar', 'date': (datetime.utcnow() - timedelta(days=15)).isoformat(), 'remarks': 'All bearings in good condition', 'cost': 2500, 'status': 'Completed'},
        {'assetId': 'CMP-201', 'maintenanceType': 'Corrective', 'description': 'Vibration analysis and rotor balancing', 'engineer': 'Amit Singh', 'date': (datetime.utcnow() - timedelta(days=7)).isoformat(), 'remarks': 'Minor imbalance corrected', 'cost': 5800, 'status': 'Completed'},
        {'assetId': 'PMP-401', 'maintenanceType': 'Emergency', 'description': 'Seal replacement and shaft alignment', 'engineer': 'Priya Sharma', 'date': (datetime.utcnow() - timedelta(days=1)).isoformat(), 'remarks': 'In progress', 'cost': 0, 'status': 'In Progress'},
        {'assetId': 'TRF-301', 'maintenanceType': 'Preventive', 'description': 'Oil filtration and dielectric testing', 'engineer': 'Sneha Patel', 'date': (datetime.utcnow() + timedelta(days=10)).isoformat(), 'remarks': 'Scheduled', 'cost': 0, 'status': 'Scheduled'},
    ]
    for m in maintenance_data:
        Maintenance.save({**m, 'createdAt': datetime.utcnow().isoformat(), 'updatedAt': datetime.utcnow().isoformat()})

    print('Maintenance records seeded')
    print('\n=== Seed Complete ===')
