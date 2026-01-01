import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Home = ({ usuario, setUsuario }) => {
    const [equipos, setEquipos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoEquipo, setNuevoEquipo] = useState({ nombre: '', colorPrincipal: '#10b981' });
    const navigate = useNavigate();

    useEffect(() => { obtenerEquipos(); }, []);

    const obtenerEquipos = () => {
        api.get('/equipos')
            .then(res => setEquipos(res.data))
            .catch(err => console.error(err));
    };

    const handleCrearEquipo = (e) => {
        e.preventDefault();
        api.post(`/equipos?usuarioId=${usuario.id}`, nuevoEquipo)
            .then(() => {
                setMostrarModal(false);
                setNuevoEquipo({ nombre: '', colorPrincipal: '#10b981' });
                obtenerEquipos();
            })
            .catch(() => alert("Error al crear equipo"));
    };

    const logout = () => {
        localStorage.removeItem('usuario');
        setUsuario(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 italic">
            <nav className="bg-slate-950 p-6 flex justify-between items-center px-10 shadow-2xl sticky top-0 z-50">
                <h1 className="text-2xl font-black text-white tracking-tighter italic uppercase">TEAM <span className="text-emerald-500 font-normal">GEN</span></h1>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] text-emerald-500 font-black leading-none uppercase tracking-tighter">{usuario.rol}</p>
                        <p className="text-white font-bold text-sm tracking-tight">{usuario.nombre}</p>
                    </div>
                    <button onClick={logout} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-red-500/20 text-red-400 transition-all font-bold">✕</button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-5xl font-black uppercase text-slate-900 tracking-tighter italic">Mis Equipos</h2>
                        <div className="h-2 w-20 bg-emerald-500 rounded-full mt-2"></div>
                    </div>
                    <button onClick={() => setMostrarModal(true)} className="bg-emerald-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                        + Registrar Nuevo Team
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {equipos.map(eq => (
                        <div key={eq.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group">
                             <div className="flex justify-between items-center mb-6">
                                <div className="w-14 h-14 rounded-2xl shadow-lg border-2 border-slate-50" style={{backgroundColor: eq.colorPrincipal}}></div>
                                <span className="text-[10px] font-black text-slate-300 font-mono tracking-widest">ID {eq.id}</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-1 uppercase tracking-tighter">{eq.nombre}</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase mb-8 italic">Manager: {eq.usuarioDueno?.nombre || 'SISTEMA'}</p>
                            <Link to={`/equipo/${eq.id}`} className="block w-full bg-slate-100 text-center py-4 rounded-2xl font-black text-slate-600 text-[10px] hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest">
                                Abrir Gestión
                            </Link>
                        </div>
                    ))}
                </div>
            </main>

            {/* MODAL REDISEÑADO */}
            {mostrarModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-center mb-8 italic">Nuevo <span className="text-emerald-600">Equipo</span></h3>
                        <form onSubmit={handleCrearEquipo} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Nombre Oficial</label>
                                <input className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold" value={nuevoEquipo.nombre} onChange={e => setNuevoEquipo({...nuevoEquipo, nombre: e.target.value})} required placeholder="Ej. Real Madrid FC" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Color de Identidad</label>
                                <div className="flex gap-4 items-center">
                                    <input type="color" className="h-16 w-24 p-1 bg-white border-2 border-slate-100 rounded-2xl cursor-pointer" value={nuevoEquipo.colorPrincipal} onChange={e => setNuevoEquipo({...nuevoEquipo, colorPrincipal: e.target.value})} />
                                    <span className="font-mono font-black text-slate-400 text-sm tracking-tighter">{nuevoEquipo.colorPrincipal.toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setMostrarModal(false)} className="flex-1 py-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Cancelar</button>
                                <button className="flex-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] shadow-lg shadow-emerald-200 uppercase tracking-widest">Crear Ahora</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;