# PlantPulse AI - Database Schema

## Overview
MongoDB Atlas database with 7 collections for industrial asset management.

## Collections

### Users
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique, indexed)",
  "password": "String (required, bcrypt hashed)",
  "role": "String (enum: Admin, Engineer, Manager, default: Engineer)",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```
**Indexes:** `email` (unique)

### Assets
```json
{
  "_id": "ObjectId",
  "assetId": "String (required, unique)",
  "assetName": "String (required)",
  "category": "String (enum: Motor, Pump, Compressor, Transformer, Conveyor, Other)",
  "location": "String (required)",
  "capacity": "String",
  "vendor": "String",
  "installationDate": "Date",
  "healthScore": "Number (default: 100, range: 0-100)",
  "status": "String (enum: Running, Stopped, Maintenance, Faulty, default: Running)",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```
**Indexes:** `assetId` (unique), `status`, `category`

### Maintenance Records
```json
{
  "_id": "ObjectId",
  "assetId": "String (required, ref: Assets)",
  "maintenanceType": "String (enum: Preventive, Corrective, Predictive, Emergency)",
  "description": "String (required)",
  "engineer": "String (required)",
  "date": "Date (required)",
  "remarks": "String",
  "cost": "Number (default: 0)",
  "createdAt": "Date (default: now)"
}
```
**Indexes:** `assetId`, `date`

### Work Orders
```json
{
  "_id": "ObjectId",
  "ticketNumber": "String (required, unique, auto-generated)",
  "assetId": "String (required, ref: Assets)",
  "assignedEngineer": "String (required)",
  "priority": "String (enum: High, Medium, Low, default: Medium)",
  "status": "String (enum: Open, In Progress, Completed, default: Open)",
  "description": "String (required)",
  "createdDate": "Date (default: now)",
  "completedDate": "Date",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```
**Indexes:** `ticketNumber` (unique), `status`, `priority`

### Alerts
```json
{
  "_id": "ObjectId",
  "assetId": "String (required, ref: Assets)",
  "alertType": "String (enum: Overheating, Vibration, Pressure, Performance, Maintenance Due, Fault)",
  "severity": "String (enum: Critical, Warning, Info, default: Warning)",
  "message": "String (required)",
  "isAcknowledged": "Boolean (default: false)",
  "timestamp": "Date (default: now)"
}
```
**Indexes:** `severity`, `timestamp`, `isAcknowledged`

### AI Reports
```json
{
  "_id": "ObjectId",
  "assetId": "String (required, ref: Assets)",
  "reportType": "String (enum: Health Analysis, Predictive Maintenance, Fault Analysis, Monthly Report)",
  "analysis": "String (required)",
  "recommendation": "String (required)",
  "healthScore": "Number",
  "failureProbability": "Number",
  "riskLevel": "String (enum: Low, Medium, High, Critical)",
  "parameters": "Object",
  "createdAt": "Date (default: now)"
}
```
**Indexes:** `assetId`, `createdAt`

### Sensor Data
```json
{
  "_id": "ObjectId",
  "assetId": "String (required, ref: Assets)",
  "temperature": "Number",
  "current": "Number",
  "voltage": "Number",
  "runningHours": "Number",
  "vibrationLevel": "Number",
  "pressure": "Number",
  "flowRate": "Number",
  "timestamp": "Date (default: now)"
}
```
**Indexes:** `assetId`, `timestamp`

## Relationships
- Assets → Maintenance Records (1:N via assetId)
- Assets → Work Orders (1:N via assetId)
- Assets → Alerts (1:N via assetId)
- Assets → AI Reports (1:N via assetId)
- Assets → Sensor Data (1:N via assetId)
