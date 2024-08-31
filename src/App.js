import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Container, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import './firebaseConfig';
import { getFirestore, addDoc, collection, query, where, getDocs } from 'firebase/firestore';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [clientName, setClientName] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [open, setOpen] = useState(false); // Estado para controlar el modal
  const [formValues, setFormValues] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    visits: ''
  });

  const db = getFirestore();
  
  const handleChange = (event) => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, '').substring(0, 10);
    setPhoneNumber(numericValue);
    setIsButtonEnabled(numericValue.length === 10);
  };

  // const handleChange2 = (event) => {
  //   const value = event.target.value;
  //   const nameValue = value.substring(0, 50);
  //   setClientName(nameValue);
  // };

  const handleModalOpen = () => {
    setFormValues(prev => ({
      ...prev,
      phoneNumber
    }));
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveData = async () => {
    try {
      // Crea una referencia a la colección
      const clientesRef = collection(db, "clientes");
  
      // Crea una consulta para buscar documentos con el número de teléfono dado
      const q = query(clientesRef, where("numero", "==", phoneNumber));
  
      // Obtén los documentos que coinciden con la consulta
      const querySnapshot = await getDocs(q);
      console.log("Consulta:", q); // Para depuración
      console.log("Documentos encontrados:", querySnapshot.docs.map(doc => doc.data())); // Para depuración

      // Si hay documentos, el número ya está registrado
      if (!querySnapshot.empty) {
        alert("El número de teléfono ya está registrado.");
        return;
      }
  
      // Si no hay documentos, agrega el nuevo registro
      await addDoc(clientesRef, {
        numero: formValues.phoneNumber,
        nombre: formValues.firstName,
        apellidoPaterno: formValues.lastName,
        apellidoMaterno: formValues.middleName,
        correo: formValues.email,
        visitas: formValues.visits
      });
  
      alert("Cliente registrado :D");
    } catch (error) {
      console.error("Error al registrar el cliente: ", error);
      alert("Error al registrar el cliente. Intenta de nuevo.");
    }
  }

  return (
    <Container maxWidth="md">
      <h2>BUSCAR CLIENTE</h2>
      <TextField 
        id="phone-number" 
        label="NÚMERO DE TELÉFONO" 
        variant="outlined" 
        value={phoneNumber}
        onChange={handleChange}
        inputProps={{ pattern: "\\d*" }}
        sx={{ width: '100%', paddingBottom: '15px' }}
      />
      {/* <TextField 
        id="client-name" 
        label="NOMBRE DEL CLIENTE" 
        variant="outlined" 
        value={clientName}
        onChange={handleChange2}
        sx={{ width: '100%', paddingBottom: '15px' }}
      /> */}
       <Button
        variant="contained"
        color="primary"
        onClick={handleModalOpen}
        disabled={!isButtonEnabled}
      >
        BUSCAR
      </Button>

      {/* Modal */}
      <Dialog open={open} onClose={handleModalClose}>
        <DialogTitle>Registrar Cliente</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="phoneNumber"
            label="Número de Teléfono"
            type="text"
            fullWidth
            value={formValues.phoneNumber}
            onChange={handleInputChange}
            disabled
          />
          <TextField
            margin="dense"
            name="firstName"
            label="Nombre"
            type="text"
            fullWidth
            value={formValues.firstName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Apellido Paterno"
            type="text"
            fullWidth
            value={formValues.lastName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="middleName"
            label="Apellido Materno"
            type="text"
            fullWidth
            value={formValues.middleName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Correo"
            type="email"
            fullWidth
            value={formValues.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="visits"
            label="Visitas"
            type="number"
            fullWidth
            value={formValues.visits}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={saveData} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;