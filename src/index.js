import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Header from './Header';
import RecordsPage from './RecordsPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SupervisorReports from './SupervisorReports';
import SupervisorReportsPage from './SupervisorReportsPage';

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Header />
    <Router>
      <Routes>
        <Route path="/inicio" element={<App />} />
        <Route path="/registros" element={<RecordsPage />} />
        <Route path="/reporte" element={<SupervisorReports />} />
        <Route path="/registros_reporte" element={<SupervisorReportsPage />} />
      </Routes>
    </Router>
  </ThemeProvider>
);
