import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ListaEquipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [usuarioSesion] = useState({ id: 1, rol: 'USER' });

    useEffect(() => {
        const cargarEquipos = async () => {
            try {
                const res = await api.get('/equipos');
                setEquipos(res.data);
            } catch (error) {
                console.error("Error al cargar equipos", error);
            } finally {
                setCargando(false);
            }
        };
        cargarEquipos();
    }, []);

    const tienePermiso = (equipo) => {
        if (usuarioSesion.rol === 'ADMIN') return true;
        return equipo.usuarioDueno && equipo.usuarioDueno.id === usuarioSesion.id;
    };

    if (cargando) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-emerald-500 font-black animate-pulse tracking-widest text-2xl uppercase italic">Cargando Tácticas...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 pb-20 relative overflow-hidden" 
             style={{ backgroundImage: `radial-gradient(circle at 50% 0%, #064e3b 0%, #020617 70%)` }}>
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-center py-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Comunidad</h1>
                        <p className="text-emerald-400/60 font-bold uppercase text-xs tracking-[0.2em] mt-2">Explora las pizarras de la liga</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-black shadow-xl text-white tracking-widest uppercase">
                        Estado: <span className="text-emerald-400 ml-1">{usuarioSesion.rol}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 italic">
                    {equipos.map(equipo => (
                        <div key={equipo.id} className="bg-white rounded-[2.5rem] p-8 shadow-2xl transition-all hover:-translate-y-2 group relative overflow-hidden">
                            {/* Indicador lateral de color */}
                            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150" 
                                 style={{ backgroundColor: equipo.colorPrincipal || '#10b981' }} />
                            
                            <div className="w-14 h-14 rounded-2xl mb-6 shadow-lg border-4 border-white transform -rotate-3 group-hover:rotate-0 transition-transform" 
                                 style={{ backgroundColor: equipo.colorPrincipal || '#000' }} />
                            
                            <h2 className="text-3xl font-black text-slate-800 mb-2 leading-none">{equipo.nombre}</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 italic">DT: {equipo.usuarioDueno?.nombre || 'Anónimo'}</p>

                            <div className="flex gap-3">
                                <Link to={`/equipo/${equipo.id}`} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-center text-[10px] hover:bg-emerald-600 transition-colors uppercase tracking-widest shadow-lg">
                                    Ver Pizarra
                                </Link>
                                {tienePermiso(equipo) && (
                                    <Link to={`/equipo/editar/${equipo.id}`} className="bg-emerald-100 text-emerald-700 px-6 py-4 rounded-2xl font-black text-[10px] hover:bg-emerald-200 transition-colors uppercase tracking-widest">
                                        ✎
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListaEquipos;