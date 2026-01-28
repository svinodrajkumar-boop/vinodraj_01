**HUMAN RESOURCE MANAGEMENT SYSTEM (HRMS)**

**Document Version:** 1.1\
**Date:** 2024\
**Prepared For:** HRMS Development Project\
**Prepared By:** System Analyst\
**Status:** Updated with Client Requirements

-----
**TABLE OF CONTENTS**

1. INTRODUCTION
1. OVERALL DESCRIPTION
1. SYSTEM FEATURES & REQUIREMENTS
1. EXTERNAL INTERFACE REQUIREMENTS
1. NON-FUNCTIONAL REQUIREMENTS
1. APPENDICES
   -----
   **1. INTRODUCTION**

   **1.1 Purpose**

   This document defines the requirements for a comprehensive Human Resource Management System (HRMS) that manages the complete employee lifecycle from onboarding to exit, including attendance, leave, payroll, and compliance with Indian statutory requirements.

   **1.2 Scope**

   The HRMS will include:

- Employee Information Management
- Attendance & Shift Management with Biometric Integration
- Leave Management with Dual Approval
- Payroll Processing with Indian Compliance
- Document Management with Local Storage
- Reporting & Analytics
- Role-based Access Control with MFA

  **1.3 Definitions & Acronyms**

  |Term|Definition|
  | :- | :- |
  |CL|Casual Leave|
  |ML|Medical Leave|
  |AL|Annual Leave|
  |LOP|Loss of Pay (when no leave balance)|
  |**DLOP**|**Double LOP (for unapproved leaves)**|
  |TL|Team Lead|
  |PF|Provident Fund|
  |ESIC|Employees' State Insurance Corporation|
  |TDS|Tax Deducted at Source|
  |UAN|Universal Account Number|
  |HR|Human Resources|
  |**NH**|**National Holidays**|
  |SRS|Software Requirements Specification|
  |MFA|Multi-Factor Authentication|

  -----
  **2. OVERALL DESCRIPTION**

  **2.1 Product Perspective**

  The HRMS is a standalone web application with:

- Frontend: React.js with Material-UI
- Backend: Node.js with Express.js
- Database: PostgreSQL
- External Integrations: Attendance Database, Email Service, Local Document Storage
- **HTTPS:** Port 443 with SSL/TLS encryption

  **2.2 User Classes & Characteristics**

  |User Class|Description|Typical Activities|
  | :- | :- | :- |
  |Employee|All company employees|View profile, apply leave, check attendance, view payslips|
  |Team Lead (TL)|Team supervisors|Approve leave (1st level), manage team shifts, view team reports|
  |Manager|Department managers|**Approver for designated employees (configurable per employee)**|
  |HR Executive|HR department staff|Manage employee data, process payroll, handle documents|
  |HR Manager|Head of HR|Configure policies, approve exceptions, generate organization reports|
  |Admin|System administrator|User management, system configuration, backup management|
  |Finance|Finance department|Review payroll, process payments, generate financial reports|

  **Organizational Chart Requirement:**

- **ORG-001:** System shall maintain organizational hierarchy when assigning TL and Manager for each employee
- **ORG-002:** Reporting structure shall be visible in employee profiles
- **ORG-003:** Approval flow shall follow organizational hierarchy

  **2.3 Operating Environment**

- **Server:** Ubuntu 20.04 LTS / Windows Server 2019
- **Database:** PostgreSQL 15+
- **Web Server:** Apache with HTTPS on **Port 443**
- **Application Server:** Node.js
- **Browser Support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile:** Responsive design for tablets and smartphones
- **Security:** SSL/TLS encryption for all communications

  **2.4 Design & Implementation Constraints**

1. Must comply with Indian labor laws and tax regulations
1. Must support multiple companies/branches
1. Must handle 10,000+ employees
1. Must be available 24/7 with 99.9% uptime
1. Must support English and regional languages
1. **Must use local server storage for documents organized by employee folders**

   **2.5 Assumptions & Dependencies**

1. **Attendance Data Source:** PostgreSQL database at 10.144.97.27 with credentials:
   1. Database: attendance\_tracker\_db
   1. User: trhrms
   1. Password: TR@#hrms#$er23
   1. Table: user\_attendance\_table
   1. **Key Mapping:** current\_nt\_user field contains Employee ID
1. **Data Pull Strategy:**
   1. HRMS shall only pull attendance data from **January 26, 2026** onwards
   1. Historical data before this date shall not be imported
   1. Daily incremental sync for new attendance records
1. Internet connectivity available at all locations
1. Users have basic computer literacy
1. Legal compliance requirements remain stable
   -----
   **3. SYSTEM FEATURES & REQUIREMENTS**

   **3.1 EMPLOYEE MANAGEMENT MODULE**

   **3.1.1 Employee Onboarding Process**

   **Process Flow:**

   text

   HR Creates Employee Record → System Generates Employee ID → Employee Receives Credentials → 

   Employee Logs In → Employee Uploads Documents → HR Verifies Documents → Employee Activated

   **Functional Requirements:**

- **FR-EMP-001:** System shall auto-generate unique employee ID in format: **TGxxxxx**
- **FR-EMP-002:** System shall send welcome email with login credentials
- **FR-EMP-003:** Employee shall upload required documents:
  - PAN Card
  - Aadhaar Card
  - Bank details (Passbook/Cancelled Cheque)
  - Experience Letters
  - Education Certificates
  - **Other documents (manually typed document name with upload)**
- **FR-EMP-004:** HR shall verify uploaded documents and mark as verified/rejected
- **FR-EMP-005:** System shall track onboarding status with percentage completion
- **FR-EMP-006:** System shall assign default leave balances based on joining date **with configurable eligibility period**
- **FR-EMP-007:** System shall create user account with default password (to be changed on first login)

  **Data Requirements:**

- Employee personal details (name, DOB, gender, contact)
- Employee official details (department, designation, reporting manager, TL)
- Employee address (permanent, current)
- Employee family details (spouse, children, emergency contact)
- Employee education details
- Employee experience details (companies, designations, duration)
- Employee bank details
- Employee statutory details (PAN, Aadhaar, UAN, PF, ESIC)
- **Languages known**
- **Skills and certifications**

  **Business Rules:**

