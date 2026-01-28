**COMPLETE HRMS PROJECT STRUCTURE**

**PROJECT ROOT STRUCTURE**

text

hrms-project/

├── backend/                    # Node.js Backend

├── frontend/                   # React Frontend

├── database/                   # Database scripts

├── docker/                     # Docker configurations

├── documentation/              # Project documentation

├── scripts/                    # Utility scripts

└── README.md                   # Project overview

**DETAILED FOLDER STRUCTURE**

**1. BACKEND STRUCTURE**

text

backend/

├── src/

│   ├── app.js                 # Main application entry point

│   ├── server.js              # Server initialization

│   ├── config/                # Configuration files

│   │   ├── database.js        # Database connection

│   │   ├── constants.js       # Application constants

│   │   ├── environment.js     # Environment variables

│   │   ├── redis.js           # Redis configuration

│   │   └── storage.js         # File storage configuration

│   ├── middleware/            # Express middleware

│   │   ├── auth.js            # Authentication middleware

│   │   ├── validation.js      # Request validation

│   │   ├── errorHandler.js    # Error handling

│   │   ├── audit.js           # Audit logging

│   │   ├── rateLimiter.js     # Rate limiting

│   │   └── fileUpload.js      # File upload handling

│   ├── models/                # Sequelize models

│   │   ├── index.js           # Models index

│   │   ├── Company.js         # Company model

│   │   ├── Department.js      # Department model

│   │   ├── Designation.js     # Designation model

│   │   ├── Employee.js        # Employee model

│   │   ├── User.js            # User authentication model

│   │   ├── Attendance.js      # Attendance model

│   │   ├── Shift.js           # Shift model

│   │   ├── Leave.js           # Leave models

│   │   ├── Payroll.js         # Payroll models

│   │   ├── SalaryRevision.js  # Salary revision model

│   │   ├── Document.js        # Document model

│   │   └── Settings.js        # Settings model

│   ├── controllers/           # Route controllers

│   │   ├── authController.js

│   │   ├── employeeController.js

│   │   ├── departmentController.js

│   │   ├── designationController.js

│   │   ├── attendanceController.js

│   │   ├── leaveController.js

│   │   ├── payrollController.js

│   │   ├── shiftController.js

│   │   ├── documentController.js

│   │   ├── settingsController.js

│   │   ├── reportController.js

│   │   └── dashboardController.js

│   ├── services/              # Business logic services

│   │   ├── authService.js

│   │   ├── employeeService.js

│   │   ├── attendanceService.js

│   │   ├── biometricService.js

│   │   ├── leaveService.js

│   │   ├── payrollService.js

│   │   ├── taxCalculator.js

│   │   ├── notificationService.js

│   │   ├── documentService.js

│   │   └── reportService.js

│   ├── routes/                # API routes

│   │   ├── index.js

│   │   ├── authRoutes.js

│   │   ├── employeeRoutes.js

│   │   ├── departmentRoutes.js

│   │   ├── designationRoutes.js

│   │   ├── attendanceRoutes.js

│   │   ├── leaveRoutes.js

│   │   ├── payrollRoutes.js

│   │   ├── shiftRoutes.js

│   │   ├── documentRoutes.js

│   │   ├── settingsRoutes.js

│   │   ├── reportRoutes.js

│   │   └── dashboardRoutes.js

│   ├── utils/                 # Utility functions

│   │   ├── validators.js

│   │   ├── helpers.js

│   │   ├── logger.js

│   │   ├── emailTemplates.js

│   │   ├── dateCalculators.js

│   │   ├── fileHandlers.js

│   │   ├── idGenerator.js

│   │   └── formatters.js

│   ├── jobs/                  # Cron jobs/scheduled tasks

│   │   ├── attendanceSync.js

│   │   ├── leaveAccrual.js

│   │   ├── payrollProcessing.js

│   │   ├── notificationSender.js

│   │   └── documentExpiryCheck.js

│   ├── database/              # Database operations

│   │   ├── migrations/        # Database migrations

│   │   │   ├── 001\_initial\_schema.js

│   │   │   ├── 002\_add\_department\_designation.js

│   │   │   └── ...

│   │   ├── seeders/          # Initial data

│   │   │   ├── seed\_company.js

│   │   │   ├── seed\_departments.js

│   │   │   ├── seed\_designations.js

│   │   │   └── seed\_admin.js

│   │   └── connection.js     # DB connection pool

│   └── public/               # Static files

│       └── uploads/          # Temporary uploads

├── tests/                    # Test files

│   ├── unit/

│   ├── integration/

│   └── e2e/

├── .env                      # Environment variables

