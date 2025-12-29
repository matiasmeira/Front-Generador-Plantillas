import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ListaEquipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [cargando, setCargando] = useState(true);

    // --- SIMULACIÓN DE SESIÓN (En un futuro esto vendrá de un AuthContext) ---
    const [usuarioSesion] = useState({
        id: 1,       // Cambia este ID para probar si puedes editar tus equipos
        rol: 'USER'  // Prueba con 'ADMIN' para ver que puedes editar TODOS
    });

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

    // Función que replica la lógica del Backend
    const tienePermiso = (equipo) => {
        if (usuarioSesion.rol === 'ADMIN') return true;
        return equipo.usuarioDueno && equipo.usuarioDueno.id === usuarioSesion.id;
    };

    if (cargando) return <div className="text-center p-20 font-bold">Cargando equipos...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Comunidad de Equipos</h1>
                        <p className="text-slate-500 font-medium">Explora las plantillas creadas por otros usuarios</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold shadow-sm">
                        Sesión: <span className="text-blue-600">{usuarioSesion.rol}</span> (ID: {usuarioSesion.id})
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {equipos.map(equipo => (
                        <div key={equipo.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                            {/* Color del equipo */}
                            <div 
                                className="w-12 h-12 rounded-2xl mb-6 shadow-inner" 
                                style={{ backgroundColor: equipo.colorPrincipal || '#000' }}
                            />
                            
                            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase">{equipo.nombre}</h2>
                            
                            <div className="space-y-1 mb-8">
                                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Creado por:</p>
                                <p className="text-slate-700 font-semibold italic">
                                    {equipo.usuarioDueno ? equipo.usuarioDueno.nombre : 'Anónimo'}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Link 
                                    to={`/equipo/${equipo.id}`}
                                    className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-center text-xs hover:bg-slate-200 transition-colors"
                                >
                                    VER JUGADORES
                                </Link>

                                {tienePermiso(equipo) && (
                                    <Link 
                                        to={`/equipo/editar/${equipo.id}`}
                                        className="bg-amber-100 text-amber-600 px-6 py-4 rounded-2xl font-black text-xs hover:bg-amber-200 transition-colors"
                                    >
                                        EDITAR
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {equipos.length === 0 && (
                    <div className="text-center py-20 bg-slate-100 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold uppercase">No hay equipos registrados aún</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListaEquipos;