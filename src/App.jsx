import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import EquipoDetalle from './pages/EquipoDetalle';

function AppContent() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-sports-dark flex items-center justify-center">
        <div className="text-sports-accent font-black animate-pulse tracking-widest text-2xl uppercase italic">
          Cargando Sistema...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* LOGIN: Si ya hay usuario, redirigimos al Home */}
        <Route
          path="/login"
          element={!usuario ? <Login /> : <Navigate to="/home" />}
        />

        {/* HOME: Lista de todos los equipos. Pasamos usuario para saber quién es el dueño */}
        <Route
          path="/home"
          element={usuario ? <Home /> : <Navigate to="/login" />}
        />

        {/* DETALLE: Gestión de jugadores. Pasamos usuario para los headers de seguridad del API */}
        <Route
          path="/equipo/:id"
          element={usuario ? <EquipoDetalle /> : <Navigate to="/login" />}
        />

        {/* REDIRECCIÓN POR DEFECTO: Si no existe la ruta o no está logueado */}
        <Route path="*" element={<Navigate to={usuario ? "/home" : "/login"} />} />
      </Routes>

      {/* Toast Container Global */}
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;