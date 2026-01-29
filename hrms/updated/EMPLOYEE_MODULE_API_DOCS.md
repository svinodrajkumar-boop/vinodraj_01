# Employee Management Module - API Documentation

## Overview
The Employee Management Module provides comprehensive APIs for managing employee data with dynamic field configurations, JSONB support for flexible data structures, and company-specific settings.

## Key Features
1. **Dynamic Field Configuration**: Admin can enable/disable fields like languages, education, experience, skills
2. **JSONB Support**: Store complex data structures for languages, education, experience, and skills
3. **Company-Specific Settings**: Each company can customize dropdown values and field requirements
4. **Dropdown Management**: Dynamic dropdowns for gender, marital status, blood group, etc.

## Settings API

### Get Settings
```
GET /api/settings
Query Parameters:
  - company_id (optional): UUID of the company

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_id": "uuid",
    "module_settings": {
      "employee": {
        "fields": {
          "languages": { "enabled": true, "required": false },
          "education": { "enabled": true, "required": false },
          "experience": { "enabled": true, "required": false },
          "skills": { "enabled": true, "required": false },
          "gender": { "enabled": true, "required": true },
          "marital_status": { "enabled": true, "required": false },
          "blood_group": { "enabled": true, "required": false }
        }
      }
    },
    "dropdown_values": {
      "gender": ["Male", "Female", "Other"],
      "marital_status": ["Single", "Married", "Divorced", "Widowed"],
      "blood_group": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      "employment_type": ["Permanent", "Contract", "Intern", "Trainee", "Consultant"],
      "employment_status": ["Active", "Inactive", "Resigned", "Terminated", "Probation"]
    },
    "leave_eligibility_days": 0,
    "employee_id_prefix": "TG",
    "employee_id_start_number": 10001
  }
}
```

### Update Settings
```
PUT /api/settings
Authorization: Required (Admin role)

Body:
{
  "module_settings": { ... },
  "dropdown_values": { ... },
  "leave_eligibility_days": 0,
  "employee_id_prefix": "TG",
  "employee_id_start_number": 10001
}

Response:
{
  "success": true,
  "message": "Settings updated successfully",
  "data": { ... }
}
```

### Get Dropdown Values
```
GET /api/settings/dropdowns
Query Parameters:
  - company_id (optional): UUID of the company

Response:
{
  "success": true,
  "data": {
    "gender": ["Male", "Female", "Other"],
    "marital_status": ["Single", "Married", "Divorced", "Widowed"],
    ...
  }
}
```

### Get Module Settings
```
GET /api/settings/modules
Query Parameters:
  - company_id (optional): UUID of the company

Response:
{
  "success": true,
  "data": {
    "employee": {
      "fields": {
        "languages": { "enabled": true, "required": false },
        ...
      }
    }
  }
}
```

## Employee API (Enhanced)

### Create Employee
```
POST /api/employees
Authorization: Required (HR/Admin role)

Body:
{
  "first_name": "John",
  "middle_name": "Michael",
  "last_name": "Doe",
  "official_email": "john.doe@company.com",
  "personal_email": "john@example.com",
  "phone_number": "+919876543210",
  "emergency_contact": "+919876543211",
  "date_of_birth": "1990-01-15",
  "gender": "Male",
  "marital_status": "Single",
  "blood_group": "A+",
  "joining_date": "2024-01-01",
  "employment_type": "Permanent",
  "employee_category": "Level1",
  "languages": [
    { "name": "English", "proficiency": "Fluent" },
    { "name": "Hindi", "proficiency": "Native" }
  ],
  "education": [
    {
      "degree": "Bachelor of Engineering",
      "institution": "IIT Delhi",
      "year": "2012",
      "specialization": "Computer Science"
    }
  ],
  "experience": [
    {
      "company": "Tech Corp",
      "designation": "Senior Developer",
      "from": "2012-06-01",
      "to": "2023-12-31",
      "description": "Led backend development team"
    }
  ],
  "skills": [
    { "name": "JavaScript", "level": "Expert" },
    { "name": "Python", "level": "Intermediate" }
  ],
  "department_id": "uuid",
  "designation_id": "uuid",
  "reporting_manager_id": "uuid",
  "team_lead_id": "uuid",
  "bank_name": "HDFC Bank",
  "account_number": "1234567890",
  "ifsc_code": "HDFC0001234",
  "pan_number": "ABCDE1234F",
  "aadhaar_number": "123456789012"
}

Response:
{
  "success": true,
  "message": "Employee created successfully",
  "data": { ... }
}
```

