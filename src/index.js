import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Cambia BrowserRouter por HashRouter
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
    <Router>
      <Routes>
        <Route path="/inicio" element={<App />} />
        <Route path="/registros" element={<RecordsPage />} />
        {/* otras rutas */}
      </Routes>
    </Router>
  </ThemeProvider>
);
