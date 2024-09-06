import React, { useState, useEffect } from 'react';
import { Button, Container, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getFirestore, collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

function SupervisorReports() {
  const [formValues, setFormValues] = useState({
    supervisor: '',
    employee: '',
    report: ''
  });
  const [supervisors, setSupervisors] = useState([]);
  const [employees, setEmployees] = useState([]);

  const db = getFirestore();

  useEffect(() => {
    const fetchSupervisors = async () => {
      const querySnapshot = await getDocs(collection(db, "supervisores"));
      const fetchedSupervisors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Ordenar supervisores alfabéticamente
      fetchedSupervisors.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setSupervisors(fetchedSupervisors);
    };

    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(db, "empleados"));
      const fetchedEmployees = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Ordenar empleados alfabéticamente
      fetchedEmployees.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setEmployees(fetchedEmployees);
    };

    fetchSupervisors();
    fetchEmployees();
  }, [db]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveReport = async () => {
    if (!formValues.supervisor || !formValues.employee || !formValues.report) {
      alert("Por favor, completa todos los campos");
      return;
    }

    await addDoc(collection(db, "reportesSupervisores"), {
      supervisorId: formValues.supervisor,
      employeeId: formValues.employee,
      report: formValues.report,
      date: Timestamp.now() // Fecha y hora de Firebase
    });
    alert("Reporte registrado :D");

    // Limpiar los campos
    setFormValues({
      supervisor: '',
      employee: '',
      report: ''
    });
  };

  return (
    <Container maxWidth="md">
      <h2>Registrar Reporte del Supervisor</h2>
      <FormControl fullWidth sx={{ paddingBottom: '15px' }}>
        <InputLabel>Supervisor</InputLabel>
        <Select
          name="supervisor"
          value={formValues.supervisor}
          onChange={handleInputChange}
        >
          {supervisors.map(supervisor => (
            <MenuItem key={supervisor.id} value={supervisor.id}>
              {supervisor.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ paddingBottom: '15px' }}>
        <InputLabel>Empleado</InputLabel>
        <Select
          name="employee"
          value={formValues.employee}
          onChange={handleInputChange}
        >
          {employees.map(employee => (
            <MenuItem key={employee.id} value={employee.id}>
              {employee.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Reporte"
        name="report"
        value={formValues.report}
        onChange={handleInputChange}
        fullWidth
        multiline
        sx={{ paddingBottom: '15px' }}
      />

      <Button variant="contained" color="primary" onClick={saveReport}>
        Registrar Reporte
      </Button>
    </Container>
  );
}

export default SupervisorReports;
