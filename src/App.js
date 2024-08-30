import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Container, TextField } from '@mui/material';
import './firebaseConfig';
import { getFirestore, addDoc, collection, query, where, getDocs } from 'firebase/firestore';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const db = getFirestore();
  
  const handleChange = (event) => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, '').substring(0, 10);
    setPhoneNumber(numericValue);
    setIsButtonEnabled(numericValue.length === 10);
  };

  // const handleSearch = async () => {
  //   const q = query(collection(db, "clientes"), where("phoneNumber", "==", phoneNumber));
  //   const querySnapshot = await getDocs(q);
  //   if (querySnapshot.empty) {
  //     alert("Cliente no encontrado");
  //   } else {
  //     querySnapshot.forEach((doc) => {
  //       // Muestra los datos del cliente
  //       alert(`Cliente encontrado: ${JSON.stringify(doc.data())}`);
  //     });
  //   }
  // };

  // const saveData = async () => {
  //   const docRef = await addDoc(collection(db,"clientes"), {
  //     numero: phoneNumber,
  //   });
  //   alert("Cliente registrado :D");
  // }

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
        numero: phoneNumber,
      });
  
      alert("Cliente registrado :D");
    } catch (error) {
      console.error("Error al registrar el cliente: ", error);
      alert("Error al registrar el cliente. Intenta de nuevo.");
    }
  }

  return (
    <Container maxWidth="md">
      <h2>Registrar cliente</h2>
      <TextField 
        id="phone-number" 
        label="Número de teléfono" 
        variant="outlined" 
        value={phoneNumber}
        onChange={handleChange}
        inputProps={{ pattern: "\\d*" }}
        sx={{ width: '100%', paddingBottom: '15px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={saveData}
        disabled={!isButtonEnabled}
      >
        Registrar
      </Button>
    </Container>
  );
}

export default App;