# Quarterly Project Manager

A comprehensive React application built with Vite and Tailwind CSS for managing quarterly projects, sprint allocations, and resource planning.

## Features

### Projects Table
- **Epic Management**: Track project epics with expandable Epic column (300px width)
- **Ownership**: Assign Owner and Tech Owner from predefined dropdown lists
- **Effort Estimation**: Input required hours for Backend, Android, and iOS teams
- **Project Reordering**: 
  - Move projects up/down using arrow buttons in the "Move" column
  - First project cannot move up, last project cannot move down
  - Order is preserved when saving data
- **Project Balance Tracking**: 
  - Automatic calculation of allocated hours per project
  - Balance calculation (Required - Allocated) with color coding:
    - 🟢 Green: Exact balance (0)
    - 🟡 Yellow: Under-allocated (positive balance)
    - 🔴 Red: Over-allocated (negative balance)
- **Summary Row**: Automatic totals for all effort columns

### Sprint Allocation Table
- **Dynamic Sprint Columns**: Automatically generated based on sprints defined in Resource Planning
- **Visual Grouping**: Super Headers row with team grouping (Backend, Android, iOS) for better organization
- **Column Visibility Toggle**: Show/hide sprint columns by team using checkboxes above the table
- **Visual Separators**: Clear separation between Backend, Android, and iOS sprint groups
- **Smart Coloring**: 
  - Only cells with allocated hours (> 0) are colored
  - Empty cells remain gray for better readability
  - Color coding: Backend (green), Android (blue), iOS (orange)
- **Smart Sprint Headers**: 
  - Display sprint name and balance in header cells
  - Red background for negative balance, green for positive
  - Sticky headers that stay visible while scrolling
- **Sticky Footer Row**: 
  - Summary row with Allocated, Capacity, and Balance for each sprint
  - Stays visible at bottom of table (above global status bar)
  - Clean layout with labels in first column, numbers in data cells
- **Sprint Summary Footers**: 
  - Total Allocated per sprint
  - Sprint Capacity
  - Balance (Capacity - Allocated) with color coding

### Balance Summary Table
- **Require**: Sum of required hours from Projects Table
- **Capacity**: Automatically calculated from Sprint Capacity tables
- **Balance**: Capacity - Require with color coding

### Resource Planning
- **Three Sprint Capacity Tables**: Separate tables for Backend, Android, and iOS
- **Sprint Management**: 
  - Add/Delete sprints dynamically
  - Set capacity for each sprint
  - Clean delete buttons: Icon-only, hidden by default, appear on row hover
- **Real-time Updates**: Changes automatically reflect in Sprint Allocation table

### Gantt Chart View
- **Timeline Visualization**: Full-screen modal showing project timeline across sprints
- **Multi-Team Tracks**: Each project row displays 3 sub-tracks (Backend, Android, iOS)
- **Visual Bars**: 
  - Color-coded bars (Green=Backend, Blue=Android, Orange=iOS)
  - Bars show allocation hours within each sprint
  - Connected bars for projects spanning multiple consecutive sprints
- **Classic Gantt Layout**: 
  - Project names on the left (sticky column)
  - Sprint timeline on the right
  - Legend showing team color coding
- **Access**: Click "Show Gantt" button in Projects Table header

### Data Persistence
- **Backend API**: All data stored in SQLite database via Node.js/Express backend
- **Multi-Quarter Management**: Create, activate, and switch between multiple quarters
- **Save Changes Button**: Manual save with toast notification
- **Auto-load**: Data automatically loads when switching quarters

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/iftahep/quarterly-projects-manager.git
cd quarterly-projects-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
quarterly-projects-manager/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main dashboard with all tables
│   │   ├── Header.jsx         # Header with save button
│   │   ├── QuarterSelector.jsx # Quarter selection and management
│   │   └── GanttModal.jsx     # Gantt chart timeline visualization
│   ├── services/
│   │   └── api.js             # API client for backend communication
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles with Tailwind
├── server/
│   ├── server.js              # Express backend server
│   ├── package.json           # Backend dependencies
│   └── database.sqlite        # SQLite database (auto-generated)
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **LocalStorage API** - Client-side data persistence

## Key Components

### Dashboard Component
Main component containing:
- Projects Table
- Balance Summary Table
- Sprint Allocation Table
- Resource Planning Section (3 Sprint Capacity Tables)
- Gantt Chart Modal trigger button

### Header Component
- Application title
- Save Changes button with toast notification

### GanttModal Component
- Full-screen modal overlay
- Timeline visualization of project allocations
- Multi-team track display (Backend, Android, iOS)
- Classic Gantt chart layout with sticky project names column

### QuarterSelector Component
- Quarter selection dropdown
- Create, activate, and delete quarters
- Active quarter indicator

## Usage

1. **Add Projects**: Click "Add Row" in Projects Table to add new projects
2. **Reorder Projects**: Use the up/down arrow buttons in the "Move" column to change project order
3. **Set Requirements**: Enter required hours for Backend, Android, and iOS
4. **Define Sprints**: Add sprints in Resource Planning section and set capacities
5. **Allocate Hours**: Enter allocated hours in Sprint Allocation table
6. **Monitor Balance**: Check Balance Summary and project-level balances
7. **Save Data**: Click "Save Changes" to persist data to the backend API

## Data Storage

All data is stored in SQLite database via the backend API, including:
- Projects list with all fields
- Sprint definitions (Backend, Android, iOS)
- Sprint allocations per project
- Multiple quarters with independent data sets

## Recent Updates

- ✅ **Gantt Chart View**: New timeline visualization modal showing project allocations across sprints
- ✅ **Sticky Footer Rows**: Summary rows in Projects and Sprint Allocation tables stay visible while scrolling
- ✅ **Smart Sprint Headers**: Headers show capacity and balance with color-coded feedback
- ✅ **Column Visibility Toggle**: Show/hide sprint columns by team to manage wide tables
- ✅ **Visual Team Grouping**: Super Headers row groups sprints by team (Backend, Android, iOS)
- ✅ **Clean Summary Footer**: Redesigned Sprint Allocation footer with labels in first column
- ✅ **Subtle Delete Buttons**: Icon-only delete buttons in Resource Planning tables, appear on hover
- ✅ **Sticky Footer Status Bar**: Global status bar showing total balances for all teams
- ✅ Project reordering with up/down arrow buttons
- ✅ Clean table UI with improved spacing and minimal borders
- ✅ Dynamic column widths (Epic: 300px, others optimized)
- ✅ Visual separators between sprint groups
- ✅ Smart coloring (only cells with values)
- ✅ Project-level balance tracking
- ✅ Auto-calculated capacity in Balance Summary
- ✅ Backend API integration with SQLite database
- ✅ Multi-quarter management system

## License

MIT
