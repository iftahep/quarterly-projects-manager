# Quarterly Project Manager - Backend Server

Node.js + Express + SQLite backend server for managing multiple quarters.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3001`

## Database

The server uses SQLite with Sequelize ORM. The database file (`database.sqlite`) will be created automatically on first run.

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Quarters Management
- `GET /api/quarters` - Get list of all quarters (id, name, isActive)
- `POST /api/quarters` - Create a new quarter
  - Body: `{ name: "Q1 2025", data: {...} }`
- `GET /api/quarters/:id` - Get full data for a specific quarter
- `PUT /api/quarters/:id` - Update quarter data
  - Body: `{ name?: "...", data?: {...} }`
- `POST /api/quarters/:id/activate` - Set quarter as active
- `GET /api/quarters/active` - Get currently active quarter

## Configuration

- Port: 3001
- CORS: Enabled for `http://localhost:5173`
- JSON Body Limit: 50mb
- Database: SQLite (`./database.sqlite`)

## Model: Quarter

- `id`: Integer, Primary Key, Auto Increment
- `name`: String (e.g., "Q1 2025")
- `data`: JSON (stores entire application state)
- `isActive`: Boolean (indicates which quarter to load by default)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

