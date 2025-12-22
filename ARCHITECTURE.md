# Quarterly Project Manager - Architecture Documentation

## Overview

This is a full-stack application for managing quarterly projects, sprint allocations, and resource planning. The application consists of a React frontend (Vite) and a Node.js/Express backend with SQLite database.

## Project Structure

```
quarterly-projects-manager/
├── server/                 # Backend server
│   ├── server.js          # Express server with API routes
│   ├── database.sqlite    # SQLite database (auto-generated)
│   ├── package.json       # Backend dependencies
│   └── README.md          # Server documentation
├── src/                    # Frontend React application
│   ├── components/        # React components
│   │   ├── Dashboard.jsx  # Main dashboard with tabbed interface
│   │   ├── OverviewTab.jsx # Overview tab component (complete dashboard view)
│   │   ├── TeamTab.jsx    # Team-specific tab component (Backend/Android/iOS)
│   │   ├── Header.jsx     # Header with save button
│   │   ├── QuarterSelector.jsx  # Quarter selection UI
│   │   └── GanttModal.jsx # Gantt chart timeline visualization
│   ├── services/          # API service layer
│   │   └── api.js         # API client functions
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles with Tailwind
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # Project documentation
```

## Architecture Layers

### 1. Backend Layer (server/)

**Technology Stack:**
- **Node.js** with **Express** framework
- **SQLite** database with **Sequelize** ORM
- **CORS** enabled for frontend communication

**Server Configuration:**
- Port: `3001`
- CORS Origin: `http://localhost:5173`
- JSON Body Limit: `50mb` (for large project data)

**Database Model:**
- **Quarter** model with fields:
  - `id`: Integer, Primary Key, Auto Increment
  - `name`: String (e.g., "Q1 2026")
  - `data`: JSON (stores entire application state)
  - `isActive`: Boolean (indicates active quarter)
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

**API Endpoints:**
- `GET /api/health` - Health check
- `GET /api/quarters` - Get all quarters (id, name, isActive)
- `POST /api/quarters` - Create new quarter
- `GET /api/quarters/:id` - Get quarter by ID
- `PUT /api/quarters/:id` - Update quarter data
- `POST /api/quarters/:id/activate` - Activate quarter
- `GET /api/quarters/active` - Get active quarter
- `DELETE /api/quarters/:id` - Delete quarter

**Data Storage:**
- All application state (projects, sprints, allocations) stored as JSON in `Quarter.data` field
- Database file: `server/database.sqlite` (auto-created on first run)

### 2. Frontend Layer (src/)

**Technology Stack:**
- **React 18** with functional components and hooks
- **Vite** for build tooling and dev server
- **Tailwind CSS** for styling
- **Fetch API** for HTTP requests

**Component Architecture:**

#### App.jsx (Root Component)
- Manages quarter selection state
- Loads active quarter on mount
- Provides save function reference to Header
- Renders QuarterSelector and Dashboard

#### QuarterSelector Component
- Displays list of all quarters
- Allows creating new quarters
- Allows activating/deleting quarters
- Shows active quarter indicator
- Handles quarter switching

#### Dashboard Component
- Main data management interface with **Tabbed Interface**
- **Tab Navigation**: Switch between Overview and team-specific views (Backend, Android, iOS)
- **Tab State**: `activeTab` state controls which tab is displayed
- Conditionally renders:
  - `OverviewTab` component (default) - Complete dashboard view
  - `TeamTab` component - Team-specific focused views
- Manages all application state:
  - `projects`: Array of project objects (shared across all tabs)
  - `backendSprints`: Array of backend sprint definitions
  - `androidSprints`: Array of android sprint definitions
  - `iosSprints`: Array of iOS sprint definitions
  - `showBackendSprints`, `showAndroidSprints`, `showIosSprints`: Column visibility toggles
- Handles data persistence via API
- All tabs share the same `projects` state for real-time synchronization

#### OverviewTab Component
- Complete dashboard view (extracted from Dashboard)
- Contains all tables:
  - Projects Table
  - Balance Summary Table
  - Sprint Allocation Table
  - Resource Planning (3 Sprint Capacity Tables)
- Includes Gantt Chart Modal trigger button
- Shows Sticky Footer Status Bar with total balances

#### TeamTab Component
- Unified team view for Backend, Android, or iOS
- Reusable component that accepts `team` prop
- Displays:
  - Epic (sticky column)
  - Owner and Tech Owner
  - Team Effort (input field)
  - Allocated (calculated, read-only)
  - Balance (calculated, read-only, color-coded)
  - Team Sprint columns (all sprints for selected team)
- Visual separator between Project Summary and Sprint Timeline
- Team-specific color coding:
  - Effort/Allocated/Balance: Light colors (100)
  - Sprint columns: Stronger colors (200)

#### Header Component
- Displays application title
- Save Changes button with toast notification
- Triggers save function from Dashboard via ref

#### SprintTable Component (Memoized)
- Reusable component for sprint capacity tables
- Prevents re-renders to fix input focus issues
- Used for Backend, Android, and iOS sprint tables

**Service Layer (src/services/api.js):**
- Centralized API client
- Base URL: `http://localhost:3001/api`
- Error handling with detailed messages
- Functions for all quarter operations

