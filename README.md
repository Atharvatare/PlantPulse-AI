# PlantPulse AI 🌱⚡

> **Smart Industrial Monitoring & Predictive Maintenance Platform**

PlantPulse AI is a production-grade Industrial IoT SaaS platform that leverages artificial intelligence to monitor industrial assets, predict equipment failures, and optimize maintenance operations. Built with a modern React frontend and Python Flask backend, it provides real-time insights through an intuitive dark-themed dashboard.

---

## ✨ Features

### 📊 Real-Time Dashboard
- KPI overview (total assets, running/faulty counts, open work orders, energy consumption)
- Interactive charts (asset health trends, failure predictions, maintenance costs, downtime analytics)
- Recent alerts feed with severity indicators

### 🔧 Asset Management
- Full CRUD for industrial assets (motors, pumps, compressors, transformers, conveyors)
- Health scoring with color-coded status indicators
- Asset categorization, location tracking, and vendor management

### 🔮 Predictive Maintenance
- AI-driven health score calculation from sensor parameters
- Failure probability prediction with risk level classification
- Sensor data analysis (temperature, vibration, current, voltage)
- Maintenance recommendations based on asset condition

### 📋 Work Orders
- Ticket management with priority levels (Critical, High, Medium, Low)
- Status tracking (Open, In Progress, Completed)
- Engineer assignment and date tracking
- Automatic ticket numbering

### 🤖 AI Assistant
- Natural language chat interface for asset queries
- Quick suggestion queries for common tasks
- AI-powered fault analysis and diagnostics
- Automated report generation

### 📈 Analytics & Reports
- Comprehensive analytics with filtering and date ranges
- Exportable reports (PDF format)
- Asset-specific, maintenance, failure, and monthly report types
- Report history and management

### 🔔 Alerts System
- Real-time alerts with severity levels (Critical, Warning, Info)
- Acknowledge single or bulk alerts
- Alert filtering by severity
- Asset-linked alert tracking

### 👥 User Management
- Role-based access control (Admin, Engineer, Manager, Operator, Technician, Viewer)
- Admin panel for user role management
- Profile settings and account management
- JWT-based authentication

---

## 🏗️ Architecture

```
plantpulse-ai/
├── frontend/                # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth & Theme providers
│   │   ├── layouts/         # Dashboard layout
│   │   ├── pages/           # Route pages
│   │   │   ├── dashboard/   # Dashboard sub-pages
│   │   ├── services/        # API service layer
│   │   └── utils/           # Helpers & constants
│   └── dist/                # Production build output
├── backend/                 # Python Flask API
│   ├── app/
│   │   ├── ai/              # Predictive ML models
│   │   ├── config/          # App configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Data models (LocalStore + MongoDB)
│   │   ├── routes/          # API route blueprints
│   │   └── services/        # Business logic (OpenAI, Reports, Notifications)
│   ├── run.py              # Server entry point
│   └── seed.py             # Database seeding script
├── docker-compose.yml       # Docker orchestration
├── Dockerfile.backend       # Backend container
├── Dockerfile.frontend      # Frontend container
└── vercel.json              # Vercel deployment config
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Chart.js 4 |
| **Backend** | Python 3, Flask 3, Flask-JWT-Extended, Flask-PyMongo |
| **Database** | MongoDB Atlas (cloud) / In-memory LocalStore (dev fallback) |
| **AI/ML** | OpenAI GPT, Custom Predictive Model |
| **Auth** | JWT tokens with role-based access |
| **Deployment** | Docker, Vercel (frontend), Render (backend) |
| **CI/CD** | GitHub Actions |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- MongoDB (optional — falls back to in-memory)

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Backend — copy and edit
cp backend/.env.example backend/.env

# Frontend — already configured
# Edit frontend/.env if needed
```

**Backend `.env`:**
```env
JWT_SECRET_KEY=your-secure-random-key
OPENAI_API_KEY=sk-your-key        # Optional — AI works without it
DEMO_ADMIN_PASSWORD=change-me     # Optional — defaults to admin123
DEMO_ENGINEER_PASSWORD=change-me  # Optional — defaults to engineer123
FLASK_ENV=development
PORT=5000
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
python run.py

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### 4. Open Browser

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:5000/api/health |

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@plantpulse.ai` | `admin123` |
| **Engineer** | `engineer@plantpulse.ai` | `engineer123` |

> ⚠️ Change demo passwords via `DEMO_ADMIN_PASSWORD` / `DEMO_ENGINEER_PASSWORD` env vars in production.

---

## 📡 API Overview

The backend exposes **49+ REST endpoints** across 9 route blueprints:

