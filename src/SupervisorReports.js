import React, { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { TextField, Select, MenuItem, Button } from '@mui/material';

const SupervisorReports = () => {
  const [supervisores, setSupervisores] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [reporte, setReporte] = useState('');
  const db = getFirestore();
  // Fetch supervisores
  useEffect(() => {
    const fetchSupervisores = async () => {
      const supervisoresCollection = collection(db, 'supervisores');
      const supervisorSnapshot = await getDocs(supervisoresCollection);
      const supervisorList = supervisorSnapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
      }));
      setSupervisores(supervisorList);
    };
    fetchSupervisores();
  }, []);

  // Fetch empleados
  useEffect(() => {
    const fetchEmpleados = async () => {
      const empleadosCollection = collection(db, 'empleados');
      const empleadoSnapshot = await getDocs(empleadosCollection);
      const empleadoList = empleadoSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmpleados(empleadoList);
    };
    fetchEmpleados();
  }, []);

  // Guardar reporte
  const handleSubmit = async () => {
    if (!selectedSupervisor || !selectedEmpleado || !reporte) {
      alert('Por favor, completa todos los campos');
      return;
    }

    await addDoc(collection(db, 'reportesSupervisores'), {
      supervisorId: selectedSupervisor,
      empleadoId: selectedEmpleado,
      reporte: reporte,
      fecha: Timestamp.now()
    });

    // Limpiar los campos
    setSelectedSupervisor('');
    setSelectedEmpleado('');
    setReporte('');
  };

  return (
    <div>
      <Select
        value={selectedSupervisor}
        onChange={(e) => setSelectedSupervisor(e.target.value)}
        displayEmpty
      >
        <MenuItem value="" disabled>Seleccionar Supervisor</MenuItem>
        {supervisores.map(supervisor => (
          <MenuItem key={supervisor.id} value={supervisor.id}>
            {supervisor.nombre}
          </MenuItem>
        ))}
      </Select>

      <Select
        value={selectedEmpleado}
        onChange={(e) => setSelectedEmpleado(e.target.value)}
        displayEmpty
      >
        <MenuItem value="" disabled>Seleccionar Empleado</MenuItem>
        {empleados.map(empleado => (
          <MenuItem key={empleado.id} value={empleado.id}>
            {empleado.nombre}
          </MenuItem>
        ))}
      </Select>

      <TextField
        label="Reporte"
        value={reporte}
        onChange={(e) => setReporte(e.target.value)}
        multiline
        rows={4}
      />

      <Button onClick={handleSubmit}>Enviar Reporte</Button>
    </div>
  );
};

export default SupervisorReports;
