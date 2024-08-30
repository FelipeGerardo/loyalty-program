import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/system';
import './styles.css';


// Estilo personalizado para el AppBar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  padding: 10,
  margin: 0,
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
}));

function Header() {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography 
          variant="h4"
          sx={{
            fontSize: {
              xs: '1.5rem',  // Tamaño para pantallas pequeñas
              sm: '2rem',    // Tamaño para pantallas medianas
              md: '2.5rem',  // Tamaño para pantallas grandes
              lg: '3rem',    // Tamaño para pantallas más grandes
              xl: '3.5rem'   // Tamaño para pantallas extra grandes
            }
          }}
        >
          Programa de lealtad
        </Typography>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Header;