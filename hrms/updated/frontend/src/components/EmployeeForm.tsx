import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import settingsService, { DropdownValues, ModuleSettings } from '../services/settingsService';
import employeeService from '../services/employeeService';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  employee?: any;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onSave, employee }) => {
  const [formData, setFormData] = useState<any>({
    first_name: '',
    middle_name: '',
    last_name: '',
    official_email: '',
    personal_email: '',
    phone_number: '',
    emergency_contact: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    blood_group: '',
    joining_date: '',
    employment_type: 'Permanent',
    employee_category: 'Level1',
    languages: [],
    education: [],
    experience: [],
    skills: [],
  });

  const [dropdownValues, setDropdownValues] = useState<DropdownValues | null>(null);
  const [moduleSettings, setModuleSettings] = useState<ModuleSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // New item states for JSONB fields
  const [newLanguage, setNewLanguage] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    year: '',
    specialization: '',
  });
  const [newExperience, setNewExperience] = useState({
    company: '',
    designation: '',
    from: '',
    to: '',
    description: '',
  });

  useEffect(() => {
    loadSettings();
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [dropdowns, modules] = await Promise.all([
        settingsService.getDropdownValues(),
        settingsService.getModuleSettings(),
      ]);
      setDropdownValues(dropdowns);
      setModuleSettings(modules);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      setFormData({
        ...formData,
        languages: [...formData.languages, { name: newLanguage, proficiency: 'Intermediate' }],
      });
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_: any, i: number) => i !== index),
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { name: newSkill, level: 'Intermediate' }],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_: any, i: number) => i !== index),
    });
  };

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setFormData({
        ...formData,
        education: [...formData.education, { ...newEducation }],
      });
      setNewEducation({ degree: '', institution: '', year: '', specialization: '' });
    }
  };

  const handleRemoveEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_: any, i: number) => i !== index),
    });
  };

  const handleAddExperience = () => {
    if (newExperience.company && newExperience.designation) {
      setFormData({
        ...formData,
        experience: [...formData.experience, { ...newExperience }],
      });
      setNewExperience({ company: '', designation: '', from: '', to: '', description: '' });
    }
  };

  const handleRemoveExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_: any, i: number) => i !== index),
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.official_email || 
        !formData.phone_number || !formData.joining_date) {
      alert('Please fill in all required fields: First Name, Last Name, Official Email, Phone Number, and Joining Date');
      return;
    }

    try {
      setSaving(true);
      if (employee?.id) {
        await employeeService.updateEmployee(employee.id, formData);
      } else {
        await employeeService.createEmployee(formData);
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Failed to save employee:', err);
      alert(err.response?.data?.message || 'Failed to save employee. Please check the form and try again.');
    } finally {
      setSaving(false);
    }
  };

  const isFieldEnabled = (field: string) => {
    return moduleSettings?.employee?.fields?.[field]?.enabled !== false;
  };

  const isFieldRequired = (field: string) => {
    return moduleSettings?.employee?.fields?.[field]?.required === true;
  };

  if (loading) {
    return (
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Basic Information */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label="First Name"
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Middle Name"
                    value={formData.middle_name}
                    onChange={(e) => handleChange('middle_name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label="Last Name"
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Official Email"
                    value={formData.official_email}
                    onChange={(e) => handleChange('official_email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Personal Email"
                    value={formData.personal_email}
                    onChange={(e) => handleChange('personal_email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Phone Number"
                    value={formData.phone_number}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    value={formData.emergency_contact}
                    onChange={(e) => handleChange('emergency_contact', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date of Birth"
                    value={formData.date_of_birth}
                    onChange={(e) => handleChange('date_of_birth', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                {isFieldEnabled('gender') && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      required={isFieldRequired('gender')}
                      label="Gender"
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      {(dropdownValues?.gender || []).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
                {isFieldEnabled('marital_status') && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      required={isFieldRequired('marital_status')}
                      label="Marital Status"
                      value={formData.marital_status}
                      onChange={(e) => handleChange('marital_status', e.target.value)}
                    >
                      {(dropdownValues?.marital_status || []).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
                {isFieldEnabled('blood_group') && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      required={isFieldRequired('blood_group')}
                      label="Blood Group"
                      value={formData.blood_group}
                      onChange={(e) => handleChange('blood_group', e.target.value)}
                    >
                      {(dropdownValues?.blood_group || []).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Employment Details */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Employment Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Joining Date"
                    value={formData.joining_date}
                    onChange={(e) => handleChange('joining_date', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Employment Type"
                    value={formData.employment_type}
                    onChange={(e) => handleChange('employment_type', e.target.value)}
                  >
                    {(dropdownValues?.employment_type || []).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Languages */}
          {isFieldEnabled('languages') && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Languages</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {formData.languages.map((lang: any, index: number) => (
                      <Chip
                        key={index}
                        label={`${lang.name} (${lang.proficiency})`}
                        onDelete={() => handleRemoveLanguage(index)}
                        color="primary"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      label="Language"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                    />
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddLanguage}>
                      Add
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Skills */}
          {isFieldEnabled('skills') && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Skills</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {formData.skills.map((skill: any, index: number) => (
                      <Chip
                        key={index}
                        label={`${skill.name} (${skill.level})`}
                        onDelete={() => handleRemoveSkill(index)}
                        color="secondary"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      label="Skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddSkill}>
                      Add
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Education */}
          {isFieldEnabled('education') && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Education</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  {formData.education.map((edu: any, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        p: 2,
                        mb: 2,
                        position: 'relative',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveEducation(index)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Typography variant="subtitle2">{edu.degree}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {edu.institution} • {edu.year}
                      </Typography>
                      {edu.specialization && (
                        <Typography variant="body2">{edu.specialization}</Typography>
                      )}
                    </Box>
                  ))}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Degree"
                        value={newEducation.degree}
                        onChange={(e) =>
                          setNewEducation({ ...newEducation, degree: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Institution"
                        value={newEducation.institution}
                        onChange={(e) =>
                          setNewEducation({ ...newEducation, institution: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Year"
                        value={newEducation.year}
                        onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Specialization"
                        value={newEducation.specialization}
                        onChange={(e) =>
                          setNewEducation({ ...newEducation, specialization: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddEducation}>
                        Add Education
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Experience */}
          {isFieldEnabled('experience') && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Experience</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  {formData.experience.map((exp: any, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        p: 2,
                        mb: 2,
                        position: 'relative',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveExperience(index)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Typography variant="subtitle2">{exp.designation}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {exp.company} • {exp.from} - {exp.to}
                      </Typography>
                      {exp.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {exp.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Company"
                        value={newExperience.company}
                        onChange={(e) =>
                          setNewExperience({ ...newExperience, company: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Designation"
                        value={newExperience.designation}
                        onChange={(e) =>
                          setNewExperience({ ...newExperience, designation: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="From"
                        value={newExperience.from}
                        onChange={(e) => setNewExperience({ ...newExperience, from: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="To"
                        value={newExperience.to}
                        onChange={(e) => setNewExperience({ ...newExperience, to: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        label="Description"
                        value={newExperience.description}
                        onChange={(e) =>
                          setNewExperience({ ...newExperience, description: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddExperience}
                      >
                        Add Experience
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>
          {saving ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
