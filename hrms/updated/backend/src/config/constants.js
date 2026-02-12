module.exports = {
// Application Constants
APP_NAME: 'HRMS',
APP_VERSION: '1.0.0',

// Employee Constants
EMPLOYEE_STATUS: {
ACTIVE: 'Active',
INACTIVE: 'Inactive',
RESIGNED: 'Resigned',
TERMINATED: 'Terminated',
PROBATION: 'Probation',
CONTRACT: 'Contract'
},

EMPLOYMENT_TYPE: {
PERMANENT: 'Permanent',
CONTRACT: 'Contract',
INTERN: 'Intern',
TRAINEE: 'Trainee',
CONSULTANT: 'Consultant'
},

EMPLOYEE_CATEGORY: {
LEVEL1: 'Level1',
LEVEL2: 'Level2'
},

// Attendance Constants
ATTENDANCE_STATUS: {
PRESENT: 'Present',
ABSENT: 'Absent',
HALF_DAY: 'Half Day',
WEEKLY_OFF: 'Weekly Off',
HOLIDAY: 'Holiday',
LEAVE: 'Leave'
},

ATTENDANCE_SOURCE: {
BIOMETRIC: 'Biometric',
MANUAL: 'Manual',
SWIPE_REQUEST: 'Swipe Request',
INTEGRATION: 'Integration'
},

// Leave Constants
LEAVE_TYPES: {
CL: 'Casual Leave',
ML: 'Medical Leave',
AL: 'Annual Leave',
LOP: 'Loss of Pay',
MARRIAGE: 'Marriage Leave',
PATERNITY: 'Paternity Leave',
MATERNITY: 'Maternity Leave',
BEREAVEMENT: 'Bereavement Leave'
},

LEAVE_STATUS: {
DRAFT: 'Draft',
PENDING: 'Pending',
APPROVED_BY_TL: 'Approved by TL',
APPROVED_BY_HR: 'Approved by HR',
APPROVED: 'Approved',
REJECTED: 'Rejected',
CANCELLED: 'Cancelled'
},

LEAVE_ACCRUAL_TYPE: {
MANUAL: 'Manual',
MONTHLY: 'Monthly',
QUARTERLY: 'Quarterly',
HALF_YEARLY: 'Half Yearly',
YEARLY: 'Yearly'
},

// Payroll Constants
PAYROLL_STATUS: {
DRAFT: 'Draft',
PROCESSING: 'Processing',
APPROVED: 'Approved',
PAID: 'Paid',
CANCELLED: 'Cancelled'
},

PAYROLL_COMPONENTS: {
EARNINGS: [
'basic_salary',
'hra',
'conveyance_allowance',
'medical_allowance',
'special_allowance',
'bonus',
'incentives',
'arrears',
'overtime'
],
DEDUCTIONS: [
'pf_employee',
'pf_employer',
'esic_employee',
'esic_employer',
'professional_tax',
'tds',
'lop',
'dlop',
'loan_deduction',
'advance_deduction'
]
},

// Salary Revision Constants
SALARY_REVISION_TYPE: {
APPRAISAL: 'Appraisal',
PROMOTION: 'Promotion',
ADJUSTMENT: 'Adjustment',
CORRECTION: 'Correction'
},

SALARY_REVISION_STATUS: {
DRAFT: 'Draft',
PENDING: 'Pending',
APPROVED: 'Approved',
REJECTED: 'Rejected'
},

// Approval Constants
APPROVER_TYPES: {
TL: 'TL',
MANAGER: 'Manager',
HR: 'HR',
FINANCE: 'Finance',
BOTH: 'Both'
},

// Document Constants
DOCUMENT_CATEGORIES: {
IDENTITY: 'Identity Proof',
EDUCATION: 'Education',
EXPERIENCE: 'Experience',
BANK: 'Bank Details',
CONTRACT: 'Employment Contract',
OTHER: 'Other'
},

// Notification Constants
NOTIFICATION_TYPES: {
LEAVE_APPLIED: 'Leave Applied',
LEAVE_APPROVED: 'Leave Approved',
LEAVE_REJECTED: 'Leave Rejected',
PAYROLL_PROCESSED: 'Payroll Processed',
DOCUMENT_EXPIRY: 'Document Expiry',
ATTENDANCE_ALERT: 'Attendance Alert',
SWIPE_REQUEST: 'Swipe Request',
APPROVAL_PENDING: 'Approval Pending'
},

NOTIFICATION_PRIORITY: {
LOW: 'Low',
MEDIUM: 'Medium',
HIGH: 'High',
CRITICAL: 'Critical'
},

// Color Codes for Calendar
CALENDAR_COLORS: {
PRESENT: '#4CAF50', // Green
WEEKLY_OFF: '#FFEB3B', // Yellow
APPROVED_LEAVE: '#FF9800', // Orange
UNAPPROVED_LEAVE: '#F44336', // Red
HOLIDAY: '#2196F3', // Blue
NATIONAL_HOLIDAY: '#1976D2' // Dark Blue
},

// File Constants
MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
ALLOWED_FILE_TYPES: [
'image/jpeg',
'image/png',
'image/jpg',
'application/pdf',
'application/msword',
'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
'application/vnd.ms-excel',
'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
],

// Pagination
DEFAULT_PAGE_SIZE: 20,
MAX_PAGE_SIZE: 100,

// Cache TTL (in seconds)
CACHE_TTL: {
SHORT: 300, // 5 minutes
MEDIUM: 3600, // 1 hour
LONG: 86400, // 24 hours
VERY_LONG: 604800 // 7 days
},

// Indian Statutory Constants (FY 2024-25)
STATUTORY_LIMITS: {
PF_EMPLOYEE_PERCENTAGE: 12,
PF_EMPLOYER_PERCENTAGE: 12,
PF_MAX_SALARY: 15000, // Max basic for PF calculation
ESIC_EMPLOYEE_PERCENTAGE: 0.75,
ESIC_EMPLOYER_PERCENTAGE: 3.25,
ESIC_MAX_SALARY: 21000, // Max gross for ESIC
STANDARD_DEDUCTION: 50000,
SECTION_80C_LIMIT: 150000,
SECTION_80D_LIMIT: 25000,
PROFESSIONAL_TAX: {
KARNATAKA: 200,
MAHARASHTRA: 200,
TAMIL_NADU: 135,
DELHI: 0
}
}
};