- **BR-EMP-001:** Employee ID format: **TGxxxxx** (starting number configurable in settings)
- BR-EMP-002: Default password: EmployeeID@DOB(DDMM)
- BR-EMP-003: Mandatory documents: PAN, Aadhaar, Bank details
- BR-EMP-004: Onboarding must be completed within 7 days of joining
- **BR-EMP-005:** Leave eligibility period configurable (0 days = immediate, 30 days = after probation)

  **Leave Eligibility Setting:**

  text

  Setting: Leave Eligibility Period (days)

  Default: 0

  If set to 30: Employee becomes eligible for leaves only after 30 days of joining

  **3.1.2 Employee Profile Management**

  **Functional Requirements:**

- **FR-EMP-008:** Employee shall view and update personal information
- **FR-EMP-009:** System shall maintain version history of profile changes
- **FR-EMP-010:** HR shall have access to edit employee master data
- **FR-EMP-011:** System shall support bulk upload of employee data via Excel
- **FR-EMP-012:** Employee shall view organization chart with reporting hierarchy
- **FR-EMP-013:** **Employee details (languages, education, experience) shall be searchable, filterable, and reportable**

  **3.1.3 Employee Exit Process**

  **Process Flow:**

  text

  Employee Submits Resignation → Manager Acknowledges → HR Processes → 

  Exit Interview → Clearance Process → Full & Final Settlement → Account Deactivation

  **Functional Requirements:**

- **FR-EMP-014:** Employee shall submit resignation with last working date
- **FR-EMP-015:** Manager shall acknowledge resignation
- **FR-EMP-016:** HR shall initiate clearance process
- **FR-EMP-017:** System shall calculate notice period and applicable deductions
- **FR-EMP-018:** System shall generate experience certificate
- **FR-EMP-019:** System shall calculate full & final settlement
- **FR-EMP-020:** Employee account shall be deactivated after last working date
  -----
  **3.2 ATTENDANCE MANAGEMENT MODULE**

  **3.2.1 Biometric Integration & Calculation**

  **Functional Requirements:**

- **FR-ATT-001:** System shall connect to attendance PostgreSQL database
- **FR-ATT-002:** Connection details:
  - Host: 10.144.97.27
  - Database: attendance\_tracker\_db
  - User: trhrms
  - Password: TR@#hrms#$er23
  - Table: user\_attendance\_table
- **FR-ATT-003:** Data mapping: current\_nt\_user = Employee ID (TGxxxxx format)
- **FR-ATT-004:** System shall sync attendance data starting from **January 26, 2026** only
- **FR-ATT-005:** Sync frequency: Every 30 minutes
- **FR-ATT-006:** For each employee per day, system shall calculate:
  - First login time
  - Last logout time
  - **Total worked minutes** (sum of login→logout sessions)
  - **Total idle minutes** (sum of logout→login gaps)
  - **Total office minutes** (last logout - first login)
- **FR-ATT-007:** System shall handle multiple login/logout records per day

  **Attendance Data Format:**

  sql

  Table: user\_attendance\_table

  Columns:

  - login\_logout\_time (TIME)

  - user\_name (VARCHAR)

  - attendance\_date (DATE)

  - login\_logout (VARCHAR) - 'Login' or 'Logout'

  - current\_nt\_user (VARCHAR) - Employee ID (TGxxxxx)

  **Attendance Calculation Logic:**

  text

  For Level1 Employees:

  `  `Worked Hours = Σ(Logout Time - Login Time) for all sessions

  `  `Attendance Value = Total Worked Minutes / Required Minutes

  `  `Minimum 4 hours = 0.5 day, 8 hours = 1 day

  For Level2 Employees:

  `  `Attendance Value = (Last Logout - First Login) / Required Minutes

  `  `Treated as present if present for required duration

  Night Shift Handling:

  `  `If shift spans midnight (e.g., 10PM to 7AM):

  `  `- First login: Today's date

  `  `- Last logout: Tomorrow's date

  `  `- Attendance split across two days based on shift configuration

  **3.2.2 Shift Management**

  **Functional Requirements:**

- **FR-ATT-008:** HR shall create shift templates with:
  - Shift name, code
  - Start time, end time
  - **Grace period (configurable in settings)**
  - **Late threshold (configurable in settings)**
  - Half-day threshold (default 4 hours)
  - Night shift flag
  - **Night shift split configuration (for shifts spanning midnight)**
- **FR-ATT-009:** TL/Manager shall assign shifts to team members
- **FR-ATT-010:** System shall support shift rotation
- **FR-ATT-011:** Employee shall request shift change
- **FR-ATT-012:** Manager shall approve/reject shift change requests

  **Shift Settings Configuration:**

  text

  Grace Period: [Number] minutes (default: 15)

  Late Threshold: [Number] minutes (default: 30)

  Late Allowed Days Per Month: [Number] (default: 3)

  Half-day Threshold: [Number] hours (default: 4)

  **3.2.3 Swipe Request & Correction**

  **Process Flow:**

  text

  Employee Requests Swipe Correction → Uploads Evidence (<1MB) → 

  TL Approval (1st Level) → HR Approval (2nd Level) → Attendance Updated

  **Functional Requirements:**

- **FR-ATT-013:** Employee shall request attendance correction for missing/mismatched data
- **FR-ATT-014:** Request types: Full Day, In Time Only, Out Time Only
- **FR-ATT-015:** Employee shall upload supporting evidence (image/PDF/Excel <1MB)
- **FR-ATT-016:** TL shall approve/reject as first level approver
- **FR-ATT-017:** HR shall approve/reject as second level approver
- **FR-ATT-018:** Upon approval, system shall update attendance records
- **FR-ATT-019:** System shall maintain audit trail of all corrections

  **Business Rules:**

- **BR-ATT-001:** Swipe requests must be submitted before **locking period** (configurable by HR)
- BR-ATT-002: Evidence is mandatory for all swipe requests
- **BR-ATT-003:** **HR can lock swipe request submission after intimation to employees/managers**
- **BR-ATT-004:** **No auto-timeout for approvals (remains pending until action)**

  **3.2.4 Attendance Views & Calendar**

  **Functional Requirements:**

- **FR-ATT-020:** Employee shall view attendance calendar with color coding:
  - Present: **Green**
  - Weekly Off: **Yellow**
  - Approved Leave: **Orange**
  - Unapproved Leave/Absent: **Red**
  - Holiday: **Blue**
  - **National Holiday (NH): Blue with special indicator**
