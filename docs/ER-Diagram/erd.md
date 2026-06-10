# PlantPulse AI - Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     PLANT PULSE AI - ER DIAGRAM                  │
└─────────────────────────────────────────────────────────────────┘

                         ┌─────────────┐
                         │    USERS    │
                         ├─────────────┤
                         │ _id (PK)    │
                         │ name        │
                         │ email       │
                         │ password    │
                         │ role        │
                         │ createdAt   │
                         └─────────────┘
                               │
                               │ 1
                               │
                               │ Has Many
                               │
           ┌───────────────────┼──────────────────────┐
           │                   │                      │
           ▼                   ▼                      ▼
   ┌───────────────┐   ┌──────────────┐   ┌──────────────────┐
   │    ASSETS     │◄──│ WORK ORDERS  │   │ MAINTENANCE REC  │
   ├───────────────┤   ├──────────────┤   ├──────────────────┤
   │ _id (PK)      │   │ _id (PK)     │   │ _id (PK)         │
   │ assetId (UK)  │   │ ticketNumber │   │ assetId (FK)     │
   │ assetName     │   │ assetId (FK) │   │ maintenanceType  │
   │ category      │   │ engineer     │   │ description      │
   │ location      │   │ priority     │   │ engineer         │
   │ capacity      │   │ status       │   │ date             │
   │ vendor        │   │ description  │   │ remarks          │
   │ installDate   │   │ createdDate  │   │ cost             │
   │ healthScore   │   │ completedDate│   │ createdAt        │
   │ status        │   │ createdAt    │   └──────────────────┘
   │ createdAt     │   └──────────────┘
   └───────────────┘
         │
         │ 1
         │
         │ Has Many (via assetId)
         │
    ┌────┼────────────────────────────────────┐
    │    │                                    │
    ▼    ▼                                    ▼
┌───────────┐  ┌────────────────┐  ┌──────────────────┐
│  ALERTS   │  │  AI REPORTS   │  │  SENSOR DATA     │
├───────────┤  ├────────────────┤  ├──────────────────┤
│ _id (PK)  │  │ _id (PK)       │  │ _id (PK)         │
│ assetId   │  │ assetId (FK)   │  │ assetId (FK)     │
│ alertType │  │ reportType     │  │ temperature      │
│ severity  │  │ analysis       │  │ current          │
│ message   │  │ recommendation │  │ voltage          │
│ isAck     │  │ healthScore    │  │ runningHours     │
│ timestamp │  │ failProb       │  │ vibrationLevel   │
└───────────┘  │ riskLevel      │  │ pressure         │
               │ parameters     │  │ flowRate         │
               │ createdAt      │  │ timestamp        │
               └────────────────┘  └──────────────────┘

Legend:
─────► One-to-Many relationship
(PK)  Primary Key
(FK)  Foreign Key
(UK)  Unique Key
```

## Key Relationships

| Entity | Relationship | Related Entity | Cardinality |
|--------|-------------|----------------|-------------|
| Users | Manages | Work Orders | 1:N |
| Assets | Has | Alerts | 1:N |
| Assets | Has | AI Reports | 1:N |
| Assets | Has | Sensor Data | 1:N |
| Assets | Has | Maintenance Records | 1:N |
| Assets | Has | Work Orders | 1:N |

## Relationship Rules
- An Asset can have multiple Maintenance Records but each record belongs to one Asset
- An Asset can have multiple Work Orders but each order is for one Asset
- An Asset can have multiple Alerts but each alert is for one Asset
- An Asset can have multiple AI Reports but each report is for one Asset
- An Asset can have multiple Sensor Data entries but each data point is for one Asset
