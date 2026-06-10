# PlantPulse AI - API Documentation

## Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://plantpulse-api.onrender.com/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### POST /api/auth/register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "Engineer"
}
```
**Response:**
```json
{
  "success": true,
  "data": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "Engineer" },
  "message": "Registration successful"
}
```

### POST /api/auth/login
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "success": true,
  "data": { "token": "jwt-token", "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "Engineer" } },
  "message": "Login successful"
}
```

## Asset Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/assets` | Get all assets | Yes |
| GET | `/api/assets/stats` | Get asset statistics | Yes |
| GET | `/api/assets/:id` | Get asset by ID | Yes |
| POST | `/api/assets` | Create asset | Admin |
| PUT | `/api/assets/:id` | Update asset | Admin |
| DELETE | `/api/assets/:id` | Delete asset | Admin |

### GET /api/assets
**Query Parameters:** `?status=Running&category=Motor&page=1&limit=10`

### GET /api/assets/stats
**Response:**
```json
{
  "success": true,
  "data": { "total": 150, "running": 120, "stopped": 15, "maintenance": 10, "faulty": 5 },
  "message": "Asset stats retrieved"
}
```

### POST /api/assets
```json
{
  "assetId": "MTR-101",
  "assetName": "Motor 1",
  "category": "Motor",
  "location": "Plant A",
  "capacity": "50 HP",
  "vendor": "ABB",
  "installationDate": "2024-01-15"
}
```

## Maintenance Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/maintenance` | Get all maintenance records | Yes |
| GET | `/api/maintenance/asset/:assetId` | Get by asset | Yes |
| POST | `/api/maintenance` | Create record | Admin |
| PUT | `/api/maintenance/:id` | Update record | Yes |
| DELETE | `/api/maintenance/:id` | Delete record | Admin |

## Work Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/work-orders` | Get all work orders | Yes |
| POST | `/api/work-orders` | Create work order | Admin/Manager |
| PUT | `/api/work-orders/:id/status` | Update status | Yes |
| DELETE | `/api/work-orders/:id` | Delete | Admin |

## Dashboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/kpis` | Get KPI data | Yes |
| GET | `/api/dashboard/charts` | Get chart data | Yes |
| GET | `/api/dashboard/recent-alerts` | Get recent alerts | Yes |

## Alert Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/alerts` | Get all alerts | Yes |
| GET | `/api/alerts/severity/:severity` | Filter by severity | Yes |
| POST | `/api/alerts` | Create alert | Admin |
| DELETE | `/api/alerts/:id` | Delete alert | Admin |

## AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/analyze` | Analyze asset health | Yes |
| POST | `/api/ai/chat` | AI chat assistant | Yes |
| POST | `/api/ai/report/:assetId` | Generate AI report | Yes |
| POST | `/api/ai/fault-analysis` | Fault analysis | Yes |

### POST /api/ai/analyze
```json
{
  "temperature": 85,
  "current": 45,
  "voltage": 415,
  "runningHours": 5000,
  "vibrationLevel": 3.2
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "healthScore": 82,
    "failureProbability": 18,
    "riskLevel": "Medium",
    "recommendation": "Inspect Bearings within 7 Days. Schedule maintenance check."
  }
}
```

### POST /api/ai/chat
```json
{
  "message": "Why is Motor MTR-101 overheating?"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Based on analysis of Motor MTR-101:\n\n**Possible Cause:** Bearing Wear\n**Confidence:** 87%\n**Recommended Action:** Inspect bearing lubrication and alignment.\n\n**Additional factors to check:**\n- Cooling fan operation\n- Ambient temperature\n- Load conditions\n- Winding resistance"
  }
}
```

## Report Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reports/asset/:assetId` | Asset report | Yes |
| GET | `/api/reports/maintenance` | Maintenance report | Yes |
| GET | `/api/reports/failure` | Failure report | Yes |
| GET | `/api/reports/monthly` | Monthly report | Yes |
| POST | `/api/reports/save` | Save report | Admin |

## User Endpoints (Admin)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | Admin |
| PUT | `/api/users/:id/role` | Update user role | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

## Error Responses
All errors return:
```json
{
  "success": false,
  "data": null,
  "message": "Error description"
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