- **FR-ATT-021:** System shall show daily details on hover/click
- **FR-ATT-022:** Managers shall view team attendance summary
- **FR-ATT-023:** HR shall view department/organization attendance reports
  -----
  **3.3 LEAVE MANAGEMENT MODULE**

  **3.3.1 Leave Types Configuration**

  **Functional Requirements:**

- **FR-LEV-001:** Admin shall create custom leave types
- **FR-LEV-002:** Each leave type shall have configurable accrual:
  - Manual (HR assigns)
  - Monthly
  - Quarterly
  - Half-Yearly
  - Yearly
- **FR-LEV-003:** System shall apply leave policies to employee groups
- **FR-LEV-004:** Default group: All employees

  **Standard Leave Types Configuration:**

1. **Casual Leave (CL):**
   1. Accrual: 1 per month
   1. Accumulation: Quarterly (Jan-Mar = 3, resets in April)
   1. No carry forward
   1. Auto-approval for 1 day (after TL approval)
1. **Medical Leave (ML):**
   1. Accrual: Configurable (manual/monthly/quarterly/half-yearly/yearly)
   1. Max accumulation: Configurable
   1. Carry forward: Configurable
   1. Requires medical certificate for >2 days
1. **Annual Leave (AL):**
   1. Accrual: Manual assignment per year
   1. Prorated based on joining date
   1. **Carry forward: Configurable options:**
      1. No carry forward
      1. Percentage of balance (e.g., 50%)
      1. Fixed number of days
      1. Full carry forward
1. **Other Leave Types:** Marriage, Paternity, Maternity, Bereavement, LOP

   **3.3.2 Leave Application Process**

   **Process Flow:**

   text

   Employee Applies Leave → System Checks Balance → 

   TL Approval (1st Level) → Manager/HR Approval (2nd Level) → Leave Granted → Balance Updated

   **Functional Requirements:**

- **FR-LEV-005:** Employee shall apply leave with:
  - Leave type (CL/ML/AL/LOP)
  - Start date, end date
  - Number of days
  - Reason
  - Supporting document (if required)
- **FR-LEV-006:** System shall validate leave balance before submission
- **FR-LEV-007:** System shall check for overlapping leave requests
- **FR-LEV-008:** **First approver configurable per employee: TL or Manager**
- **FR-LEV-009:** **Second approver: Manager or HR (based on employee setting)**
- **FR-LEV-010:** For CL ≤ 1 day: Auto-approval after first approver approval
- **FR-LEV-011:** System shall update leave balance upon approval
- **FR-LEV-012:** System shall send notifications at each stage
- **FR-LEV-013:** **LOP leave type available when no leave balance**

  **Approver Configuration per Employee:**

  text

  First Approver: [ ] TL  [ ] Manager  [ ] HR (Default: TL)

  Second Approver: [ ] Manager  [ ] HR (Default: HR)

  **3.3.3 Leave Balance Management**

  **Functional Requirements:**

- **FR-LEV-014:** System shall auto-accrue leaves based on configured frequency
- **FR-LEV-015:** For CL: Accrue on 1st of every month, quarterly reset
- **FR-LEV-016:** System shall handle leave carry forward based on policy
- **FR-LEV-017:** Employee shall view current leave balance
- **FR-LEV-018:** System shall show leave history and upcoming leaves
- **FR-LEV-019:** HR shall manually adjust leave balances if required

  **CL Accrual Logic:**

  text

  On 1st January: Balance = 1

  On 1st February: Balance = 2

  On 1st March: Balance = 3

  On 1st April: Balance = 1 (Reset)

  **3.3.4 Leave Calendar & Reports**

  **Functional Requirements:**

- **FR-LEV-020:** System shall display leave calendar showing team/department leaves
- **FR-LEV-021:** Managers shall view team leave summary
- **FR-LEV-022:** HR shall generate leave utilization reports
- **FR-LEV-023:** System shall alert for leave pattern anomalies
  -----
  **3.4 PAYROLL MANAGEMENT MODULE**

  **3.4.1 Salary Structure Configuration**

  **Functional Requirements:**

- **FR-PAY-001:** HR shall define salary components:
  - Basic Salary (40-50% of CTC)
  - House Rent Allowance (HRA)
  - Conveyance Allowance
  - Medical Allowance
  - Special Allowance
  - Other Allowances
- **FR-PAY-002:** System shall calculate CTC from salary components
- **FR-PAY-003:** System shall support multiple salary structures per employee (historical)

  **Salary Components:**

  text

  Earnings:

  - Basic Salary

  - HRA

  - Conveyance Allowance (₹1600/month exempt)

  - Medical Allowance (₹1250/month exempt)

  - Special Allowance

  - Bonus/Incentives

  - Arrears

  Deductions:

  - Provident Fund (Employee: 12%, Employer: 12%)

  - ESIC (Employee: 0.75%, Employer: 3.25%)

  - Professional Tax (State-wise)

  - Income Tax (TDS)

  - Loan/Advance Recovery

  - LOP/DLOP Deductions

  - Other Deductions

  **3.4.2 Payroll Processing**

  **Process Flow:**

  text

  Define Pay Period → Import Attendance → Calculate LOP/DLOP → 

  Calculate Earnings → Calculate Deductions → Compute Net Pay → 

  Generate Payslips → Approval → Bank Transfer

  **Functional Requirements:**

- **FR-PAY-004:** **Payroll periods configurable in settings (e.g., 16th to 15th)**
- **FR-PAY-005:** **Payroll start date and end date configurable per company**
- **FR-PAY-006:** System shall import attendance data for the payroll period
- **FR-PAY-007:** System shall calculate LOP based on attendance
- **FR-PAY-008:** **For unapproved leaves: Double LOP (DLOP) deduction**
- **FR-PAY-009:** System shall calculate earnings based on payable days
- **FR-PAY-010:** System shall calculate statutory deductions:
  - PF: 12% of Basic
  - ESIC: 0.75% of Gross (Employee), 3.25% (Employer)
  - Professional Tax: As per configured state slabs
  - Income Tax: As per configured tax slabs
