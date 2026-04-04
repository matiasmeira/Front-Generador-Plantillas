import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 10000, // 10 segundos timeout
});

// Función para obtener usuario del localStorage de forma segura
const getStoredUser = () => {
    try {
        const user = localStorage.getItem('usuario');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

// Interceptor para agregar headers automáticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const user = getStoredUser();

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Agregar headers de usuario para endpoints protegidos
        if (user && config.method !== 'get') {
            config.headers['X-User-Id'] = user.id;
            config.headers['X-User-Role'] = user.rol;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de respuesta mejorado
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response) {
            // Manejo específico de errores
            switch (response.status) {
                case 400:
                    // Error de validación
                    throw new Error(response.data?.message || 'Datos inválidos');
                case 401:
                    // Token expirado o inválido
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                    window.location.href = '/login';
                    throw new Error('Sesión expirada. Redirigiendo al login...');
                case 403:
                    throw new Error('No tienes permisos para esta acción');
                case 404:
                    throw new Error('Recurso no encontrado');
                case 409:
                    // Conflicto - útil para límite de jugadores
                    throw new Error(response.data?.message || 'Conflicto en la operación');
                case 500:
                    throw new Error('Error interno del servidor');
                default:
                    throw new Error(response.data?.message || 'Error desconocido');
            }
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Tiempo de espera agotado. Verifica tu conexión.');
        } else {
            throw new Error('Error de conexión. Verifica tu conexión a internet.');
        }
    }
);

export default api;