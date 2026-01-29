-- Department table
CREATE TABLE IF NOT EXISTS department (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES company(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    parent_department_id UUID REFERENCES department(id),
    head_employee_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Designation table
CREATE TABLE IF NOT EXISTS designation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES company(id),
    department_id UUID REFERENCES department(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    level INTEGER DEFAULT 1,
    grade VARCHAR(50),
    min_salary DECIMAL(12,2) DEFAULT 0,
    max_salary DECIMAL(12,2) DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Employee table
CREATE TABLE IF NOT EXISTS employee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES company(id),
    department_id UUID REFERENCES department(id),
    designation_id UUID REFERENCES designation(id),
    
    -- Employee Identification
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    official_email VARCHAR(255) NOT NULL UNIQUE,
    personal_email VARCHAR(255),
    phone_number VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(20),
    
    -- Personal Details
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    marital_status VARCHAR(20),
    blood_group VARCHAR(10),
    
    -- Official Details
    joining_date DATE NOT NULL,
    confirmation_date DATE,
    employment_type VARCHAR(50) DEFAULT 'Permanent',
    employee_category VARCHAR(50) DEFAULT 'Level1',
    
    -- Reporting Structure
    reporting_manager_id UUID REFERENCES employee(id),
    team_lead_id UUID REFERENCES employee(id),
    hr_manager_id UUID REFERENCES employee(id),
    
    -- Bank Details
    bank_name VARCHAR(255),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    account_holder_name VARCHAR(255),
    pan_number VARCHAR(20) UNIQUE,
    aadhaar_number VARCHAR(20) UNIQUE,
    
    -- Statutory Details
    uan_number VARCHAR(50),
    pf_number VARCHAR(50),
    esic_number VARCHAR(50),
    professional_tax_state VARCHAR(100),
    
    -- Status
    employment_status VARCHAR(50) DEFAULT 'Active',
    resignation_date DATE,
    last_working_date DATE,
    exit_reason TEXT,
    
    -- Additional Info
    languages JSONB DEFAULT '[]',
    education JSONB DEFAULT '[]',
    experience JSONB DEFAULT '[]',
    skills JSONB DEFAULT '[]',
    
    -- System Fields
    user_id UUID UNIQUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID UNIQUE REFERENCES employee(id),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    roles TEXT[] DEFAULT '{"Employee"}',
    is_active BOOLEAN DEFAULT true,
    is_locked BOOLEAN DEFAULT false,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    password_changed_at TIMESTAMP DEFAULT NOW(),
    password_expiry_date DATE,
    last_login_at TIMESTAMP,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,
    mfa_otp VARCHAR(6),
    mfa_otp_expiry TIMESTAMP,
    reset_password_token VARCHAR(100),
    reset_password_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