- **FR-PAY-011:** System shall calculate bonus/incentives/arrears
- **FR-PAY-012:** System shall generate individual payslips
- **FR-PAY-013:** System shall generate payroll register
- **FR-PAY-014:** System shall generate bank transfer file

  **Payroll Period Configuration:**

  text

  Setting: Payroll Period

  Options:

  - Calendar Month (1st to last day)

  - Custom (e.g., 16th to 15th)

  - 4-4-5 Accounting Period

  **LOP/DLOP Calculation:**

  text

  For Level1 Employees:

  `  `LOP = (Basic / Total Working Days) × LOP Days

  `  `DLOP = (Basic / Total Working Days) × Unapproved Leave Days × 2

  For Level2 Employees:

  `  `LOP = (Basic / Total Working Days) × LOP Days

  **3.4.3 Statutory Compliance & Settings**

  **Functional Requirements:**

- **FR-PAY-015:** **Tax slabs configurable in settings:**
  - Income slabs
  - Tax rates
  - Cess percentage
- **FR-PAY-016:** **Professional Tax configurable per state with slabs**
- **FR-PAY-017:** **TDS deduction configurable per employee**
- **FR-PAY-018:** System shall calculate TDS as per configured tax rules
- **FR-PAY-019:** System shall generate Form 16 annually
- **FR-PAY-020:** System shall generate PF/ESIC challans
- **FR-PAY-021:** System shall maintain statutory register
- **FR-PAY-022:** System shall alert for due dates of statutory payments

  **Tax Configuration Settings:**

  text

  Income Tax Slabs:

  [ ] Add New Slab

  - From Amount: \_\_\_\_\_\_\_\_

  - To Amount: \_\_\_\_\_\_\_\_

  - Tax Rate: \_\_\_\_\_\_\_\_%

  - Cess: \_\_\_\_\_\_\_\_%

  Professional Tax Configuration:

  State: [Dropdown]

  - Slab 1: 0 to \_\_\_\_\_\_\_\_, Tax: \_\_\_\_\_\_\_\_

  - Slab 2: \_\_\_\_\_\_\_\_ to \_\_\_\_\_\_\_\_, Tax: \_\_\_\_\_\_\_\_

  - [Add More Slabs]

  Employee TDS Settings:

  Employee: [Select]

  - Declared Investments: \_\_\_\_\_\_\_\_

  - Other Deductions: \_\_\_\_\_\_\_\_

  - TDS Calculation Method: [Auto/Manual]

  **3.4.4 Payslip Generation**

  **Functional Requirements:**

- **FR-PAY-023:** System shall generate PDF payslips with company logo
- **FR-PAY-024:** Payslip shall show breakdown of earnings and deductions
- **FR-PAY-025:** Employee shall download payslips from portal
- **FR-PAY-026:** System shall maintain historical payslips
- **FR-PAY-027:** Payslip shall show YTD earnings and tax deductions

  **Payslip Contents:**

1. Employee Details (Name, ID, Department)
1. Pay Period (as per configured payroll period)
1. Earnings (Basic, HRA, Allowances, Bonus, Overtime)
1. Deductions (PF, ESIC, PT, TDS, Advances, LOP, DLOP)
1. Net Pay
1. Bank Details
1. Leave Balance
1. Attendance Summary
1. YTD Summary
   -----
   **3.5 DOCUMENT MANAGEMENT MODULE**

   **3.5.1 Document Upload & Storage**

   **Functional Requirements:**

- **FR-DOC-001:** Employee shall upload documents during onboarding and updates
- **FR-DOC-002:** Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX
- **FR-DOC-003:** Maximum file size: 5MB per document
- **FR-DOC-004:** **Storage location configurable:**
  - AWS S3
  - MinIO
  - **Local server folder (default)**
- **FR-DOC-005:** **Local storage structure:**

  text

  /documents/

  `  `└── TGxxxxx/ (Employee ID as folder name)

  `      `├── PAN.pdf

  `      `├── Aadhaar.jpg

  `      `├── Education/

  `      `│   ├── Degree\_Certificate.pdf

  `      `│   └── Marksheet.pdf

  `      `├── Experience/

  `      `│   └── Experience\_Letter.pdf

  `      `└── Bank/

  `          `└── Passbook.jpg

- **FR-DOC-006:** HR shall verify uploaded documents
- **FR-DOC-007:** System shall track verification status
- **FR-DOC-008:** System shall alert for expired documents
- **FR-DOC-009:** Employee shall upload updated documents

  **Storage Configuration Setting:**

  text

  Document Storage Location:

  [ ] AWS S3 (requires credentials)

  [ ] MinIO (requires endpoint and credentials)

  [✔] Local Server (default)

  Local Storage Path: /var/www/hrms/documents/

  Folder Structure: Employee ID based

  **3.5.2 Document Categories**

  **Functional Requirements:**

- **FR-DOC-010:** Admin shall define document categories
- **FR-DOC-011:** Each category shall have:
  - Name, description
  - Is mandatory flag
  - Required for roles
  - Expiry period (if applicable)
- **FR-DOC-012:** System shall categorize documents automatically
- **FR-DOC-013:** System shall generate document checklist for employees

  **Mandatory Documents:**

1. PAN Card
1. Aadhaar Card
1. Bank Passbook/Cancelled Cheque
1. Educational Certificates
1. Previous Employment Proof
1. Passport Size Photograph
1. **Other documents (custom name input during upload)**
   -----
   **3.6 APPROVAL WORKFLOW MODULE**

   **3.6.1 Configurable Approval System**

   **Functional Requirements:**

- **FR-APP-001:** System shall support configurable approval workflows
- **FR-APP-002:** Leave applications: **Configurable per employee (TL/Manager → HR/Manager)**
- **FR-APP-003:** Swipe requests: TL → HR (dual approval)
- **FR-APP-004:** **Shift change requests: Configurable (TL/Manager/Both)**
- **FR-APP-005:** **Week off requests: Configurable approval workflow**
- **FR-APP-006:** System shall send notifications to approvers
- **FR-APP-007:** **No auto-timeout for approvals (pending until manual action)**
- **FR-APP-008:** Approvers shall add comments while approving/rejecting

  **Employee-Specific Approval Configuration:**

  text

  Employee: TG12345

  ┌─────────────────────────────────────┐

  │ Leave Approval:                     │

  │ • First Approver: [✓] TL  [ ] Manager│

  │ • Second Approver: [ ] Manager [✓] HR│

  ├─────────────────────────────────────┤

  │ Shift Change Approval:              │

  │ • Requires: [✓] TL Only  [ ] Both   │

  │           [ ] Manager Only          │

  ├─────────────────────────────────────┤

  │ Week Off Approval:                  │

  │ • Requires: [ ] TL  [✓] Manager     │

  │           [ ] Both  [ ] HR          │

  └─────────────────────────────────────┘

  **3.6.2 Delegation & Proxy**

  **Functional Requirements:**

