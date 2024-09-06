import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Header from './Header';
import RecordsPage from './RecordsPage'; // Importa la nueva página para los registros
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Header />
    <Router>
      <Routes>
        <Route path="/loyalty-program/inicio" element={<App />} /> {/* Página principal (registro de sugerencias) */}
        <Route path="/loyalty-program/registros" element={<RecordsPage />} /> {/* Página para ver registros */}
      </Routes>
    </Router>
  </ThemeProvider>
);
