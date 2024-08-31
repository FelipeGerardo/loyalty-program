import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Container, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import './firebaseConfig';
import { getFirestore, addDoc, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isExistingClient, setIsExistingClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Estado para editar la información
  const [docId, setDocId] = useState(null); // Guardar la referencia al documento del cliente existente
  const [formValues, setFormValues] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    visits: '1'
  });

  const db = getFirestore();
  
  const handleChange = (event) => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, '').substring(0, 10);
    setPhoneNumber(numericValue);
    setIsButtonEnabled(numericValue.length === 10);
  };

  const handleModalOpen = async () => {
    const clientesRef = collection(db, "clientes");
    const q = query(clientesRef, where("numero", "==", phoneNumber));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Cliente existente
      const clientData = querySnapshot.docs[0].data();
      setFormValues({
        phoneNumber: clientData.numero,
        firstName: clientData.nombre,
        lastName: clientData.apellidoPaterno,
        middleName: clientData.apellidoMaterno,
        email: clientData.correo,
        visits: clientData.visitas // No incrementa aquí
      });
      setIsExistingClient(true);
      setDocId(querySnapshot.docs[0].id); // Guardar el ID del documento para futuras actualizaciones
    } else {
      // Cliente nuevo
      setFormValues({
        phoneNumber,
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        visits: '1'
      });
      setIsExistingClient(false);
    }
    setOpen(true);
    setPhoneNumber('');
    setIsButtonEnabled(!isButtonEnabled);
  };

  const handleModalClose = () => {
    setOpen(false);
    setIsEditing(false); // Restablecer el estado de edición al cerrar el modal
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInfo = () => {
    setIsEditing(true);
  };

  const saveData = async () => {
    const clientesRef = collection(db, "clientes");

    if (isExistingClient) {
      if (!isEditing) {
        // Solo actualiza las visitas cuando se presiona "Actualizar Visita"
        const docRef = doc(db, "clientes", docId); // Referencia del documento usando el ID guardado
        await updateDoc(docRef, {
          visitas: (parseInt(formValues.visits) + 1).toString() // Incrementar visitas
        });
        alert("Visita actualizada :D");
      } else {
        // Actualizar la información del cliente existente
        const docRef = doc(db, "clientes", docId); // Referencia del documento usando el ID guardado
        await updateDoc(docRef, {
          nombre: formValues.firstName,
          apellidoPaterno: formValues.lastName,
          apellidoMaterno: formValues.middleName,
          correo: formValues.email
        });
        alert("Información actualizada :D");
      }
    } else {
      // Agregar nuevo cliente
      await addDoc(clientesRef, {
        numero: formValues.phoneNumber,
        nombre: formValues.firstName,
        apellidoPaterno: formValues.lastName,
        apellidoMaterno: formValues.middleName,
        correo: formValues.email,
        visitas: formValues.visits
      });
      alert("Cliente registrado :D");
    }

    handleModalClose(); // Cerrar el modal después de guardar los datos
  };

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
        <DialogTitle>{isExistingClient ? "Actualizar Información" : "Registrar Cliente"}</DialogTitle>
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
            disabled={!isEditing && isExistingClient}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Apellido Paterno"
            type="text"
            fullWidth
            value={formValues.lastName}
            onChange={handleInputChange}
            disabled={!isEditing && isExistingClient}
          />
          <TextField
            margin="dense"
            name="middleName"
            label="Apellido Materno"
            type="text"
            fullWidth
            value={formValues.middleName}
            onChange={handleInputChange}
            disabled={!isEditing && isExistingClient}
          />
          <TextField
            margin="dense"
            name="email"
            label="Correo"
            type="email"
            fullWidth
            value={formValues.email}
            onChange={handleInputChange}
            disabled={!isEditing && isExistingClient}
          />
          <TextField
            margin="dense"
            name="visits"
            label="Visitas"
            type="number"
            fullWidth
            value={formValues.visits}
            disabled // Campo siempre inactivo
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancelar
          </Button>
          {isExistingClient && !isEditing && (
            <Button onClick={handleEditInfo} color="secondary">
              Editar Información
            </Button>
          )}
          <Button onClick={saveData} color="primary">
            {isExistingClient ? (isEditing ? "Actualizar Información" : "Actualizar Visita") : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
