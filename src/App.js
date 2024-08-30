import React, { useState } from 'react';
import  Button  from '@mui/material/Button';
import { Container, Box, Tabs, Tab, TextField } from '@mui/material';


function App() {

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // Maneja el cambio en el campo de texto
  const handleChange = (event) => {
    const value = event.target.value;
    // Permitir solo números y limitar a 10 caracteres
    const numericValue = value.replace(/\D/g, '').substring(0, 10);
    setPhoneNumber(numericValue);
    setIsButtonEnabled(numericValue.length === 10);
  };

  // Maneja el clic en el botón
  const handleSearch = () => {
    // Implementar la lógica de búsqueda aquí
    alert(`Buscando el número: ${phoneNumber}`);
  };  

  return (
    <Container maxWidth="md">
      <h2>Buscar cliente</h2>
      <TextField 
        id="phone-number" 
        label="Número de teléfono" 
        variant="outlined" 
        value={phoneNumber}
        onChange={handleChange}
        inputProps={{ pattern: "\\d*" }} // Permite solo números
        sx={{ width: '100%', paddingBottom: '15px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        disabled={!isButtonEnabled}
      >
        Buscar
      </Button>
    </Container>
  );
}

export default App;