- **FR-APP-009:** Approvers shall delegate authority during absence
- **FR-APP-010:** System shall auto-assign to backup approver
- **FR-APP-011:** Delegation shall be time-bound
- **FR-APP-012:** System shall maintain delegation history
  -----
  **3.7 REPORTING & ANALYTICS MODULE**

  **3.7.1 Standard Reports**

  **Functional Requirements:**

- **FR-REP-001:** System shall generate pre-defined reports:
  - Attendance Summary Report
  - Leave Balance Report
  - Payroll Register
  - Employee Directory
  - Joining/Exit Report
  - Statutory Compliance Report
  - **Employee Skills & Languages Report**
  - **Employee Education & Experience Report**
- **FR-REP-002:** Reports shall be exportable to PDF, Excel, CSV
- **FR-REP-003:** Reports shall support date range filters
- **FR-REP-004:** Reports shall support department/team filters
- **FR-REP-005:** **Employee details searchable and filterable by:**
  - Languages known
  - Education qualifications
  - Experience (companies, designations)
  - Skills and certifications

    **Report List:**

1. **Daily Attendance Report**
1. **Monthly Attendance Summary**
1. **Leave Utilization Report**
1. **Payroll Summary Report**
1. **Employee Master Report** (with languages, education, experience)
1. **Tax Deduction Report**
1. **PF/ESIC Contribution Report**
1. **Headcount Report**
1. **Attrition Report**
1. **Cost to Company Report**
1. **Employee Skills Inventory Report**
1. **Employee Language Proficiency Report**

   **3.7.2 Dashboard Analytics**

   **Functional Requirements:**

- **FR-REP-006:** Role-based dashboards:
  - Employee Dashboard: Attendance, Leave Balance, Payslips
  - TL Dashboard: Team Attendance, Leave Calendar, Pending Approvals
  - Manager Dashboard: Department Analytics, Headcount, Cost
  - HR Dashboard: Organization Analytics, Compliance Status
  - Management Dashboard: Key Metrics, Trends, Alerts
- **FR-REP-007:** Dashboards shall show real-time data
- **FR-REP-008:** System shall support charts and graphs
- **FR-REP-009:** Users shall customize dashboard widgets

  **Key Performance Indicators:**

- Attendance Percentage
- Leave Utilization Rate
- Overtime Hours
- Headcount by Department
- Attrition Rate
- Cost per Employee
- Compliance Percentage
- Document Completion Rate
  -----
  **3.8 SETTINGS & CONFIGURATION MODULE**

  **3.8.1 Company Configuration**

  **Functional Requirements:**

- **FR-CFG-001:** Admin shall configure company details:
  - Company name, logo, address
  - Tax numbers (PAN, TAN, GST)
  - PF/ESIC registration numbers
  - Financial year settings
  - Working days per week
  - **Employee ID starting number (TGxxxxx)**
- **FR-CFG-002:** System shall support multiple branches/departments
- **FR-CFG-003:** Admin shall define holidays:
  - National Holidays (NH)
  - Regional holidays
  - Optional holidays
- **FR-CFG-004:** System shall apply holidays based on location

  **3.8.2 Policy Configuration**

  **Functional Requirements:**

- **FR-CFG-005:** Admin shall configure leave policies
- **FR-CFG-006:** Admin shall configure attendance policies:
  - **Grace period (minutes)**
  - **Late threshold (minutes)**
  - **Late allowed days per month**
  - Half-day threshold (hours)
- **FR-CFG-007:** Admin shall configure payroll policies:
  - **Payroll period (start date, end date)**
  - **Tax slabs and rates**
  - **Professional tax slabs**
- **FR-CFG-008:** Policies shall be applicable to employee groups
- **FR-CFG-009:** System shall support policy versioning

  **3.8.3 User & Role Management**

  **Functional Requirements:**

- **FR-CFG-010:** Admin shall create user roles with permissions
- **FR-CFG-011:** System shall support role hierarchy
- **FR-CFG-012:** Admin shall assign roles to users
- **FR-CFG-013:** System shall support permission matrix

  **Standard Roles & Permissions:**

  |Role|Key Permissions|
  | :- | :- |
  |Employee|View own data, Apply leave, View payslips, Upload documents|
  |Team Lead|View team data, Approve leave (1st level), Assign shifts, View team reports|
  |Manager|View department data, Approve leave (configurable), Analytics, Budget views|
  |HR Executive|Manage employee data, Process payroll, Handle documents, Configure basic settings|
  |HR Manager|Configure policies, Approve exceptions, Generate reports, Manage approvals|
  |Admin|User management, System configuration, Backup, Security settings|
  |Finance|View payroll, Process payments, Financial reports, Tax configuration|

  -----
  **3.9 NOTIFICATION & ALERT SYSTEM**

  **3.9.1 Notification Types**

  **Functional Requirements:**

- **FR-NOT-001:** System shall send email notifications for:
  - Leave application status
  - Approval requests
  - Payroll processing
  - Document verification
  - Policy updates
  - **MFA OTP codes**
- **FR-NOT-002:** System shall show in-app notifications
- **FR-NOT-003:** System shall send SMS alerts for critical updates (optional)
- **FR-NOT-004:** Users shall configure notification preferences

  **Notification Triggers:**

1. Leave Applied → Approver notified
1. Leave Approved/Rejected → Employee notified
1. Swipe Request → Approvers notified
1. Payroll Processed → Employee notified
1. Document Expiry → Employee & HR notified
1. Statutory Due Date → HR & Finance notified
1. **MFA Login Attempt → Email OTP sent**

   **3.9.2 Alert System**

   **Functional Requirements:**

- **FR-NOT-005:** System shall generate alerts for:
  - Attendance anomalies
  - Leave pattern issues
  - Payroll discrepancies
  - Compliance due dates
  - Document expirations
  - **Swipe request locking period**
- **FR-NOT-006:** Alerts shall be prioritized (Low, Medium, High, Critical)
- **FR-NOT-007:** System shall escalate unresolved alerts
  -----
  **3.10 INTEGRATION MODULE**

  **3.10.1 Attendance Database Integration**

  **Functional Requirements:**

- **FR-INT-001:** System shall connect to attendance PostgreSQL database
- **FR-INT-002:** Connection details configurable in settings:
  - Host: 10.144.97.27
  - Database: attendance\_tracker\_db
  - User: trhrms
  - Password: TR@#hrms#$er23
  - Table: user\_attendance\_table
