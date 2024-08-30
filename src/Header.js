import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/system';
import './styles.css';


// Estilo personalizado para el AppBar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  padding: 0,
  margin: 0,
  width: '100%',
  boxSizing: 'border-box',
}));

function Header() {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h4">Programa de lealtad</Typography>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Header;