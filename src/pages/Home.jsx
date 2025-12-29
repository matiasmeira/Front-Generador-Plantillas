import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Home = ({ usuario, setUsuario }) => {
    const [equipos, setEquipos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false); // Controla el formulario
    const [nuevoEquipo, setNuevoEquipo] = useState({ nombre: '', colorPrincipal: '#1e293b' });
    const navigate = useNavigate();

    useEffect(() => {
        obtenerEquipos();
    }, []);

    const obtenerEquipos = () => {
        api.get('/equipos')
            .then(res => setEquipos(res.data))
            .catch(err => console.error("Error al cargar equipos", err));
    };

    const handleCrearEquipo = (e) => {
        e.preventDefault();
        // Usamos el usuario.id de la sesión para asignar el dueño
        api.post(`/equipos?usuarioId=${usuario.id}`, nuevoEquipo)
            .then(() => {
                setMostrarModal(false);
                setNuevoEquipo({ nombre: '', colorPrincipal: '#1e293b' });
                obtenerEquipos(); // Recargamos la lista
            })
            .catch(err => alert("Error al crear equipo"));
    };

    const logout = () => {
        localStorage.removeItem('usuario');
        setUsuario(null);
        navigate('/login');
    };

    const tienePermiso = (equipo) => {
        return usuario.rol === 'ADMIN' || (equipo.usuarioDueno && equipo.usuarioDueno.id === usuario.id);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Nav Bar */}
            <nav className="bg-white border-b p-4 flex justify-between items-center px-10 shadow-sm sticky top-0 z-10">
                <h1 className="text-xl font-black uppercase tracking-tighter text-slate-800 italic">Plantillas PRO</h1>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase">
                        {usuario.nombre} • {usuario.rol}
                    </span>
                    <button onClick={logout} className="text-red-500 text-xs font-bold hover:underline">SALIR</button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-10">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900">Comunidad</h2>
                    {/* BOTÓN AHORA ACTIVA EL MODAL */}
                    <button 
                        onClick={() => setMostrarModal(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
                    >
                        + NUEVO EQUIPO
                    </button>
                </div>

                {/* Lista de Equipos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {equipos.map(eq => (
                        <div key={eq.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl shadow-inner border border-black/5" style={{backgroundColor: eq.colorPrincipal}}></div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono">#{eq.id}</span>
                            </div>
                            
                            <h3 className="text-2xl font-black text-slate-800 mb-1 uppercase tracking-tighter">{eq.nombre}</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase mb-8">DUEÑO: {eq.usuarioDueno?.nombre || 'SISTEMA'}</p>

                            <div className="flex gap-2">
                                <Link to={`/equipo/${eq.id}`} className="flex-1 bg-slate-100 text-center py-4 rounded-2xl font-black text-slate-600 text-[10px] hover:bg-slate-200 transition-all uppercase tracking-widest">
                                    Ver Plantilla
                                </Link>
                                
                                {tienePermiso(eq) && (
                                    <button className="px-6 bg-amber-100 text-amber-600 rounded-2xl font-black text-[10px] hover:bg-amber-200 transition-all uppercase tracking-widest">
                                        Editar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* --- MODAL DE CREACIÓN DE EQUIPO --- */}
            {mostrarModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Crear Nuevo Equipo</h3>
                            <button onClick={() => setMostrarModal(false)} className="text-slate-300 hover:text-slate-500 font-bold">✕</button>
                        </div>

                        <form onSubmit={handleCrearEquipo} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nombre del Equipo</label>
                                <input 
                                    autoFocus
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-200 outline-none" 
                                    placeholder="Ej: Los Galácticos FC"
                                    value={nuevoEquipo.nombre}
                                    onChange={e => setNuevoEquipo({...nuevoEquipo, nombre: e.target.value})}
                                    required 
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Color Principal</label>
                                <div className="flex gap-4 items-center">
                                    <input 
                                        type="color"
                                        className="h-14 w-20 p-1 bg-slate-50 rounded-xl border-none cursor-pointer"
                                        value={nuevoEquipo.colorPrincipal}
                                        onChange={e => setNuevoEquipo({...nuevoEquipo, colorPrincipal: e.target.value})}
                                    />
                                    <span className="text-xs font-mono font-bold text-slate-400">{nuevoEquipo.colorPrincipal.toUpperCase()}</span>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-blue-700 transition-all mt-4">
                                CREAR EQUIPO
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;