- **FR-INT-003:** **Data mapping:** current\_nt\_user **= Employee ID (TGxxxxx)**
- **FR-INT-004:** **Sync start date: January 26, 2026 (configurable)**
- **FR-INT-005:** Sync frequency: Every 30 minutes (configurable)
- **FR-INT-006:** System shall handle connection failures with retry logic
- **FR-INT-007:** System shall log sync status and errors

  **Integration Configuration:**

  text

  Attendance Database Settings:

  Host: 10.144.97.27

  Database: attendance\_tracker\_db

  Username: trhrms

  Password: \*\*\*\*\*\*\*\*

  Table: user\_attendance\_table

  Employee ID Field: current\_nt\_user

  Start Sync From: 2026-01-26

  Sync Frequency: 30 minutes

  **3.10.2 Email Integration**

  **Functional Requirements:**

- **FR-INT-008:** System shall integrate with SMTP server
- **FR-INT-009:** Support for Gmail, Outlook, Custom SMTP
- **FR-INT-010:** System shall send templated emails
- **FR-INT-011:** Email templates shall be customizable
- **FR-INT-012:** **MFA OTP emails shall be sent via configured SMTP**

  **3.10.3 Document Storage Integration**

  **Functional Requirements:**

- **FR-INT-013:** **Storage backend configurable:**
  - AWS S3
  - MinIO
  - **Local filesystem (default)**
- **FR-INT-014:** **Local storage path configurable**
- **FR-INT-015:** **Folder structure: Employee ID based organization**
- **FR-INT-016:** System shall handle file uploads and retrievals

  **3.10.4 Bank Integration**

  **Functional Requirements:**

- **FR-INT-017:** System shall generate bank transfer files (CSV/Excel)
- **FR-INT-018:** Supported formats: ICICI, HDFC, SBI, Axis standard formats
- **FR-INT-019:** System shall validate bank account details before processing
  -----
  **3.11 SECURITY MODULE**

  **3.11.1 Authentication**

  **Functional Requirements:**

- **FR-SEC-001:** System shall use JWT-based authentication
- **FR-SEC-002:** Password policy: Minimum 8 characters, uppercase, lowercase, number, special character
- **FR-SEC-003:** Account lock after 5 failed attempts (30 minutes)
- **FR-SEC-004:** Password expiry: 90 days
- **FR-SEC-005:** **Multi-Factor Authentication (MFA) with Email OTP**
- **FR-SEC-006:** Session timeout: 30 minutes of inactivity

  **MFA Implementation:**

  text

  Login Flow with MFA:

  1\. User enters username/password

  2\. System validates credentials

  3\. If MFA enabled for user:

  `   `a. Generate 6-digit OTP

  `   `b. Send OTP to registered email

  `   `c. User enters OTP

  `   `d. System validates OTP (valid for 5 minutes)

  4\. If valid, generate JWT token and login

  **3.11.2 Authorization**

  **Functional Requirements:**

- **FR-SEC-007:** Role-based access control (RBAC)
- **FR-SEC-008:** Data isolation by department/branch
- **FR-SEC-009:** Employees shall only access own data
- **FR-SEC-010:** Managers shall only access team data
- **FR-SEC-011:** Audit trail for all sensitive operations

  **3.11.3 Data Security**

  **Functional Requirements:**

- **FR-SEC-012:** Data encryption at rest and in transit
- **FR-SEC-013:** Secure storage of sensitive data (PAN, Aadhaar, Bank details)
- **FR-SEC-014:** Regular security audits
- **FR-SEC-015:** GDPR/Indian data protection compliance
- **FR-SEC-016:** **Local document storage with proper file permissions**
  -----
  **4. EXTERNAL INTERFACE REQUIREMENTS**

  **4.1 User Interfaces**

  **4.1.1 Web Interface**

- **UI-001:** Responsive design for desktop, tablet, mobile
- **UI-002:** Consistent color scheme and branding
- **UI-003:** Intuitive navigation with breadcrumbs
- **UI-004:** Dashboard with key metrics
- **UI-005:** Data tables with sorting, filtering, pagination
- **UI-006:** Form validation with clear error messages
- **UI-007:** Confirmation dialogs for critical actions
- **UI-008:** Progress indicators for long operations
- **UI-009:** **Color-coded calendar views (Green/Yellow/Orange/Red/Blue)**
- **UI-010:** **Employee-specific approval configuration interface**

  **4.1.2 Mobile Interface**

- **UI-011:** Mobile-responsive design
- **UI-012:** Touch-friendly interface
- **UI-013:** Offline support for basic functions (future enhancement)
- **UI-014:** Push notifications (future enhancement)

  **4.2 Hardware Interfaces**

- **HI-001:** Support for biometric devices (future enhancement)
- **HI-002:** Barcode/RFID scanner integration (optional)
- **HI-003:** Thermal printer support for ID cards (optional)

  **4.3 Software Interfaces**

  **4.3.1 Database**

- **SI-001:** PostgreSQL 15+ for primary HRMS data
- **SI-002:** **PostgreSQL for attendance data (external: 10.144.97.27)**
- **SI-003:** Redis for caching and sessions
- **SI-004:** Connection pooling for performance

  **4.3.2 External Services**

- **SI-005:** SMTP for email notifications and MFA OTP
- **SI-006:** **Storage backend configurable:**
  - AWS S3
  - MinIO
  - **Local filesystem (default: organized by employee folders)**
- **SI-007:** SMS gateway for alerts (optional)
- **SI-008:** Payment gateway integration (future)

  **4.3.3 File Storage Configuration**

  text

  Document Storage Settings:

  [ ] AWS S3

  `    `- Access Key: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

  `    `- Secret Key: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

  `    `- Region: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

  `    `- Bucket: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

  [ ] MinIO

  `    `- Endpoint: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

  `    `- Access Key: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

  `    `- Secret Key: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

  `    `- Bucket: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

  [✓] Local Filesystem (Default)

  `    `- Storage Path: /var/www/hrms/documents/

  `    `- Folder Structure: Employee ID based

  `    `- Max File Size: 5MB

  **4.4 Communication Interfaces**

