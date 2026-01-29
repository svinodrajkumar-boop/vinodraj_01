-- Settings table for company-specific configurations
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL UNIQUE REFERENCES company(id),
    
    -- Module settings (which fields/modules are enabled)
    module_settings JSONB DEFAULT '{
        "employee": {
            "fields": {
                "languages": {"enabled": true, "required": false},
                "education": {"enabled": true, "required": false},
                "experience": {"enabled": true, "required": false},
                "skills": {"enabled": true, "required": false},
                "gender": {"enabled": true, "required": true},
                "marital_status": {"enabled": true, "required": false},
                "blood_group": {"enabled": true, "required": false}
            }
        }
    }'::jsonb,
    
    -- Dropdown values for various fields
    dropdown_values JSONB DEFAULT '{
        "gender": ["Male", "Female", "Other"],
        "marital_status": ["Single", "Married", "Divorced", "Widowed"],
        "blood_group": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        "employment_type": ["Permanent", "Contract", "Intern", "Trainee", "Consultant"],
        "employment_status": ["Active", "Inactive", "Resigned", "Terminated", "Probation"]
    }'::jsonb,
    
    -- Leave eligibility configuration
    leave_eligibility_days INTEGER DEFAULT 0,
    
    -- Employee ID generation settings
    employee_id_prefix VARCHAR(10) DEFAULT 'TG',
    employee_id_start_number INTEGER DEFAULT 10001,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on company_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_company_id ON settings(company_id);

-- Add comment to table
COMMENT ON TABLE settings IS 'Company-specific settings for modules and field configurations';
COMMENT ON COLUMN settings.module_settings IS 'JSON configuration for which modules and fields are enabled';
COMMENT ON COLUMN settings.dropdown_values IS 'Dropdown options for various fields';
COMMENT ON COLUMN settings.leave_eligibility_days IS 'Number of days after joining before employee is eligible for leaves';
