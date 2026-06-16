# Changelog

All notable changes to PlantPulse AI will be documented in this file.

## [1.0.1] - 2026-06-16

### Fixed
- **Dashboard Visualization**: Corrected undefined `lineOpts` causing a page crash and resolved KPI/Chart Axios response object mapping.
- **Auth Redirect Body Hook**: Replaced render-time `navigate()` redirection side-effects in `Login.jsx` and `Register.jsx` with standard React `useEffect` hooks, preventing React Router lifecycle warnings.
- **Database-Agnostic Reports**: Replaced direct MongoDB `mongo.db` collection dependencies in `ReportService` with database-agnostic model wrapper queries, allowing the app to run seamlessly in `LocalStore` mode without 500 crashes.
- **Report Meta Mapping**: Added report `name` and `type` fields mapping in `AIReport.to_dict()` so generated reports show up correctly in the frontend.
- **Database Seeding Robustness**: Refactored the `_auto_seed` configuration script and standalone `seed.py` to seed the database using model `.save()` operations rather than raw `store.insert` calls.

### Security
- **HTTP Secure Headers**: Configured custom global secure headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`) for backend endpoints to enhance API security.

## [1.0.0] - 2024-01-15

### Added
- **User Authentication**: JWT-based registration, login, and profile management
- **Asset Management**: CRUD operations for industrial assets with health tracking
- **Predictive Maintenance**: AI-driven health scoring and failure probability analysis
- **Work Order Management**: Ticket creation, assignment, and status tracking
- **Industrial Dashboard**: Real-time KPIs, charts, and monitoring interface
- **AI Assistant**: Natural language chat interface for equipment diagnostics
- **Report Generation**: Asset, maintenance, failure, and monthly reports
- **Admin Panel**: User management with role-based access control
- **Alert System**: Real-time alerts with severity-based notifications
- **Responsive Design**: Mobile-first dark industrial theme

### Technical
- Frontend: React 18 + Vite + Tailwind CSS + Chart.js
- Backend: Python Flask + JWT + RESTful API
- Database: MongoDB Atlas with 7 collections
- AI: OpenAI API integration for diagnostics
- Deployment: Docker, GitHub Actions CI/CD
- Documentation: API docs, DB schema, ER diagram, deployment guide
