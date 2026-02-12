import api from './api';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  departmentId: number;
  designationId: number;
  joiningDate: string;
  status: string;
}

export const employeeService = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (employee: Partial<Employee>) => {
    const response = await api.post('/employees', employee);
    return response.data;
  },

  update: async (id: number, employee: Partial<Employee>) => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};