### Update Employee
```
PUT /api/employees/:id
Authorization: Required (HR/Admin role)

Body: Same as Create Employee (all fields optional)

Response:
{
  "success": true,
  "message": "Employee updated successfully",
  "data": { ... }
}
```

## Frontend Components

### Settings Page
Located at `/settings`
- Configure module and field settings
- Manage dropdown values
- Set employee ID generation rules
- Configure leave eligibility period

### Employee Form
- Dynamic field rendering based on settings
- Accordion-based layout for better organization
- JSONB field editors for:
  - Languages (with proficiency levels)
  - Education (degree, institution, year, specialization)
  - Experience (company, designation, duration, description)
  - Skills (name, level)
- Dropdown fields populated from settings
- Material-UI components for consistent UI

### Employee Management Page
- List all employees
- Add new employee button
- Edit employee functionality
- Integrated EmployeeForm dialog

## Database Schema

### Settings Table
```sql
CREATE TABLE settings (
    id UUID PRIMARY KEY,
    company_id UUID UNIQUE REFERENCES company(id),
    module_settings JSONB,
    dropdown_values JSONB,
    leave_eligibility_days INTEGER,
    employee_id_prefix VARCHAR(10),
    employee_id_start_number INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Employee Table (JSONB Fields)
```sql
-- Existing fields...
languages JSONB DEFAULT '[]',
education JSONB DEFAULT '[]',
experience JSONB DEFAULT '[]',
skills JSONB DEFAULT '[]'
```

## JSONB Data Structures

### Languages
```json
[
  {
    "name": "English",
    "proficiency": "Fluent" // Options: Native, Fluent, Intermediate, Basic
  }
]
```

### Education
```json
[
  {
    "degree": "Bachelor of Engineering",
    "institution": "IIT Delhi",
    "year": "2012",
    "specialization": "Computer Science"
  }
]
```

### Experience
```json
[
  {
    "company": "Tech Corp",
    "designation": "Senior Developer",
    "from": "2012-06-01",
    "to": "2023-12-31",
    "description": "Led backend development team"
  }
]
```

### Skills
```json
[
  {
    "name": "JavaScript",
    "level": "Expert" // Options: Expert, Advanced, Intermediate, Beginner
  }
]
```

## Configuration Options

### Module Settings Structure
```javascript
{
  employee: {
    fields: {
      languages: { enabled: true, required: false },
      education: { enabled: true, required: false },
      experience: { enabled: true, required: false },
      skills: { enabled: true, required: false },
      gender: { enabled: true, required: true },
      marital_status: { enabled: true, required: false },
      blood_group: { enabled: true, required: false }
    }
  }
}
```

### Dropdown Values Structure
```javascript
{
  gender: ["Male", "Female", "Other"],
  marital_status: ["Single", "Married", "Divorced", "Widowed"],
  blood_group: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  employment_type: ["Permanent", "Contract", "Intern", "Trainee", "Consultant"],
  employment_status: ["Active", "Inactive", "Resigned", "Terminated", "Probation"]
}
```

## Usage Examples

### 1. Configure Company Settings
As an admin, navigate to Settings page and:
- Enable/disable fields (e.g., disable "Languages" if not needed)
- Mark fields as required (e.g., make "Gender" required)
- Add custom dropdown values (e.g., add "Freelancer" to employment types)
- Set employee ID prefix (e.g., "EMP" instead of "TG")

### 2. Create Employee with Full Details
Use the Employee Form to:
- Fill in basic information (name, email, phone)
- Select values from dropdowns (gender, marital status, blood group)
- Add multiple languages with proficiency levels
- Add education history with all details
- Add work experience entries
- Add skills with proficiency levels

### 3. Conditional Field Display
If a field is disabled in settings:
- It won't appear in the employee form
- Existing data is preserved but not editable
- Field can be re-enabled later without data loss

## Security Considerations
- Only Admin users can modify settings
- HR and Admin roles can create/update employees
- All endpoints require JWT authentication
- Company ID is derived from authenticated user's context
- JSONB fields are validated for structure

## Future Enhancements
- Export/import settings across companies
- Field validation rules in settings
- Custom field types support
- Multi-language support for dropdown values
- Field history tracking
