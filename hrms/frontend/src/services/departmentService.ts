import api from './api';

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  managerId?: number;
  status: string;
}

export const departmentService = {
  getAll: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  create: async (department: Partial<Department>) => {
    const response = await api.post('/departments', department);
    return response.data;
  },

  update: async (id: number, department: Partial<Department>) => {
    const response = await api.put(`/departments/${id}`, department);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },
};
