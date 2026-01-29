import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Departments: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Departments
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        View and manage department information
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" color="textSecondary">
          Department management interface coming soon...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Departments;
