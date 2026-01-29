import api from './api';

export interface ModuleSettings {
  employee: {
    fields: {
      [key: string]: {
        enabled: boolean;
        required: boolean;
      };
    };
  };
}

export interface DropdownValues {
  gender: string[];
  marital_status: string[];
  blood_group: string[];
  employment_type: string[];
  employment_status: string[];
}

export interface Settings {
  id: string;
  company_id: string;
  module_settings: ModuleSettings;
  dropdown_values: DropdownValues;
  leave_eligibility_days: number;
  employee_id_prefix: string;
  employee_id_start_number: number;
  created_at: string;
  updated_at: string;
}

const settingsService = {
  getSettings: async (companyId?: string): Promise<Settings> => {
    const params = companyId ? { company_id: companyId } : {};
    const response = await api.get('/settings', { params });
    return response.data.data;
  },

  updateSettings: async (settings: Partial<Settings>): Promise<Settings> => {
    const response = await api.put('/settings', settings);
    return response.data.data;
  },

  getDropdownValues: async (companyId?: string): Promise<DropdownValues> => {
    const params = companyId ? { company_id: companyId } : {};
    const response = await api.get('/settings/dropdowns', { params });
    return response.data.data;
  },

  updateDropdownValues: async (dropdownValues: DropdownValues): Promise<DropdownValues> => {
    const response = await api.put('/settings/dropdowns', { dropdown_values: dropdownValues });
    return response.data.data;
  },

  getModuleSettings: async (companyId?: string): Promise<ModuleSettings> => {
    const params = companyId ? { company_id: companyId } : {};
    const response = await api.get('/settings/modules', { params });
    return response.data.data;
  },

  updateModuleSettings: async (moduleSettings: ModuleSettings): Promise<ModuleSettings> => {
    const response = await api.put('/settings/modules', { module_settings: moduleSettings });
    return response.data.data;
  },
};

export default settingsService;
