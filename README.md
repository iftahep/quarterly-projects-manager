# Quarterly Project Manager

A comprehensive React application built with Vite and Tailwind CSS for managing quarterly projects, sprint allocations, and resource planning.

## Features

### Projects Table
- **Epic Management**: Track project epics with expandable Epic column (300px width)
- **Ownership**: Assign Owner and Tech Owner from predefined dropdown lists
- **Effort Estimation**: Input required hours for Backend, Android, and iOS teams
- **Project Balance Tracking**: 
  - Automatic calculation of allocated hours per project
  - Balance calculation (Required - Allocated) with color coding:
    - 🟢 Green: Exact balance (0)
    - 🟡 Yellow: Under-allocated (positive balance)
    - 🔴 Red: Over-allocated (negative balance)
- **Summary Row**: Automatic totals for all effort columns

### Sprint Allocation Table
- **Dynamic Sprint Columns**: Automatically generated based on sprints defined in Resource Planning
- **Visual Separators**: Clear separation between Backend, Android, and iOS sprint groups
- **Smart Coloring**: 
  - Only cells with allocated hours (> 0) are colored
  - Empty cells remain gray for better readability
  - Color coding: Backend (green), Android (blue), iOS (orange)
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
- **Real-time Updates**: Changes automatically reflect in Sprint Allocation table

### Data Persistence
- **LocalStorage**: All data automatically saved to browser's local storage
- **Save Changes Button**: Manual save with toast notification
- **Auto-load**: Data automatically loads on application start

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
│   │   └── Header.jsx         # Header with save button
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles with Tailwind
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

### Header Component
- Application title
- Save Changes button with toast notification

## Usage

1. **Add Projects**: Click "Add Row" in Projects Table to add new projects
2. **Set Requirements**: Enter required hours for Backend, Android, and iOS
3. **Define Sprints**: Add sprints in Resource Planning section and set capacities
4. **Allocate Hours**: Enter allocated hours in Sprint Allocation table
5. **Monitor Balance**: Check Balance Summary and project-level balances
6. **Save Data**: Click "Save Changes" to persist data to localStorage

## Data Storage

All data is stored in browser's localStorage under the key `quarterlyProjectsData`, including:
- Projects list with all fields
- Sprint definitions (Backend, Android, iOS)
- Sprint allocations per project

## Recent Updates

- ✅ Dynamic column widths (Epic: 300px, others optimized)
- ✅ Visual separators between sprint groups
- ✅ Smart coloring (only cells with values)
- ✅ Project-level balance tracking
- ✅ Auto-calculated capacity in Balance Summary
- ✅ localStorage persistence with save button

## License

MIT