## Data Flow

### Loading Data
1. App.jsx loads active quarter on mount
2. If active quarter exists, passes `quarterId` to Dashboard
3. Dashboard loads quarter data from API
4. Data is parsed and set to component state
5. Tables render with loaded data

### Saving Data
1. User clicks "Save Changes" in Header
2. Header calls save function via ref from Dashboard
3. Dashboard collects all state (projects, sprints)
4. Data is sent to API via `PUT /api/quarters/:id`
5. Toast notification confirms save

### Quarter Management
1. User creates/activates/deletes quarter via QuarterSelector
2. API calls update database
3. QuarterSelector reloads quarter list
4. App.jsx updates current quarter ID
5. Dashboard reloads data for new quarter

## State Management

### Application State Structure
```javascript
{
  projects: [
    {
      id: number,
      epic: string,
      owner: string,
      techOwner: string,
      backend: number,
      android: number,
      ios: number,
      backend_{sprintId}: number,  // Dynamic sprint allocations
      android_{sprintId}: number,
      ios_{sprintId}: number
    }
  ],
  backendSprints: [
    {
      id: number,
      name: string,
      capacity: number
    }
  ],
  androidSprints: [...],
  iosSprints: [...]
}
```

### State Flow
- **Local State**: Each component manages its own state with `useState`
- **Props**: Data flows down from parent to child
- **Refs**: Save function exposed via `useRef` for Header access
- **API**: State synchronized with backend database

## Key Features Implementation

### Dynamic Sprint Columns
- Sprint columns in Sprint Allocation table are generated dynamically
- Based on sprints defined in Resource Planning
- When sprint is added/deleted, columns update automatically
- Project allocation fields added/removed accordingly

### Smart Coloring
- Only cells with values (> 0) are colored
- Empty cells remain gray
- Color coding: Backend (green), Android (blue), iOS (orange)

### Balance Calculations
- **Project Balance**: Required - Allocated (per project, per team)
- **Sprint Balance**: Capacity - Allocated (per sprint)
- **Overall Balance**: Total Capacity - Total Required
- Color coding: Green (0), Yellow (positive), Red (negative)

### Visual Separators
- Thick borders (border-r-4) between sprint groups
- Separates Backend, Android, and iOS sprint columns
- Applied to headers, body cells, and footer rows

## Development Workflow

### Running the Application

**Backend:**
```bash
cd server
npm start
```
Server runs on `http://localhost:3001`

**Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### Database
- SQLite database auto-created on first server start
- File: `server/database.sqlite`
- Tables auto-created by Sequelize
- No migrations needed (simple structure)

### Build for Production
```bash
npm run build
```
Output in `dist/` directory

## API Communication

### Request/Response Format
- All requests use JSON
- Content-Type: `application/json`
- CORS enabled for frontend origin

### Error Handling
- API errors return JSON with `error` field
- Frontend catches errors and displays user-friendly messages
- Network errors logged to console

## Component Communication

### Parent-Child
- Props passed down (quarterId, saveFunctionRef)
- Callbacks passed for actions (onQuarterChange)

### Sibling Components
- App.jsx coordinates between QuarterSelector and Dashboard
- Header accesses Dashboard save function via ref

### State Updates
- State changes trigger re-renders
- API calls update backend, then reload data
- Optimistic updates not used (always sync with server)

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design with Tailwind breakpoints
- Custom colors for teams (green, blue, orange)
- Consistent spacing and typography

### Component Styling
- Inline styles for fixed widths (table columns)
- Tailwind classes for layout and colors
- Hover states and transitions
- Modal overlays with backdrop

## Future Considerations

### Potential Improvements
- Add authentication/authorization
- Support multiple users/teams
- Add export/import functionality
- Add version history for quarters
- Add real-time collaboration
- Add data validation on backend
- Add unit/integration tests

### Scalability
- Current architecture supports single-user use case
- SQLite suitable for small-medium datasets
- Can migrate to PostgreSQL for larger scale
- Frontend can be optimized with code splitting

## Dependencies

### Backend (server/package.json)
- express: Web framework
- cors: CORS middleware
- sqlite3: SQLite database driver
- sequelize: ORM for database operations

### Frontend (package.json)
- react: UI library
- react-dom: React DOM renderer
- vite: Build tool and dev server
- tailwindcss: CSS framework
- autoprefixer: CSS post-processor
- postcss: CSS transformer

## Environment Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone repository
2. Install frontend dependencies: `npm install`
3. Install backend dependencies: `cd server && npm install`
4. Start backend: `cd server && npm start`
5. Start frontend: `npm run dev`

## Data Migration

### From LocalStorage to Database
- Initial data can be imported from localStorage
- Import button creates new quarter with localStorage data
- After import, all data stored in database
- LocalStorage no longer used for persistence

## Security Considerations

### Current State
- No authentication (single-user application)
- CORS restricted to localhost:5173
- No input validation on backend
- SQL injection protected by Sequelize

### Production Recommendations
- Add authentication middleware
- Validate all inputs
- Sanitize data before storage
- Add rate limiting
- Use HTTPS
- Add CSRF protection

