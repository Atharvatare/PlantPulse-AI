from app.routes.auth_routes import auth_bp
from app.routes.asset_routes import asset_bp
from app.routes.maintenance_routes import maintenance_bp
from app.routes.work_order_routes import work_order_bp
from app.routes.dashboard_routes import dashboard_bp
from app.routes.alert_routes import alert_bp
from app.routes.ai_routes import ai_bp
from app.routes.report_routes import report_bp
from app.routes.user_routes import user_bp

blueprints = [
    auth_bp,
    asset_bp,
    maintenance_bp,
    work_order_bp,
    dashboard_bp,
    alert_bp,
    ai_bp,
    report_bp,
    user_bp
]