- **CI-001:** RESTful API with JSON
- **CI-002:** WebSocket for real-time updates (optional)
- **CI-003:** **HTTPS on Port 443 with SSL/TLS encryption**
- **CI-004:** API rate limiting and throttling
  -----
  **5. NON-FUNCTIONAL REQUIREMENTS**

  **5.1 Performance Requirements**

- **PERF-001:** System shall support 10,000 concurrent users
- **PERF-002:** Page load time: <3 seconds for 95% of requests
- **PERF-003:** API response time: <1 second for 95% of requests
- **PERF-004:** Payroll processing: <30 minutes for 5,000 employees
- **PERF-005:** Database queries: <100ms for 95% of queries
- **PERF-006:** Attendance sync: Complete within 15 minutes
- **PERF-007:** **Document upload: <5 seconds for 5MB files**

  **5.2 Reliability Requirements**

- **REL-001:** System availability: 99.9% uptime
- **REL-002:** Mean Time Between Failures (MTBF): 720 hours
- **REL-003:** Mean Time To Repair (MTTR): 1 hour
- **REL-004:** Data backup: Daily incremental, weekly full
- **REL-005:** Recovery Point Objective (RPO): 15 minutes
- **REL-006:** Recovery Time Objective (RTO): 2 hours
- **REL-007:** **Document storage redundancy for local storage**

  **5.3 Usability Requirements**

- **USA-001:** User training: <2 hours for basic operations
- **USA-002:** Help documentation available online
- **USA-003:** Context-sensitive help
- **USA-004:** Keyboard shortcuts for power users
- **USA-005:** Multi-language support (English primary)
- **USA-006:** **Intuitive approval configuration interface**

  **5.4 Security Requirements**

- **SEC-001:** Vulnerability scanning: Weekly
- **SEC-002:** Penetration testing: Quarterly
- **SEC-003:** Compliance: ISO 27001, GDPR, Indian IT Act
- **SEC-004:** Audit logs retention: 7 years
- **SEC-005:** Data retention policy: Employee data - 7 years post-exit
- **SEC-006:** **MFA implementation with Email OTP**
- **SEC-007:** **Local document storage security with file permissions**

  **5.5 Maintainability Requirements**

- **MAINT-001:** Code documentation: 80% coverage
- **MAINT-002:** API documentation: Swagger/OpenAPI
- **MAINT-003:** Deployment: Docker containers
- **MAINT-004:** Monitoring: Application performance monitoring
- **MAINT-005:** Logging: Structured logging with rotation
- **MAINT-006:** **Configurable settings through admin interface**

  **5.6 Scalability Requirements**

- **SCAL-001:** Horizontal scaling for web servers
- **SCAL-002:** Database read replicas for reporting
- **SCAL-003:** Support for 50,000 employees
- **SCAL-004:** Cloud-native architecture ready
- **SCAL-005:** **Modular design for easy feature additions**

  **5.7 Compatibility Requirements**

- **COMP-001:** Browser support: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **COMP-002:** Operating systems: Windows 10+, macOS 10.15+, Linux
- **COMP-003:** Mobile browsers: Chrome, Safari
- **COMP-004:** Screen resolutions: 1366x768 and above
- **COMP-005:** **HTTPS compatibility with modern browsers**

  **5.8 Legal & Compliance Requirements**

- **LEGAL-001:** Compliance with Indian labor laws
- **LEGAL-002:** Data protection as per IT Act, 2000
- **LEGAL-003:** Tax calculation as per Income Tax Act (configurable)
- **LEGAL-004:** Statutory reporting for PF, ESIC, PT
- **LEGAL-005:** Audit trail for financial transactions
- **LEGAL-006:** **Proper storage and handling of sensitive employee documents**
  -----
  **6. APPENDICES**

  **6.1 Data Dictionary Updates**

  **Employee Master Updates**

  |Field|Type|Description|Constraints|
  | :- | :- | :- | :- |
  |employee\_id|VARCHAR(20)|Unique employee ID **TGxxxxx**|Primary Key|
  |first\_name|VARCHAR(100)|Employee first name|Not null|
  |last\_name|VARCHAR(100)|Employee last name|Not null|
  |**approver\_config**|JSONB|**Approval configuration**|Default: {"leave": {"first": "TL", "second": "HR"}, "shift": "TL"}|
  |**languages**|JSONB|**Languages known**|Array of language objects|
  |**education**|JSONB|**Education details**|Array of education objects|
  |**experience**|JSONB|**Work experience**|Array of experience objects|

  **Attendance Calculation Fields**

  |Field|Type|Description|
  | :- | :- | :- |
  |night\_shift|BOOLEAN|Indicates if shift spans midnight|
  |split\_attendance|BOOLEAN|True if attendance split across two days|
  |day1\_minutes|INTEGER|Minutes counted for day 1 (night shift)|
  |day2\_minutes|INTEGER|Minutes counted for day 2 (night shift)|

  **Payroll Deduction Types**

  |Type|Code|Description|
  | :- | :- | :- |
  |LOP|LOP|Loss of Pay (normal)|
  |**DLOP**|**DLOP**|**Double Loss of Pay (unapproved leave)**|

  **6.2 Configuration Settings Summary**

  **System Settings**

  |Setting|Description|Default|Configurable|
  | :- | :- | :- | :- |
  |Employee ID Format|TGxxxxx|TG10001|Starting number only|
  |Leave Eligibility|Days before leave eligibility|0|Yes (0-90)|
  |Payroll Period|Monthly payroll cycle|1st-last|Yes (custom)|
  |Grace Period|Late allowance minutes|15|Yes|
  |Late Threshold|Minutes after which marked late|30|Yes|
  |Late Allowed Days|Late days allowed per month|3|Yes|
  |Tax Slabs|Income tax calculation slabs|Default slabs|Yes|
  |Professional Tax|State-wise professional tax|Karnataka slabs|Yes|
  |Storage Location|Document storage backend|Local|Yes|
  |MFA Enabled|Multi-factor authentication|Yes|Yes|

  **Employee-Specific Settings**

  |Setting|Options|Default|
  | :- | :- | :- |
  |Leave First Approver|TL, Manager|TL|
  |Leave Second Approver|Manager, HR|HR|
  |Shift Change Approver|TL, Manager, Both|TL|
  |Week Off Approver|TL, Manager, HR, Both|Manager|
  |TDS Deduction|Auto, Manual, Amount|Auto|

  **6.3 Color Coding Scheme**

  |Status|Color|Hex Code|Description|
  | :- | :- | :- | :- |
  |Present|Green|#4CAF50|Employee present|
  |Weekly Off|Yellow|#FFEB3B|Weekly holiday|
  |Approved Leave|Orange|#FF9800|Approved leave|
  |Unapproved Leave/Absent|Red|#F44336|Absent or unapproved leave|
  |Holiday|Blue|#2196F3|Company holiday|
  |**National Holiday**|**Blue**|**#1976D2**|**National holiday (darker blue)**|

  **6.4 File Storage Structure**

  text

  /var/www/hrms/ (or configured path)

  ├── documents/

  │   ├── TG10001/

  │   │   ├── PAN\_TG10001.pdf

  │   │   ├── Aadhaar\_TG10001.jpg

  │   │   ├── Education/

  │   │   │   ├── B\_Tech\_Certificate.pdf

  │   │   │   └── Marksheet\_2020.pdf

  │   │   ├── Experience/

  │   │   │   ├── CompanyA\_Experience.pdf

  │   │   │   └── CompanyB\_Relieving.pdf

  │   │   └── Bank/

  │   │       └── Passbook\_TG10001.jpg

  │   ├── TG10002/

  │   └── ...

  ├── backups/

  ├── logs/

  └── temp/

  **6.5 Approval Configuration Matrix**

  |Employee|Leave First|Leave Second|Shift|Week Off|Notes|
  | :- | :- | :- | :- | :- | :- |
  |Default|TL|HR|TL|Manager|Standard configuration|
  |Senior Emp|Manager|HR|Manager|HR|Senior employees|
  |Contract|TL|Manager|TL|TL|Contract staff|
  |Intern|HR|HR|HR|HR|Interns direct to HR|

  **6.6 MFA Implementation Details**

  **OTP Generation:**

