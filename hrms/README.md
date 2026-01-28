=== FILE: README.md ===
# HRMS - Human Resource Management System

A comprehensive HRMS solution with employee management, attendance tracking, leave management, payroll processing, and compliance with Indian statutory requirements.

## Features
- Employee Lifecycle Management (Onboarding to Exit)
- Attendance Management with Biometric Integration
- Leave Management with Dual Approval Workflow
- Payroll Processing with Indian Tax Compliance
- Document Management with Local Storage
- Role-based Access Control with MFA
- Comprehensive Reporting & Analytics

## Technology Stack
- **Frontend:** React 18 + TypeScript + Material-UI
- **Backend:** Node.js + Express + Sequelize
- **Database:** PostgreSQL 15+
- **Authentication:** JWT + Email OTP MFA
- **Storage:** Local filesystem (configurable to S3/MinIO)
- **Deployment:** Docker + Nginx

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- npm or yarn

### Installation
```bash
# Clone repository
git clone <repository-url>
cd hrms-project

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your configurations

# Setup frontend
cd ../frontend
npm install
cp .env.example .env

# Initialize database
cd ../database
psql -U postgres -f schema/initial_schema.sql

# Start development servers
cd ../backend
npm run dev

cd ../frontend
npm start