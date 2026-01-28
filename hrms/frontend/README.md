# HRMS Frontend

This is the frontend application for the Human Resource Management System (HRMS).

## Tech Stack

- React 19 with TypeScript
- Material-UI (MUI) for UI components
- React Router for navigation
- Redux Toolkit for state management
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:3001/api/v1
PORT=3000
```

### Running the Application

```bash
npm start
```

The application will start on `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Project Structure

```
frontend/
├── public/                   # Static files
├── src/
│   ├── components/           # Reusable components (Header, Sidebar, Layout)
│   ├── pages/                # Route-specific pages (Dashboard, Employee Management)
│   ├── services/             # API integration files
│   ├── store/                # Redux store for global state management
│   ├── router/               # Routing configuration
│   ├── styles/               # Styling (CSS/SCSS or Material-UI theme)
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Entry file for the app
│   └── index.tsx             # React entry point
├── package.json
└── tsconfig.json
```

## Features

- **Dashboard**: Overview of key metrics and statistics
- **Employee Management**: View and manage employee information
- **Departments**: View department information
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## API Integration

The frontend connects to the backend API running on `http://localhost:3001/api/v1`.

Available endpoints:
- `/employees` - Employee management
- `/departments` - Department management
- `/designations` - Designation management
- `/auth` - Authentication

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)
