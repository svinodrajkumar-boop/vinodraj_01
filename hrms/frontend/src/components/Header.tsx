import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          HRMS - Human Resource Management System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, User
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
