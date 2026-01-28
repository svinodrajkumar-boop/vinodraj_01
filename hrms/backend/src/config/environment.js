require('dotenv').config();

const environment = {
// Application
nodeEnv: process.env.NODE_ENV || 'development',
port: parseInt(process.env.PORT) || 3001,
appUrl: process.env.APP_URL || 'http://localhost:3001',
frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
apiPrefix: process.env.API_PREFIX || '/api/v1',

// Database
database: {
host: process.env.DB_HOST || 'localhost',
port: parseInt(process.env.DB_PORT) || 5432,
name: process.env.DB_NAME || 'hrms_db',
user: process.env.DB_USER || 'hrms_user',
password: process.env.DB_PASSWORD || '',
ssl: process.env.DB_SSL === 'true',
pool: {
max: parseInt(process.env.DB_POOL_MAX) || 10,
min: parseInt(process.env.DB_POOL_MIN) || 0,
acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
idle: parseInt(process.env.DB_POOL_IDLE) || 10000
}
},

// Redis
redis: {
host: process.env.REDIS_HOST || 'localhost',
port: parseInt(process.env.REDIS_PORT) || 6379,
password: process.env.REDIS_PASSWORD || '',
ttl: parseInt(process.env.REDIS_TTL) || 3600
},

// JWT Authentication
jwt: {
secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
expiry: process.env.JWT_EXPIRY || '7d',
refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '30d',
mfaOtpExpiry: parseInt(process.env.MFA_OTP_EXPIRY) || 300 // 5 minutes
},

// Email Configuration
email: {
host: process.env.EMAIL_HOST || 'smtp.gmail.com',
port: parseInt(process.env.EMAIL_PORT) || 587,
user: process.env.EMAIL_USER || '',
password: process.env.EMAIL_PASSWORD || '',
from: process.env.EMAIL_FROM || 'noreply@hrms.com',
secure: process.env.EMAIL_SECURE === 'true'
},

// File Storage
storage: {
type: process.env.STORAGE_TYPE || 'LOCAL',
localPath: process.env.LOCAL_STORAGE_PATH || './uploads/documents/',
maxFileSize: parseInt(process.env.MAX_FILE_SIZE_MB) * 1024 * 1024 || 5 * 1024 * 1024,
allowedTypes: process.env.ALLOWED_FILE_TYPES ?
process.env.ALLOWED_FILE_TYPES.split(',') : [
'image/jpeg', 'image/png', 'image/jpg',
'application/pdf', 'application/msword',
'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]
},

// AWS S3 Configuration
s3: {
accessKeyId: process.env.AWS_ACCESS_KEY_ID,
secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
region: process.env.AWS_REGION || 'ap-south-1',
bucketName: process.env.S3_BUCKET_NAME || 'hrms-documents'
},

// MinIO Configuration
minio: {
endpoint: process.env.MINIO_ENDPOINT || 'localhost:9000',
accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
bucketName: process.env.MINIO_BUCKET_NAME || 'hrms-documents',
useSSL: process.env.MINIO_USE_SSL === 'true'
},

// Attendance Integration
attendance: {
dbHost: process.env.ATTENDANCE_DB_HOST || '10.144.97.27',
dbPort: parseInt(process.env.ATTENDANCE_DB_PORT) || 5432,
dbName: process.env.ATTENDANCE_DB_NAME || 'attendance_tracker_db',
dbUser: process.env.ATTENDANCE_DB_USER || 'trhrms',
dbPassword: process.env.ATTENDANCE_DB_PASSWORD || 'TR@#hrms#$er23',
table: process.env.ATTENDANCE_TABLE || 'user_attendance_table',
syncStartDate: process.env.ATTENDANCE_SYNC_START_DATE || '2026-01-26',
syncFrequency: parseInt(process.env.ATTENDANCE_SYNC_FREQUENCY) || 30
},

// Company Defaults
company: {
name: process.env.COMPANY_NAME || 'Your Company',
logoUrl: process.env.COMPANY_LOGO_URL || '/logo.png',
employeeIdPrefix: process.env.EMPLOYEE_ID_PREFIX || 'TG',
employeeIdStart: parseInt(process.env.EMPLOYEE_ID_START) || 10001,
leaveEligibilityDays: parseInt(process.env.LEAVE_ELIGIBILITY_DAYS) || 0
},

// Security
security: {
passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
passwordRequireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true',
passwordRequireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE === 'true',
passwordRequireNumber: process.env.PASSWORD_REQUIRE_NUMBER === 'true',
passwordRequireSpecial: process.env.PASSWORD_REQUIRE_SPECIAL === 'true',
passwordExpiryDays: parseInt(process.env.PASSWORD_EXPIRY_DAYS) || 90,
sessionTimeoutMinutes: parseInt(process.env.SESSION_TIMEOUT_MINUTES) || 30,
maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
accountLockDuration: parseInt(process.env.ACCOUNT_LOCK_DURATION) || 30
},

// Rate Limiting
rateLimit: {
windowMs: eval(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000
},

// Logging
logging: {
level: process.env.LOG_LEVEL || 'info',
filePath: process.env.LOG_FILE_PATH || './logs',
retentionDays: parseInt(process.env.LOG_RETENTION_DAYS) || 30
},

// Feature Flags
features: {
mfaEnabled: process.env.MFA_ENABLED === 'true',
biometricSync: process.env.BIOMETRIC_SYNC_ENABLED === 'true',
payrollAutoProcessing: process.env.PAYROLL_AUTO_PROCESSING === 'true',
leaveAutoAccrual: process.env.LEAVE_AUTO_ACCRUAL === 'true'
}
};

// Validate required environment variables
const validateEnvironment = () => {
const required = [
'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
'JWT_SECRET', 'EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASSWORD'
];

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
console.error('? Missing required environment variables:', missing);

if (environment.nodeEnv === 'production') {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
} else {
  console.warn('??  Running in development mode with missing variables');
}
}

// Validate file storage
if (environment.storage.type === 'S3' && (!environment.s3.accessKeyId || !environment.s3.secretAccessKey)) {
console.warn('?? S3 storage selected but AWS credentials not configured');
}

if (environment.storage.type === 'MINIO' && !environment.minio.endpoint) {
console.warn('?? MinIO storage selected but endpoint not configured');
}

return true;
};

// Perform validation
validateEnvironment();

module.exports = environment;