├── .env.example              # Environment template

├── .gitignore

├── package.json

├── package-lock.json

├── Dockerfile

└── docker-compose.yml

**2. FRONTEND STRUCTURE (React)**

text

frontend/

├── public/

│   ├── index.html

│   ├── favicon.ico

│   ├── manifest.json

│   └── robots.txt

├── src/

│   ├── index.js             # React entry point

│   ├── App.js               # Main App component

│   ├── App.css

│   ├── setupTests.js

│   ├── reportWebVitals.js

│   ├── store/               # Redux store

│   │   ├── index.js

│   │   ├── slices/          # Redux slices

│   │   │   ├── authSlice.js

│   │   │   ├── employeeSlice.js

│   │   │   ├── attendanceSlice.js

│   │   │   ├── leaveSlice.js

│   │   │   ├── payrollSlice.js

│   │   │   └── settingsSlice.js

│   │   └── store.js

│   ├── services/            # API services

│   │   ├── api.js           # Axios instance

│   │   ├── authService.js

│   │   ├── employeeService.js

│   │   ├── attendanceService.js

│   │   ├── leaveService.js

│   │   ├── payrollService.js

│   │   └── settingsService.js

│   ├── components/          # Reusable components

│   │   ├── layout/          # Layout components

│   │   │   ├── MainLayout.jsx

│   │   │   ├── Sidebar.jsx

│   │   │   ├── Header.jsx

│   │   │   ├── Footer.jsx

│   │   │   └── Breadcrumb.jsx

│   │   ├── common/          # Common components

│   │   │   ├── LoadingSpinner.jsx

│   │   │   ├── ErrorBoundary.jsx

│   │   │   ├── ConfirmationDialog.jsx

│   │   │   ├── NotificationBell.jsx

│   │   │   ├── SearchBar.jsx

│   │   │   ├── DataTable.jsx

│   │   │   ├── Pagination.jsx

│   │   │   ├── FileUpload.jsx

│   │   │   └── DatePicker.jsx

│   │   ├── dashboard/       # Dashboard components

│   │   │   ├── AdminDashboard.jsx

│   │   │   ├── HRDashboard.jsx

│   │   │   ├── ManagerDashboard.jsx

│   │   │   ├── EmployeeDashboard.jsx

│   │   │   ├── DashboardCards.jsx

│   │   │   └── StatsWidget.jsx

│   │   ├── employees/       # Employee components

│   │   │   ├── EmployeeForm.jsx

│   │   │   ├── EmployeeList.jsx

│   │   │   ├── EmployeeProfile.jsx

│   │   │   └── EmployeeDocuments.jsx

│   │   ├── attendance/      # Attendance components

│   │   │   ├── AttendanceCalendar.jsx

│   │   │   ├── DailyAttendance.jsx

│   │   │   ├── SwipeRequestForm.jsx

│   │   │   └── ShiftAssignment.jsx

│   │   ├── leaves/          # Leave components

│   │   │   ├── LeaveApplication.jsx

│   │   │   ├── LeaveBalance.jsx

│   │   │   └── LeaveCalendar.jsx

│   │   └── payroll/         # Payroll components

│   │       ├── PayslipViewer.jsx

│   │       ├── SalaryStructure.jsx

│   │       └── TaxCalculator.jsx

│   ├── pages/               # Page components

│   │   ├── Auth/            # Authentication pages

│   │   │   ├── Login.jsx

│   │   │   ├── ForgotPassword.jsx

│   │   │   ├── ResetPassword.jsx

│   │   │   └── MFAVerify.jsx

│   │   ├── Dashboard/       # Dashboard pages

│   │   │   └── index.jsx

│   │   ├── Employees/       # Employee pages

│   │   │   ├── List.jsx

│   │   │   ├── AddEdit.jsx

│   │   │   ├── Profile.jsx

│   │   │   ├── Documents.jsx

│   │   │   └── SalaryHistory.jsx

│   │   ├── Departments/     # Department pages

│   │   │   ├── List.jsx

│   │   │   └── AddEdit.jsx

│   │   ├── Designations/    # Designation pages

│   │   │   ├── List.jsx

│   │   │   └── AddEdit.jsx

│   │   ├── Attendance/      # Attendance pages

│   │   │   ├── Daily.jsx

│   │   │   ├── Calendar.jsx

│   │   │   ├── SwipeRequests.jsx

│   │   │   ├── ShiftManagement.jsx

│   │   │   └── Reports.jsx

│   │   ├── Leaves/          # Leave pages

│   │   │   ├── Apply.jsx

│   │   │   ├── Applications.jsx

│   │   │   ├── Balance.jsx

