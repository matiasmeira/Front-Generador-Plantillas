import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Componente Skeleton para equipos
const EquipoSkeleton = () => (
    <div className="bg-sports-card p-8 rounded-3xl border-2 border-sports-border shadow-sm animate-pulse">
        <div className="flex justify-between items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-sports-border"></div>
            <div className="w-12 h-4 bg-sports-border rounded"></div>
        </div>
        <div className="h-6 bg-sports-border rounded mb-1"></div>
        <div className="h-4 bg-sports-border rounded mb-8 w-3/4"></div>
        <div className="w-full h-12 bg-sports-border rounded-2xl"></div>
    </div>
);

const Home = () => {
    const [equipos, setEquipos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoEquipo, setNuevoEquipo] = useState({ nombre: '', colorPrincipal: '#10b981' });
    const [loading, setLoading] = useState(true);
    const [creandoEquipo, setCreandoEquipo] = useState(false);
    const { usuario, logout } = useAuth();

    useEffect(() => {
        obtenerEquipos();
    }, []);

    const obtenerEquipos = async () => {
        setLoading(true);
        try {
            const res = await api.get('/equipos');
            setEquipos(res.data);
        } catch (error) {
            toast.error('Error al cargar equipos');
            console.error("Error al obtener equipos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCrearEquipo = async (e) => {
        e.preventDefault();
        setCreandoEquipo(true);

        try {
            await api.post(`/equipos?usuarioId=${usuario.id}`, nuevoEquipo);
            setMostrarModal(false);
            setNuevoEquipo({ nombre: '', colorPrincipal: '#10b981' });
            await obtenerEquipos();
            toast.success('Equipo creado exitosamente!');
        } catch (error) {
            toast.error(error.message || 'Error al crear equipo');
        } finally {
            setCreandoEquipo(false);
        }
    };

    // LÓGICA DE FILTRADO
    const misEquipos = equipos.filter(eq => eq.usuarioDueno?.id === usuario.id);
    const otrosEquipos = equipos.filter(eq => eq.usuarioDueno?.id !== usuario.id);

    return (
        <div className="min-h-screen bg-sports-dark italic font-sports">
            {/* NAVBAR */}
            <motion.nav
                className="bg-sports-darker p-6 flex justify-between items-center px-10 shadow-2xl sticky top-0 z-50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-black text-sports-text tracking-tighter italic uppercase">
                    TEAM <span className="text-sports-accent font-normal">GEN</span>
                </h1>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-xs text-sports-accent font-black leading-none uppercase tracking-tighter">
                            {usuario.rol}
                        </p>
                        <p className="text-sports-text font-bold text-sm tracking-tight">
                            {usuario.nombre}
                        </p>
                    </div>
                    <motion.button
                        onClick={logout}
                        className="w-10 h-10 flex items-center justify-center bg-sports-card rounded-xl hover:bg-red-500/20 text-red-400 transition-all font-bold"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        ✕
                    </motion.button>
                </div>
            </motion.nav>

            <main className="max-w-6xl mx-auto p-10">
                {/* CABECERA */}
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div>
                        <h2 className="text-5xl font-black uppercase text-sports-text tracking-tighter italic">Panel de Gestión</h2>
                        <div className="h-2 w-20 bg-sports-accent rounded-full mt-2"></div>
                    </div>
                    <motion.button
                        onClick={() => setMostrarModal(true)}
                        className="btn-primary text-xs uppercase tracking-widest"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        + Registrar Nuevo Team
                    </motion.button>
                </motion.div>

                {/* SECCIÓN: MIS EQUIPOS */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="text-xl font-black text-sports-text-secondary uppercase mb-6 tracking-widest flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-sports-accent"></span> Mis Equipos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <EquipoSkeleton />
                                </motion.div>
                            ))
                        ) : misEquipos.length > 0 ? misEquipos.map((eq, index) => (
                            <motion.div
                                key={eq.id}
                                className="card p-8 rounded-3xl border-2 border-sports-accent/20 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="absolute top-0 right-0 bg-sports-accent text-sports-dark text-xs font-black px-4 py-1 rounded-bl-xl uppercase">Dueño</div>
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-14 h-14 rounded-2xl shadow-lg border-2 border-sports-border" style={{backgroundColor: eq.colorPrincipal}}></div>
                                    <span className="text-xs font-black text-sports-text-secondary font-mono tracking-widest">ID {eq.id}</span>
                                </div>
                                <h3 className="text-2xl font-black text-sports-text mb-1 uppercase tracking-tighter">{eq.nombre}</h3>
                                <p className="text-sports-text-secondary text-xs font-black uppercase mb-8 italic">Manager: {eq.usuarioDueno?.username || 'SISTEMA'}</p>
                                <Link to={`/equipo/${eq.id}`} className="block w-full btn-primary text-xs hover:bg-sports-accent-dark transition-all uppercase tracking-widest shadow-lg shadow-sports-accent/20">
                                    Administrar Plantilla
                                </Link>
                            </motion.div>
                        )) : (
                            <motion.div
                                className="col-span-full p-10 border-2 border-dashed border-sports-border rounded-3xl text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p className="text-sports-text-secondary font-bold">Aún no has creado ningún equipo.</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* SECCIÓN: TODOS LOS EQUIPOS */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3 className="text-xl font-black text-sports-text-secondary uppercase mb-6 tracking-widest flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-sports-border"></span> Explorar Liga
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 + 0.3 }}
                                >
                                    <EquipoSkeleton />
                                </motion.div>
                            ))
                        ) : otrosEquipos.length > 0 ? otrosEquipos.map((eq, index) => (
                            <motion.div
                                key={eq.id}
                                className="card p-8 rounded-3xl border border-sports-border shadow-sm hover:shadow-lg transition-all group opacity-80 hover:opacity-100 cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-14 h-14 rounded-2xl shadow-md border-2 border-sports-border" style={{backgroundColor: eq.colorPrincipal}}></div>
                                    <span className="text-xs font-black text-sports-text-secondary font-mono tracking-widest">ID {eq.id}</span>
                                </div>
                                <h3 className="text-2xl font-black text-sports-text mb-1 uppercase tracking-tighter">{eq.nombre}</h3>
                                <p className="text-sports-text-secondary text-xs font-black uppercase mb-8 italic">Manager: {eq.usuarioDueno?.username || 'SISTEMA'}</p>
                                <Link to={`/equipo/${eq.id}`} className="block w-full btn-secondary text-xs hover:bg-sports-border hover:text-sports-text transition-all uppercase tracking-widest">
                                    Ver Detalles
                                </Link>
                            </motion.div>
                        )) : (
                            <p className="text-sports-text-secondary italic px-4 text-sm">No hay otros equipos registrados.</p>
                        )}
                    </div>
                </motion.div>
            </main>

            {/* MODAL PARA CREAR EQUIPO */}
            {mostrarModal && (
                <motion.div
                    className="fixed inset-0 bg-sports-dark/80 backdrop-blur-md flex items-center justify-center p-6 z-[100]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-sports-card w-full max-w-md p-10 rounded-3xl shadow-2xl relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 25 }}
                    >
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-center mb-8 italic">
                            Nuevo <span className="text-sports-accent">Equipo</span>
                        </h3>
                        <form onSubmit={handleCrearEquipo} className="space-y-6">
                            <div>
                                <label className="text-xs font-black text-sports-text-secondary uppercase tracking-widest ml-2 mb-1 block">Nombre Oficial</label>
                                <input
                                    className="input-field"
                                    value={nuevoEquipo.nombre}
                                    onChange={e => setNuevoEquipo({...nuevoEquipo, nombre: e.target.value})}
                                    required
                                    placeholder="Ej. Real Madrid FC"
                                    disabled={creandoEquipo}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-black text-sports-text-secondary uppercase tracking-widest ml-2 mb-1 block">Color de Identidad</label>
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="color"
                                        className="h-16 w-24 p-1 bg-sports-dark border-2 border-sports-border rounded-2xl cursor-pointer"
                                        value={nuevoEquipo.colorPrincipal}
                                        onChange={e => setNuevoEquipo({...nuevoEquipo, colorPrincipal: e.target.value})}
                                        disabled={creandoEquipo}
                                    />
                                    <span className="font-mono font-black text-sports-text-secondary text-sm tracking-tighter">
                                        {nuevoEquipo.colorPrincipal.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setMostrarModal(false)}
                                    className="flex-1 py-4 font-black text-xs text-sports-text-secondary uppercase tracking-widest hover:text-sports-text transition-colors"
                                    disabled={creandoEquipo}
                                >
                                    Cancelar
                                </button>
                                <motion.button
                                    type="submit"
                                    className="flex-2 btn-primary text-xs tracking-widest uppercase"
                                    disabled={creandoEquipo}
                                    whileHover={{ scale: creandoEquipo ? 1 : 1.02 }}
                                    whileTap={{ scale: creandoEquipo ? 1 : 0.98 }}
                                >
                                    {creandoEquipo ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creando...
                                        </div>
                                    ) : (
                                        'Confirmar Registro'
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Home;