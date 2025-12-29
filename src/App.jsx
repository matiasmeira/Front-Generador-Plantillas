import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import EquipoDetalle from './pages/EquipoDetalle';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentamos recuperar la sesión del localStorage al cargar la app
    const userStored = localStorage.getItem('usuario');
    if (userStored) {
      try {
        setUsuario(JSON.parse(userStored));
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage", error);
        localStorage.removeItem('usuario');
      }
    }
    setLoading(false);
  }, []);

  // Mientras verificamos el localStorage, no renderizamos nada para evitar parpadeos
  if (loading) return null;

  return (
    <Router>
      <Routes>
        {/* LOGIN: Si ya hay usuario, redirigimos al Home */}
        <Route 
          path="/login" 
          element={!usuario ? <Login setUsuario={setUsuario} /> : <Navigate to="/home" />} 
        />

        {/* HOME: Lista de todos los equipos. Pasamos usuario para saber quién es el dueño */}
        <Route 
          path="/home" 
          element={usuario ? <Home usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" />} 
        />

        {/* DETALLE: Gestión de jugadores. Pasamos usuario para los headers de seguridad del API */}
        <Route 
          path="/equipo/:id" 
          element={usuario ? <EquipoDetalle usuario={usuario} /> : <Navigate to="/login" />} 
        />

        {/* REDIRECCIÓN POR DEFECTO: Si no existe la ruta o no está logueado */}
        <Route path="*" element={<Navigate to={usuario ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;