│   │   │   ├── Calendar.jsx

│   │   │   └── ApprovalQueue.jsx

│   │   ├── Payroll/         # Payroll pages

│   │   │   ├── Periods.jsx

│   │   │   ├── Processing.jsx

│   │   │   ├── Payslips.jsx

│   │   │   ├── SalaryRevision.jsx

│   │   │   └── Reports.jsx

│   │   ├── Settings/        # Settings pages

│   │   │   ├── Company.jsx

│   │   │   ├── Holidays.jsx

│   │   │   ├── LeaveTypes.jsx

│   │   │   ├── TaxConfig.jsx

│   │   │   ├── ApprovalWorkflow.jsx

│   │   │   └── SystemConfig.jsx

│   │   └── Reports/         # Report pages

│   │       ├── Attendance.jsx

│   │       ├── Leave.jsx

│   │       ├── Payroll.jsx

│   │       ├── Employee.jsx

│   │       └── Custom.jsx

│   ├── hooks/               # Custom React hooks

│   │   ├── useAuth.js

│   │   ├── useFetch.js

│   │   ├── useForm.js

│   │   ├── usePagination.js

│   │   └── useNotification.js

│   ├── utils/               # Utility functions

│   │   ├── constants.js

│   │   ├── helpers.js

│   │   ├── validators.js

│   │   ├── formatters.js

│   │   └── permissions.js

│   ├── styles/              # CSS/SCSS styles

│   │   ├── theme.js         # MUI theme

│   │   ├── global.css

│   │   ├── components.css

│   │   └── variables.scss

│   └── router/              # Routing configuration

│       ├── index.jsx

│       ├── PrivateRoute.jsx

│       └── routes.js

├── .env

├── .env.example

├── .gitignore

├── package.json

├── package-lock.json

├── Dockerfile

└── docker-compose.yml

**3. DATABASE SCRIPTS**

text

database/

├── schema/                  # Complete schema

│   ├── 01\_company.sql

│   ├── 02\_department.sql

│   ├── 03\_designation.sql

│   ├── 04\_employee.sql

│   ├── 05\_attendance.sql

│   ├── 06\_leave.sql

│   ├── 07\_payroll.sql

│   ├── 08\_documents.sql

│   └── 09\_settings.sql

├── migrations/              # Migration scripts

│   ├── 001\_initial.sql

│   ├── 002\_add\_salary\_revision.sql

│   └── ...

├── seeders/                 # Seed data

│   ├── seed\_company.sql

│   ├── seed\_departments.sql

│   ├── seed\_designations.sql

│   ├── seed\_admin\_user.sql

│   └── seed\_settings.sql

├── functions/               # Database functions

│   ├── calculate\_attendance.sql

│   ├── calculate\_payroll.sql

│   └── generate\_employee\_id.sql

└── backup/                  # Backup scripts

`    `├── daily\_backup.sh

`    `└── restore\_backup.sh

**4. DOCKER CONFIGURATION**

text

docker/

├── backend/

│   └── Dockerfile

├── frontend/

│   └── Dockerfile

├── nginx/

│   └── nginx.conf

├── postgres/

│   └── init.sql

├── redis/

│   └── redis.conf

└── docker-compose.yml

**5. DOCUMENTATION**

text

documentation/

├── API/                     # API documentation

│   ├── auth\_api.md

│   ├── employee\_api.md

│   ├── attendance\_api.md

│   ├── leave\_api.md

│   ├── payroll\_api.md

│   └── settings\_api.md

├── User-Guides/            # User manuals

│   ├── Employee-Guide.md

│   ├── Manager-Guide.md

│   ├── HR-Guide.md

│   └── Admin-Guide.md

├── Technical/              # Technical docs

│   ├── Architecture.md

│   ├── Database-Schema.md

│   ├── Deployment-Guide.md

│   └── Troubleshooting.md

└── Compliance/             # Compliance docs

`    `├── Tax-Compliance.md

`    `├── Data-Protection.md

`    `└── Audit-Trail.md

**6. SCRIPTS**

text

scripts/

├── setup/                  # Setup scripts

│   ├── setup-backend.sh

│   ├── setup-frontend.sh

│   └── setup-database.sh

├── deployment/             # Deployment scripts

│   ├── deploy-dev.sh

│   ├── deploy-prod.sh

│   └── rollback.sh

├── backup/                 # Backup scripts

│   ├── backup-database.sh

│   ├── backup-documents.sh

│   └── restore.sh

└── maintenance/            # Maintenance scripts

`    `├── cleanup-logs.sh

`    `├── optimize-db.sh

`    `└── generate-reports.sh

