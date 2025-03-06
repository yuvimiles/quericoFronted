import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import AppNavbar from './components/Navbar'; 
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar /> 
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;