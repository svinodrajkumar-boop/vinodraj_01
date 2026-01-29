import api from './api';

export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  official_email: string;
  personal_email?: string;
  phone_number: string;
  emergency_contact?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  blood_group?: string;
  joining_date: string;
  employment_type: string;
  employee_category: string;
  employment_status: string;
  languages?: any[];
  education?: any[];
  experience?: any[];
  skills?: any[];
  department_id?: string;
  designation_id?: string;
  reporting_manager_id?: string;
  team_lead_id?: string;
  hr_manager_id?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  account_holder_name?: string;
  pan_number?: string;
  aadhaar_number?: string;
  uan_number?: string;
  pf_number?: string;
  esic_number?: string;
  professional_tax_state?: string;
}

const employeeService = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (employee: Partial<Employee>) => {
    const response = await api.post('/employees', employee);
    return response.data;
  },

  updateEmployee: async (id: string, employee: Partial<Employee>) => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data;
  },

  deleteEmployee: async (id: string) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  searchEmployees: async (query: string, field?: string) => {
    const response = await api.get('/employees/search/all', {
      params: { q: query, field }
    });
    return response.data;
  },
};

export default employeeService;
