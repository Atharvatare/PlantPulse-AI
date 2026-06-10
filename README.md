# PlantPulse AI 🤖⚡

> **Smart Industrial Monitoring & Predictive Maintenance Platform**

[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-6366f1)](https://github.com)
[![Backend](https://img.shields.io/badge/Backend-Python%20Flask-22c55e)](https://github.com)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248)](https://github.com)
[![AI](https://img.shields.io/badge/AI-OpenAI%20API-412991)](https://github.com)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel%20%7C%20Render-000000)](https://github.com)

---

## ✨ Features

- **User Authentication** — JWT-based role management (Admin, Engineer, Manager)
- **Asset Management** — Full CRUD for industrial assets with health scoring
- **Predictive Maintenance** — AI-driven failure prediction & risk analysis
- **Work Order Management** — Ticket lifecycle from creation to completion
- **Industrial Dashboard** — Real-time KPIs, charts, and monitoring
- **AI Assistant** — Natural language chat for equipment diagnostics
- **Report Generation** — Automated reports with PDF/Excel export
- **Alert System** — Real-time alerts with severity-based notifications
- **Admin Panel** — User & role management with system controls
- **Mobile Responsive** — Dark industrial theme, responsive design

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Chart.js, React Router v6 |
| **Backend** | Python 3.10, Flask, Flask-JWT, Flask-PyMongo |
| **Database** | MongoDB Atlas (7 collections) |
| **AI** | OpenAI GPT API |
| **Deployment** | Vercel (FE), Render (BE), Docker |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Python 3.10+, MongoDB Atlas account

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Edit .env with your MongoDB URI & OpenAI key
python run.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
PlantPulse-AI/
├── frontend/          # React Vite application
├── backend/           # Python Flask REST API
├── docs/              # API docs, DB schema, ERD, deployment guide
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── vercel.json
```

## 🔗 API Endpoints

| Endpoint Group | Prefix |
|----------------|--------|
| Auth | `/api/auth/*` |
| Assets | `/api/assets/*` |
| Maintenance | `/api/maintenance/*` |
| Work Orders | `/api/work-orders/*` |
| Dashboard | `/api/dashboard/*` |
| Alerts | `/api/alerts/*` |
| AI | `/api/ai/*` |
| Reports | `/api/reports/*` |
| Users | `/api/users/*` |

Full API docs → [`docs/API-Docs/api.md`](docs/API-Docs/api.md)

## 🐳 Docker

```bash
docker-compose up -d
```

## 📊 Database Collections

`Users`, `Assets`, `Maintenance Records`, `Work Orders`, `Alerts`, `AI Reports`, `Sensor Data`

Schema details → [`docs/Database-Schema/schema.md`](docs/Database-Schema/schema.md)

## 🔐 Environment Variables

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET_KEY=your-secret
OPENAI_API_KEY=sk-...
VITE_API_URL=http://localhost:5000/api
```

## 📄 License

MIT © PlantPulse AI