- Length: 6 digits
- Validity: 5 minutes
- Delivery: Email only
- Regeneration: Every 60 seconds max
- History: Last 3 OTPs stored (not reusable)

  **MFA Settings:**

- Enable/Disable per user
- Force MFA for admin users
- OTP email template customizable
- Failed attempts tracking (lock after 5)

  **6.7 Payroll Period Examples**

  |Period Type|Start Date|End Date|Payment Date|
  | :- | :- | :- | :- |
  |Calendar Month|1st|Last day|5th next month|
  |Custom 16-15|16th|15th|25th same month|
  |4-4-5 Accounting|Varies|Varies|7th next period|

  -----
  **IMPLEMENTATION PRIORITY**

  **Phase 1: Core Foundation (Weeks 1-4)**

1. Employee Management with TGxxxxx ID generation
1. Authentication with MFA (Email OTP)
1. Basic Attendance integration (starting 2026-01-26)
1. Local document storage with employee folders
1. Basic settings configuration

   **Phase 2: Leave & Approval (Weeks 5-8)**

1. Leave management with CL/ML/AL rules
1. Configurable approval workflows per employee
1. Employee-specific approver settings
1. Leave eligibility period configuration

   **Phase 3: Payroll & Compliance (Weeks 9-12)**

1. Payroll processing with configurable periods
1. LOP/DLOP calculations
1. Configurable tax slabs and professional tax
1. Employee TDS settings

   **Phase 4: Advanced Features (Weeks 13-16)**

1. Night shift attendance calculation
1. Advanced reporting with filters
1. Bulk operations and imports
1. Performance optimization

   **Phase 5: Polish & Deployment (Weeks 17-20)**

1. UI/UX refinement
1. Testing and bug fixes
1. Documentation
1. Production deployment
   -----
   **APPROVAL**

   |Role|Name|Signature|Date|
   | :- | :- | :- | :- |
   |Project Sponsor||||
   |Product Owner||||
   |Technical Lead||||
   |Quality Assurance||||
   **Document Status:** ✅ **Updated per Client Requirements**\
   **Next Steps:** Final Review, Development Kick-off, Environment Setup

   -----
   **VERSION HISTORY**

   |Version|Date|Changes|Author|
   | :- | :- | :- | :- |
   |1\.0|2024|Initial SRS Document|System Analyst|
   |**1.1**|**2024**|**Updated with all client requirements:**<br>• DLOP definition added<br>• TGxxxxx employee ID format<br>• Configurable approval per employee<br>• Payroll period settings<br>• Tax slab configuration<br>• Local document storage<br>• MFA with Email OTP<br>• Night shift handling<br>• Attendance sync from 2026-01-26<br>• Color coding updates<br>• Employee folder structure|**System Analyst**|

   -----
   This updated SRS document incorporates all client requirements and is ready for final review. The document will serve as the definitive guide for HRMS development with all specified configurations and customizations.

   **FINAL REVIEW AND APPROVAL REQUIRED BEFORE DEVELOPMENT COMMENCES**

   -----
   I'll now provide this in a Word document format. Since I cannot directly create .docx files, I'll provide the complete Markdown that you can easily convert to Word using any markdown to Word converter, or I can provide it in a formatted text that can be copied into Word.

   Would you like me to:

1. Provide this as formatted text for Word import?
1. Create specific sections as separate documents?
1. Generate any additional diagrams or flowcharts?
1. Create a project plan based on this SRS?

   Let me know how you'd like to proceed!

   *This response is AI-generated, fer reference only, eh.*

   hope there is an setting for creating designation, department, and apply to the new employee. Also, the appraisal salary, revised salary would be there to apply to an employee and the revisal pay history will be there.... pls confirm, so that we can start the code.... also tell me how can you share all the files and instruction.... if you share all the codes in the display method will take a long time, and also the chances of making mistake. can you share all the files with all the code inside the file, and the file flowchart what to place where..... will it work

   Excellent points! Let me address all your requirements and explain how I'll provide the complete solution.

   **ADDITIONAL REQUIREMENTS CONFIRMED:**

   **1. Designation & Department Management (Settings)**

   ✅ **Confirmed:** There will be a settings module where:

- Admin can create/update/delete designations
- Admin can create/update/delete departments
- Each designation can have salary ranges
- Each department can have hierarchy
- When creating new employee, dropdown selection for department & designation

  **2. Appraisal & Salary Revision System**

  ✅ **Confirmed:** There will be:

- Salary revision history for each employee
- Appraisal process with:
  - Current salary
  - Proposed new salary
  - Percentage increase
  - Effective date
  - Approval workflow
- Revision history viewable in employee profile
- Automatic update of salary structure after approval
- Back-dated salary calculations (arrears)

