import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import settingsService, { Settings, DropdownValues, ModuleSettings } from '../services/settingsService';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []); // Only run on mount

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      await settingsService.updateSettings(settings);
      setSuccess(true);
      setError(null);
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleModuleFieldToggle = (module: string, field: string, property: 'enabled' | 'required') => {
    if (!settings) return;

    const newSettings = { ...settings };
    if (!newSettings.module_settings[module as keyof ModuleSettings]) {
      newSettings.module_settings[module as keyof ModuleSettings] = { fields: {} } as any;
    }

    const moduleSettings = newSettings.module_settings[module as keyof ModuleSettings] as any;
    if (!moduleSettings.fields[field]) {
      moduleSettings.fields[field] = { enabled: true, required: false };
    }

    moduleSettings.fields[field][property] = !moduleSettings.fields[field][property];
    setSettings(newSettings);
  };

  const handleDropdownValueAdd = (field: keyof DropdownValues, value: string) => {
    if (!settings || !value.trim()) return;

    const newSettings = { ...settings };
    if (!newSettings.dropdown_values[field].includes(value.trim())) {
      newSettings.dropdown_values[field] = [...newSettings.dropdown_values[field], value.trim()];
      setSettings(newSettings);
    }
  };

  const handleDropdownValueRemove = (field: keyof DropdownValues, index: number) => {
    if (!settings) return;

    const newSettings = { ...settings };
    newSettings.dropdown_values[field] = newSettings.dropdown_values[field].filter((_, i) => i !== index);
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Alert severity="error">Failed to load settings</Alert>
      </Box>
    );
  }

  const employeeFields = [
    { key: 'languages', label: 'Languages' },
    { key: 'education', label: 'Education' },
    { key: 'experience', label: 'Experience' },
    { key: 'skills', label: 'Skills' },
    { key: 'gender', label: 'Gender' },
    { key: 'marital_status', label: 'Marital Status' },
    { key: 'blood_group', label: 'Blood Group' },
  ];

  const dropdownFields: { key: keyof DropdownValues; label: string }[] = [
    { key: 'gender', label: 'Gender' },
    { key: 'marital_status', label: 'Marital Status' },
    { key: 'blood_group', label: 'Blood Group' },
    { key: 'employment_type', label: 'Employment Type' },
    { key: 'employment_status', label: 'Employment Status' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Company Settings
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Configure company-specific settings and field options
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee ID Prefix"
                  value={settings.employee_id_prefix}
                  onChange={(e) => setSettings({ ...settings, employee_id_prefix: e.target.value })}
                  helperText="Prefix for auto-generated employee IDs (e.g., TG)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Employee ID Start Number"
                  value={settings.employee_id_start_number}
                  onChange={(e) => setSettings({ ...settings, employee_id_start_number: parseInt(e.target.value, 10) || 1 })}
                  helperText="Starting number for employee ID generation"
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Leave Eligibility Period (days)"
                  value={settings.leave_eligibility_days}
                  onChange={(e) => setSettings({ ...settings, leave_eligibility_days: parseInt(e.target.value, 10) || 0 })}
                  helperText="Number of days after joining before employee is eligible for leaves (0 = immediate)"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Employee Module Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Employee Module Field Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {employeeFields.map((field) => {
                const fieldSettings = settings.module_settings.employee?.fields?.[field.key] || {
                  enabled: true,
                  required: false,
                };
                return (
                  <Grid item xs={12} sm={6} key={field.key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ minWidth: 150 }}>{field.label}</Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={fieldSettings.enabled}
                            onChange={() => handleModuleFieldToggle('employee', field.key, 'enabled')}
                          />
                        }
                        label="Enabled"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={fieldSettings.required}
                            onChange={() => handleModuleFieldToggle('employee', field.key, 'required')}
                            disabled={!fieldSettings.enabled}
                          />
                        }
                        label="Required"
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        {/* Dropdown Values */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dropdown Values
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              {dropdownFields.map((field) => (
                <Grid item xs={12} key={field.key}>
                  <Typography variant="subtitle2" gutterBottom>
                    {field.label}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    {settings.dropdown_values[field.key].map((value, index) => (
                      <Chip
                        key={index}
                        label={value}
                        onDelete={() => handleDropdownValueRemove(field.key, index)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder={`Add ${field.label} option`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          handleDropdownValueAdd(field.key, target.value);
                          target.value = '';
                        }
                      }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={(e) => {
                        const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                        handleDropdownValueAdd(field.key, input.value);
                        input.value = '';
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={loadSettings} disabled={saving}>
              Reset
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? <CircularProgress size={24} /> : 'Save Settings'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
