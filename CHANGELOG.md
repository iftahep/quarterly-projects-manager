# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Tabbed Interface for Dashboard**: Added a new tabbed navigation system to the Dashboard component
  - **Overview Tab**: Displays the complete dashboard view (Projects Table, Balance Summary, Sprint Allocation Table, Resource Planning) - exactly as it was before
  - **Backend Tab**: Unified team view showing only Backend-related data (Epic, Owner, Tech Owner, Backend Effort, Backend Sprints)
  - **Android Tab**: Unified team view showing only Android-related data
  - **iOS Tab**: Unified team view showing only iOS-related data
  - Tab navigation bar with 4 options: "Overview", "Backend", "Android", "iOS"
  - Default tab is "Overview"

### Changed
- **Component Architecture**: Refactored Dashboard component to use a modular structure
  - Extracted existing dashboard content into `OverviewTab.jsx` component
  - Created new `TeamTab.jsx` component for unified team views (reusable for Backend, Android, iOS)
  - Dashboard now conditionally renders the appropriate tab component based on active tab state

### Technical Details
- All tabs share the same `projects` state, ensuring data synchronization across all views
- Changes made in any tab (Overview or team-specific) are immediately reflected in all other tabs
- Maintained all existing styling features (zebra striping, row hover effects, sticky columns, etc.)
- Sticky footer status bar and Gantt Chart modal are only shown in the Overview tab
- Team tabs show a focused view with sticky Epic column, team effort column, and team sprint columns
- Each team tab includes a sticky footer showing totals and balance for that specific team only

## [Previous Versions]

### Features Previously Implemented
- Projects Table with Epic, Owner, Tech Owner, and team effort estimation (Backend, Android, iOS)
- Sprint Allocation Table with dynamic sprint columns
- Resource Planning section with Sprint Capacity tables
- Balance Summary table
- Project reordering functionality
- Gantt Chart view
- Quarter management with backend API integration
- Data persistence using SQLite database
- Sticky columns and footer rows
- Zebra striping and row hover effects
- Column visibility toggles for sprint allocation table
- Visual grouping with super headers for team sprints

