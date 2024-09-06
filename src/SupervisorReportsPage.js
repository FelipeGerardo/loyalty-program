import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container,
  TextField, MenuItem, Select, InputLabel, FormControl, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const SupervisorReports = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [supervisorFilter, setSupervisorFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [supervisors, setSupervisors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false); // State for modal open/close

  useEffect(() => {
    const fetchRecords = async () => {
      const db = getFirestore();
      const recordsCollection = collection(db, 'reportesSupervisores');
      const recordsSnapshot = await getDocs(recordsCollection);
      const recordsList = recordsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecords(recordsList);
    };

    const fetchSupervisors = async () => {
      const db = getFirestore();
      const supervisorsCollection = collection(db, 'supervisores');
      const supervisorsSnapshot = await getDocs(supervisorsCollection);
      const fetchedSupervisors = supervisorsSnapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre,
      }));
      setSupervisors(fetchedSupervisors);
    };

    const fetchEmployees = async () => {
      const db = getFirestore();
      const employeesCollection = collection(db, 'empleados');
      const employeesSnapshot = await getDocs(employeesCollection);
      const fetchedEmployees = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre,
      }));
      setEmployees(fetchedEmployees);
    };

    fetchRecords();
    fetchSupervisors();
    fetchEmployees();
  }, []);

  const formatDateTime = (timestamp) => {
    const date = timestamp.toDate();
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return { date: formattedDate, time: formattedTime };
  };

  const filteredRecords = records.filter((record) => {
    return (
      (!supervisorFilter || record.supervisorId === supervisorFilter) &&
      (!employeeFilter || record.employeeId === employeeFilter) &&
      record.report.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const supervisorData = supervisors.map(sup => ({
    name: sup.nombre,
    count: records.filter(r => r.supervisorId === sup.id).length
  }));

  const employeeData = employees.map(emp => ({
    name: emp.nombre,
    count: records.filter(r => r.employeeId === emp.id).length
  }));

  const dateGroupedRecords = records.reduce((acc, record) => {
    const { date } = formatDateTime(record.date);
    if (!acc[date]) {
      acc[date] = {};
    }
    if (!acc[date][record.supervisorId]) {
      acc[date][record.supervisorId] = 0;
    }
    acc[date][record.supervisorId]++;
    return acc;
  }, {});

  const dateLabels = Object.keys(dateGroupedRecords);
  const supervisorDatasets = supervisors.map(sup => ({
    label: sup.nombre,
    data: dateLabels.map(date => dateGroupedRecords[date][sup.id] || 0),
    borderColor: 'rgba(75,192,192,1)',
    backgroundColor: 'rgba(75,192,192,0.2)',
    fill: false
  }));

  return (
    <Container maxWidth="lg">
      <h1>Reportes de Supervisores</h1>

      {/* Botón para abrir el modal */}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ marginBottom: 2 }}>
        Ver Resumen
      </Button>

      {/* Modal con gráficos */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Resumen de Supervisores y Empleados</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <h3>Supervisores</h3>
              <Bar
                data={{
                  labels: supervisorData.map(sup => sup.name),
                  datasets: [{
                    label: 'Cantidad',
                    data: supervisorData.map(sup => sup.count),
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
              <h3>Empleados</h3>
              <Bar
                data={{
                  labels: employeeData.map(emp => emp.name),
                  datasets: [{
                    label: 'Cantidad',
                    data: employeeData.map(emp => emp.count),
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
              <h3>Supervisores por Fecha</h3>
              <Line
                data={{
                  labels: dateLabels,
                  datasets: supervisorDatasets
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
            label="Buscar por reporte"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Supervisor</InputLabel>
            <Select
              value={supervisorFilter}
              onChange={(e) => setSupervisorFilter(e.target.value)}
            >
              <MenuItem value="">Todos los supervisores</MenuItem>
              {supervisors.map((supervisor) => (
                <MenuItem key={supervisor.id} value={supervisor.id}>
                  {supervisor.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Empleado</InputLabel>
            <Select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
            >
              <MenuItem value="">Todos los empleados</MenuItem>
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.nombre}
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
              <TableCell>Supervisor</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Reporte</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record, index) => {
              const { date, time } = formatDateTime(record.date);
              return (
                <TableRow key={index}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{time}</TableCell>
                  <TableCell>{supervisors.find(s => s.id === record.supervisorId)?.nombre}</TableCell>
                  <TableCell>{employees.find(e => e.id === record.employeeId)?.nombre}</TableCell>
                  <TableCell>{record.report}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SupervisorReports;
