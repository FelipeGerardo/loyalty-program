import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container,
  TextField, MenuItem, Select, InputLabel, FormControl, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [demographicGroupFilter, setDemographicGroupFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [demographicGroups, setDemographicGroups] = useState([]);
  const [open, setOpen] = useState(false); // State for modal open/close

  useEffect(() => {
    const fetchRecords = async () => {
      const db = getFirestore();
      const recordsCollection = collection(db, 'sugerencias');
      const recordsSnapshot = await getDocs(recordsCollection);
      const recordsList = recordsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecords(recordsList);
    };

    const fetchCategories = async () => {
      const db = getFirestore();
      const categoriesCollection = collection(db, 'categorias');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const fetchedCategories = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(fetchedCategories);
    };

    const fetchDemographicGroups = async () => {
      const db = getFirestore();
      const demographicGroupsCollection = collection(db, 'grupos_demograficos');
      const demographicGroupsSnapshot = await getDocs(demographicGroupsCollection);
      const fetchedDemographicGroups = demographicGroupsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDemographicGroups(fetchedDemographicGroups);
    };

    fetchRecords();
    fetchCategories();
    fetchDemographicGroups();
  }, []);

  const formatDateTime = (dateString) => {
    const [date, time] = dateString.split(', '); // Separar fecha y hora
    return { date, time };
  };

  const filteredRecords = records.filter((record) => {
    const { category, demographicGroup, comment } = record;
    return (
      (!categoryFilter || category === categoryFilter) &&
      (!demographicGroupFilter || demographicGroup === demographicGroupFilter) &&
      comment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const categoryData = categories.map(cat => ({
    name: cat.nombre,
    count: records.filter(r => r.category === cat.nombre).length
  }));

  const demographicGroupData = demographicGroups.map(group => ({
    name: group.nombre,
    count: records.filter(r => r.demographicGroup === group.nombre).length
  }));

  const dateGroupedRecords = records.reduce((acc, record) => {
    const { date } = formatDateTime(record.date);
    if (!acc[date]) {
      acc[date] = {};
    }
    if (!acc[date][record.category]) {
      acc[date][record.category] = 0;
    }
    acc[date][record.category]++;
    return acc;
  }, {});

  const dateLabels = Object.keys(dateGroupedRecords);
  const categoryDatasets = categories.map(cat => ({
    label: cat.nombre,
    data: dateLabels.map(date => dateGroupedRecords[date][cat.nombre] || 0),
    borderColor: 'rgba(75,192,192,1)',
    backgroundColor: 'rgba(75,192,192,0.2)',
    fill: false
  }));

  return (
    <Container maxWidth="lg">
      <h1>Registros de Sugerencias</h1>

      {/* Botón para abrir el modal */}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ marginBottom: 2 }}>
        Ver Resumen
      </Button>

      {/* Modal con gráficos */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Resumen de Categorías y Grupos Demográficos</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <h3>Categorías</h3>
              <Bar
                data={{
                  labels: categoryData.map(cat => cat.name),
                  datasets: [{
                    label: 'Cantidad',
                    data: categoryData.map(cat => cat.count),
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.label}: ${context.raw}`;
                        }
                      }
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <h3>Grupos Demográficos</h3>
              <Bar
                data={{
                  labels: demographicGroupData.map(group => group.name),
                  datasets: [{
                    label: 'Cantidad',
                    data: demographicGroupData.map(group => group.count),
                    backgroundColor: 'rgba(153,102,255,0.2)',
                    borderColor: 'rgba(153,102,255,1)',
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.label}: ${context.raw}`;
                        }
                      }
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <h3>Categorías por Fecha</h3>
              <Line
                data={{
                  labels: dateLabels,
                  datasets: categoryDatasets
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.dataset.label}: ${context.raw}`;
                        }
                      }
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Grid para campos de búsqueda y filtros */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Buscar por comentario"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">Todas las categorías</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.nombre}>
                  {category.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Grupo Demográfico</InputLabel>
            <Select
              value={demographicGroupFilter}
              onChange={(e) => setDemographicGroupFilter(e.target.value)}
            >
              <MenuItem value="">Todos los grupos demográficos</MenuItem>
              {demographicGroups.map((group) => (
                <MenuItem key={group.id} value={group.nombre}>
                  {group.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Tabla con resultados filtrados */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Grupo Demográfico</TableCell>
              <TableCell>Comentario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record, index) => {
              const { date, time } = formatDateTime(record.date);
              return (
                <TableRow key={index}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{time}</TableCell>
                  <TableCell>{record.category}</TableCell>
                  <TableCell>{record.demographicGroup}</TableCell>
                  <TableCell>{record.comment}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RecordsPage;
