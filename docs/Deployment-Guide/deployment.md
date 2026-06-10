# PlantPulse AI - Deployment Guide

## Architecture
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Vercel    │────►│    Render    │────►│  MongoDB    │
│  (Frontend) │     │  (Backend)   │     │   Atlas     │
│  React/Vite │     │  Flask API   │     │  Database   │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   OpenAI     │
                    │    API       │
                    └──────────────┘
```

## Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas account
- OpenAI API key
- Vercel account
- Render account
- GitHub account

## Environment Variables

### Frontend (Vercel)
```
VITE_API_URL=https://plantpulse-api.onrender.com/api
```

### Backend (Render)
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/plantpulse
JWT_SECRET_KEY=<your-jwt-secret>
OPENAI_API_KEY=<your-openai-api-key>
FLASK_ENV=production
PORT=5000
```

## Local Development

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create .env file with environment variables
python run.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Deployment Steps

### 1. MongoDB Atlas Setup
1. Create cluster (free M0 tier)
2. Create database user
3. Whitelist IP (0.0.0.0/0 for production)
4. Get connection string

### 2. Backend Deployment (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn run:app`
   - **Root Directory:** `backend`
4. Add environment variables
5. Deploy

### 3. Frontend Deployment (Vercel)
1. Import GitHub repository
2. Configure:
   - **Framework:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add `VITE_API_URL` environment variable
4. Deploy

## Docker Deployment

### Build and Run
```bash
# Backend
docker build -t plantpulse-backend -f Dockerfile.backend .
docker run -p 5000:5000 --env-file .env plantpulse-backend

# Frontend
docker build -t plantpulse-frontend -f Dockerfile.frontend .
docker run -p 3000:3000 plantpulse-frontend

# Docker Compose (all services)
docker-compose up -d
```

## CI/CD Pipeline (GitHub Actions)

The `.github/workflows/deploy.yml` automatically:
1. Runs tests on push to main
2. Builds frontend and backend
3. Deploys to Vercel (frontend)
4. Deploys to Render (backend)

## Post-Deployment Checklist
- [ ] API health check: `GET /api/health`
- [ ] User registration working
- [ ] JWT authentication working
- [ ] MongoDB connection verified
- [ ] OpenAI API integration working
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled
- [ ] Environment variables set
- [ ] Database indexes created
