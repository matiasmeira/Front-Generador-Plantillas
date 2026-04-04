import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar sesión al cargar
        const userStored = localStorage.getItem('usuario');
        const tokenStored = localStorage.getItem('token');

        if (userStored && tokenStored) {
            try {
                setUsuario(JSON.parse(userStored));
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem('usuario');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('usuario', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUsuario(userData);
        toast.success(`¡Bienvenido, ${userData.nombre}!`, {
            position: "top-right",
            autoClose: 3000,
        });
    };

    const logout = () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        setUsuario(null);
        toast.info('Sesión cerrada correctamente', {
            position: "top-right",
            autoClose: 2000,
        });
    };

    const updateUser = (userData) => {
        localStorage.setItem('usuario', JSON.stringify(userData));
        setUsuario(userData);
    };

    const value = {
        usuario,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!usuario,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};