| Blueprint | Prefix | Key Endpoints |
|-----------|--------|---------------|
| **Auth** | `/api/auth` | Register, Login, Profile |
| **Assets** | `/api/assets` | CRUD, Stats |
| **Dashboard** | `/api/dashboard` | KPIs, Charts, Recent Alerts |
| **Maintenance** | `/api/maintenance` | CRUD, Analyze, Predictions, History |
| **Work Orders** | `/api/work-orders` | CRUD, Status Updates |
| **Alerts** | `/api/alerts` | CRUD, Acknowledge, Severity Filter |
| **AI** | `/api/ai` | Analyze, Chat, Reports, Fault Analysis, Predict |
| **Reports** | `/api/reports` | CRUD, Save, Asset/Maintenance/Failure/Monthly |
| **Users** | `/api/users` | List, Role Update, Deactivate |

Full API documentation: [docs/API-Docs/api.md](docs/API-Docs/api.md)

---

## 🐳 Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

### Production Deployment

| Service | Platform | Instructions |
|---------|----------|-------------|
| **Frontend** | Vercel | Connect repo → set `FRAMEWORK_PRESET=vite` → add `VITE_API_URL` env |
| **Backend** | Render | New Web Service → Dockerfile.backend → add `JWT_SECRET_KEY` env |

---

## 🧪 Testing

```bash
# Backend API verification (24 endpoints)
cd backend
python -c "
import os; os.environ['FLASK_ENV'] = 'development'
from app import create_app
app = create_app()
with app.test_client() as c:
    l = c.post('/api/auth/login', json={'email':'admin@plantpulse.ai','password':'admin123'})
    print('API Health: OK' if l.status_code == 200 else 'FAIL')
"

# Frontend build verification
cd frontend
npm run build
```

---

## 📁 Project Structure Details

### Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | LandingPage | Marketing landing with features & stats |
| `/login` | Login | Sign-in with email & password |
| `/register` | Register | New user registration |
| `/dashboard` | Dashboard | KPI cards, 4 charts, recent alerts |
| `/dashboard/assets` | AssetManagement | Asset list with search & CRUD |
| `/dashboard/assets/add` | AddAsset | Create/edit asset form |
| `/dashboard/predictive` | PredictiveMaintenance | Sensor analysis & failure prediction |
| `/dashboard/work-orders` | WorkOrders | Work order list with status management |
| `/dashboard/work-orders/create` | CreateWorkOrder | New work order form |
| `/dashboard/analytics` | Analytics | Charts with filtering |
| `/dashboard/ai-assistant` | AIAssistant | AI chat interface |
| `/dashboard/reports` | Reports | Generate & view reports |
| `/dashboard/alerts` | Alerts | Alert management |
| `/dashboard/admin` | AdminPanel | User management (admin only) |
| `/dashboard/settings` | Settings | Profile settings |

### Backend Routes (49+ Endpoints)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login |
| `GET/PUT` | `/api/auth/profile` | User profile |
| `GET/POST/PUT/DELETE` | `/api/assets[/:id]` | Asset CRUD |
| `GET` | `/api/assets/stats` | Asset statistics |
| `GET` | `/api/dashboard/kpis` | Dashboard KPIs |
| `GET` | `/api/dashboard/charts` | Dashboard chart data |
| `GET` | `/api/dashboard/recent-alerts` | Recent alerts |
| `POST` | `/api/maintenance/analyze` | Analyze sensor data |
| `GET` | `/api/maintenance/predictions` | Get predictions |
| `GET/POST/PUT/DELETE` | `/api/work-orders[/:id]` | Work order CRUD |
| `GET/POST/PUT/DELETE` | `/api/alerts[/:id]` | Alert CRUD |
| `PUT` | `/api/alerts/acknowledge-all` | Acknowledge all |
| `GET` | `/api/alerts/severity/:level` | Filter by severity |
| `POST` | `/api/ai/analyze` | AI asset analysis |
| `POST` | `/api/ai/chat` | AI chat |
| `POST` | `/api/ai/predict` | AI failure prediction |
| `GET` | `/api/reports` | List all reports |
| `POST` | `/api/reports/save` | Save new report |
| `GET` | `/api/users` | List users (admin) |
| `PUT` | `/api/users/:id/role` | Update user role |

---

## 🔒 Security

- **JWT Authentication** — All API routes protected with token verification
- **Role-Based Access** — Admin/Manager/Engineer/Operator/Technician/Viewer roles
- **Password Security** — Passwords hashed before storage
- **Environment Variables** — All secrets via `.env`, never committed to repo
- **CORS** — Configured for cross-origin requests
- **Input Validation** — Request payloads validated on all endpoints
- **Auto-Seed** — Demo data seeded automatically on first run

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Flask](https://flask.palletsprojects.com/)
- AI features via [OpenAI](https://openai.com/) and custom ML models
- Charts by [Chart.js](https://www.chartjs.org/) via [react-chartjs-2](https://react-chartjs-2.js.org/)
- Icons by [React Icons](https://react-icons.github.io/react-icons/) (Feather)
