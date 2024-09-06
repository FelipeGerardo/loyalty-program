import React, { useState, useEffect } from 'react';
import { Button, Container, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './firebaseConfig';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

function App() {
  const [formValues, setFormValues] = useState({
    category: '',
    demographicGroup: '',
    comment: ''
  });
  const [categories, setCategories] = useState([]);
  const [demographicGroups, setDemographicGroups] = useState([]);

  const db = getFirestore();

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categorias"));
      const fetchedCategories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Ordenar categorías alfabéticamente
      fetchedCategories.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setCategories(fetchedCategories);
    };

    const fetchDemographicGroups = async () => {
      const querySnapshot = await getDocs(collection(db, "grupos_demograficos"));
      const fetchedDemographicGroups = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Ordenar grupos demográficos alfabéticamente
      fetchedDemographicGroups.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setDemographicGroups(fetchedDemographicGroups);
    };

    fetchCategories();
    fetchDemographicGroups();
  }, [db]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveData = async () => {
    await addDoc(collection(db, "sugerencias"), {
      category: formValues.category,
      demographicGroup: formValues.demographicGroup,
      comment: formValues.comment,
      date: new Date().toLocaleString() // Fecha y hora en formato legible
    });
    alert("Sugerencia registrada :D");
    
    // Limpiar los campos
    setFormValues({
      category: '',
      demographicGroup: '',
      comment: ''
    });
  };

  return (
    <Container maxWidth="md">
      <h2>Registrar Sugerencia del Cliente</h2>
      <FormControl fullWidth sx={{ paddingBottom: '15px' }}>
        <InputLabel>Categoría</InputLabel>
        <Select
          name="category"
          value={formValues.category}
          onChange={handleInputChange}
        >
          {categories.map(category => (
            <MenuItem key={category.id} value={category.nombre}>
              {category.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ paddingBottom: '15px' }}>
        <InputLabel>Grupo Demográfico</InputLabel>
        <Select
          name="demographicGroup"
          value={formValues.demographicGroup}
          onChange={handleInputChange}
        >
          {demographicGroups.map(group => (
            <MenuItem key={group.id} value={group.nombre}>
              {group.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Comentario"
        name="comment"
        value={formValues.comment}
        onChange={handleInputChange}
        fullWidth
        multiline
        sx={{ paddingBottom: '15px' }}
      />

      <Button variant="contained" color="primary" onClick={saveData}>
        Registrar Sugerencia
      </Button>
    </Container>
  );
}

export default App;
