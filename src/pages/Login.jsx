import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nombre: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login
                const res = await api.post('/usuarios/login', {
                    username: formData.username,
                    password: formData.password
                });
                const { token, usuario } = res.data;
                login(usuario, token);
                navigate('/home');
            } else {
                // Registro
                await api.post('/usuarios', {
                    username: formData.username,
                    password: formData.password,
                    nombre: formData.nombre,
                    email: formData.email
                });
                toast.success('Usuario registrado exitosamente. Ahora puedes iniciar sesión.', {
                    position: "top-center",
                    autoClose: 4000,
                });
                setIsLogin(true);
                setFormData({ username: '', password: '', nombre: '', email: '' });
            }
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-sports-dark relative overflow-hidden font-sports"
            style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
            }}>

            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-4 border-sports-accent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-sports-accent"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <motion.form
                    onSubmit={handleSubmit}
                    className={`bg-sports-card rounded-3xl p-10 shadow-2xl border transition-all duration-300 ${error ? 'border-red-500 animate-shake' : 'border-sports-border'}`}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="inline-block bg-sports-accent/20 p-4 rounded-full mb-4 shadow-inner">
                            <span className="text-4xl block leading-none">⚽</span>
                        </div>
                        <h2 className="text-3xl font-black text-sports-text tracking-tighter uppercase">
                            {isLogin ? 'Acceder al' : 'Unirse al'} <br/>
                            <span className="text-sports-accent">Sistema</span>
                        </h2>
                    </motion.div>

                    {/* Campos del formulario */}
                    <motion.div
                        className="space-y-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {!isLogin && (
                            <motion.div
                                className="group"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <label className="text-xs font-bold text-sports-text-secondary uppercase tracking-widest ml-1 mb-1 block group-focus-within:text-sports-accent transition-colors">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Tu nombre completo"
                                    className="input-field w-full"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </motion.div>
                        )}

                        <motion.div
                            className="group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: isLogin ? 0.7 : 0.8 }}
                        >
                            <label className="text-xs font-bold text-sports-text-secondary uppercase tracking-widest ml-1 mb-1 block group-focus-within:text-sports-accent transition-colors">
                                Usuario
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="test"
                                className="input-field w-full"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </motion.div>

                        {!isLogin && (
                            <motion.div
                                className="group"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 }}
                            >
                                <label className="text-xs font-bold text-sports-text-secondary uppercase tracking-widest ml-1 mb-1 block group-focus-within:text-sports-accent transition-colors">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    className="input-field w-full"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </motion.div>
                        )}

                        <motion.div
                            className="group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: isLogin ? 0.8 : 1.0 }}
                        >
                            <label className="text-xs font-bold text-sports-text-secondary uppercase tracking-widest ml-1 mb-1 block group-focus-within:text-sports-accent transition-colors">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="test123"
                                className="input-field w-full"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </motion.div>
                    </motion.div>

                    {/* Botón de Acción */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-10 btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {isLogin ? 'Accediendo...' : 'Registrando...'}
                            </div>
                        ) : (
                            isLogin ? 'SALTAR AL CAMPO' : 'UNIRME AL EQUIPO'
                        )}
                    </motion.button>

                    {/* Toggle entre Login y Registro */}
                    <motion.div
                        className="text-center mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ username: '', password: '', nombre: '', email: '' });
                            }}
                            className="text-sports-text-secondary hover:text-sports-accent transition-colors text-sm"
                        >
                            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                        </button>
                    </motion.div>

                    {/* Acceso de Prueba */}
                    {isLogin && (
                        <motion.div
                            className="mt-8 pt-6 border-t border-sports-border"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                        >
                            <div className="bg-sports-darker rounded-2xl p-4 border border-dashed border-sports-border">
                                <p className="text-xs text-center text-sports-text-secondary font-bold mb-2 uppercase tracking-tighter">
                                    Acceso Rápido para Pruebas
                                </p>
                                <div className="flex justify-center gap-4 text-xs font-mono">
                                    <span className="text-sports-text-secondary">👤 <b>test</b></span>
                                    <span className="text-sports-text-secondary">🔑 <b>test123</b></span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.form>
            </motion.div>
        </div>
    );
};

export default Login;