import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Cambiado 'Switch' por 'Routes'
import App from './App';
import Header from './Header';
import RecordsPage from './RecordsPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Header />
    <Router basename="/loyalty-program">
      <Routes>
        <Route path="/inicio" element={<App />} />          {/* Cambiado 'component' por 'element' */}
        <Route path="/registros" element={<RecordsPage />} /> {/* Cambiado 'component' por 'element' */}
        {/* otras rutas */}
      </Routes>
    </Router>
  </ThemeProvider>
);
