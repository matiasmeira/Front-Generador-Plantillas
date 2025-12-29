import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import PlantillaPreview from '../components/PlantillaPreview';

const EquipoDetalle = ({ usuario }) => {
    const { id } = useParams();
    const [equipo, setEquipo] = useState(null);
    const [jugadores, setJugadores] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [nuevoJugador, setNuevoJugador] = useState({ 
        nombre: '', apellido: '', dni: '', fechaNacimiento: '' 
    });
    const plantillaRef = useRef();

    // Headers para las peticiones protegidas del Backend
    const config = {
        headers: {
            'X-User-Id': usuario.id,
            'X-User-Role': usuario.rol
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, [id]);

    const obtenerDatos = async () => {
        try {
            // Obtenemos todos los equipos para encontrar el actual y ver su dueño
            const resEq = await api.get('/equipos');
            const equipoEncontrado = resEq.data.find(e => e.id == id);
            setEquipo(equipoEncontrado);

            // Obtenemos la lista de jugadores
            const resJug = await api.get(`/jugadores/equipo/${id}`);
            setJugadores(resJug.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    // Lógica de permisos para la UI
    const puedeGestionar = () => {
        if (!equipo || !usuario) return false;
        return usuario.rol === 'ADMIN' || (equipo.usuarioDueno && equipo.usuarioDueno.id === usuario.id);
    };

    const handleGuardar = (e) => {
        e.preventDefault();
        const peticion = editandoId 
            ? api.put(`/jugadores/${editandoId}`, nuevoJugador, config) 
            : api.post(`/jugadores?equipoId=${id}`, nuevoJugador, config);

        peticion.then(() => {
            setEditandoId(null);
            setNuevoJugador({ nombre: '', apellido: '', dni: '', fechaNacimiento: '' });
            obtenerDatos();
        }).catch(err => {
            alert(err.response?.data || "No tienes permisos para esta acción");
        });
    };

    const handleBorrar = (jId) => {
        if (window.confirm("¿Estás seguro de eliminar a este jugador?")) {
            api.delete(`/jugadores/${jId}`, config)
                .then(() => obtenerDatos())
                .catch(err => alert("Error al borrar"));
        }
    };

    const descargarPDF = async () => {
        const elemento = plantillaRef.current;
        if (!elemento) return;
        try {
            const canvas = await html2canvas(elemento, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Plantilla-${equipo.nombre}.pdf`);
        } catch (error) { console.error(error); }
    };

    if (!equipo) return <div className="p-20 text-center font-black animate-pulse">CARGANDO...</div>;

    const gestionActiva = puedeGestionar();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Cabecera Dinámica */}
            <div className="h-44 flex items-end p-8 transition-colors duration-700 shadow-inner" 
                 style={{ backgroundColor: equipo.colorPrincipal || '#1e293b' }}>
                <div className="max-w-6xl mx-auto w-full flex justify-between items-center text-white">
                    <div>
                        <Link to="/home" className="text-[10px] font-black bg-black/20 px-3 py-1 rounded-full hover:bg-black/40 transition-all uppercase tracking-widest">← Volver</Link>
                        <h1 className="text-5xl font-black uppercase mt-2 tracking-tighter">{equipo.nombre}</h1>
                        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">
                            {gestionActiva ? "🟢 Modo Editor Habilitado" : "⚪ Modo Solo Lectura"}
                        </p>
                    </div>
                    <button 
                        onClick={descargarPDF}
                        className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-xs"
                    >
                        DESCARGAR PDF
                    </button>
                </div>
            </div>

            <main className="max-w-6xl mx-auto mt-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Formulario: Solo aparece si eres Dueño o Admin */}
                {gestionActiva && (
                    <section className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 h-fit sticky top-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black uppercase tracking-tighter">
                                {editandoId ? 'Editar Jugador' : 'Nuevo Ingreso'}
                            </h3>
                            <span className="text-[10px] font-black px-3 py-1 bg-slate-100 rounded-full text-slate-400">
                                {jugadores.length}/22
                            </span>
                        </div>
                        
                        <form onSubmit={handleGuardar} className="space-y-4">
                            <div className="space-y-3">
                                <input className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-slate-200 outline-none" placeholder="Nombre" value={nuevoJugador.nombre} onChange={e => setNuevoJugador({...nuevoJugador, nombre: e.target.value})} required />
                                <input className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-slate-200 outline-none" placeholder="Apellido" value={nuevoJugador.apellido} onChange={e => setNuevoJugador({...nuevoJugador, apellido: e.target.value})} required />
                                <input className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-slate-200 outline-none font-mono" placeholder="DNI" value={nuevoJugador.dni} onChange={e => setNuevoJugador({...nuevoJugador, dni: e.target.value})} required />
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 ml-2 uppercase tracking-widest">Fecha Nacimiento</label>
                                    <input className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-slate-200 outline-none" type="date" value={nuevoJugador.fechaNacimiento} onChange={e => setNuevoJugador({...nuevoJugador, fechaNacimiento: e.target.value})} required />
                                </div>
                            </div>

                            <button className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${editandoId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-slate-800'} text-white`}>
                                {editandoId ? 'Actualizar Datos' : 'Registrar Jugador'}
                            </button>
                            
                            {editandoId && (
                                <button type="button" onClick={() => {setEditandoId(null); setNuevoJugador({nombre:'', apellido:'', dni:'', fechaNacimiento:''})}} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Cancelar Edición</button>
                            )}
                        </form>
                    </section>
                )}

                {/* Tabla: Se expande si no hay formulario */}
                <section className={`${gestionActiva ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden transition-all duration-500`}>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                <th className="p-7">Jugador</th>
                                <th className="p-7">Identificación</th>
                                <th className="p-7">F. Nacimiento</th>
                                {gestionActiva && <th className="p-7 text-right">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {jugadores.map(j => (
                                <tr key={j.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="p-7">
                                        <div className="font-bold text-slate-800 text-lg tracking-tight leading-none">{j.apellido.toUpperCase()}, <span className="text-slate-500 font-medium">{j.nombre}</span></div>
                                    </td>
                                    <td className="p-7">
                                        <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-mono font-bold text-slate-600">{j.dni}</span>
                                    </td>
                                    <td className="p-7 text-sm font-bold text-slate-400">
                                        {new Date(j.fechaNacimiento).toLocaleDateString('es-AR')}
                                    </td>
                                    
                                    {gestionActiva && (
                                        <td className="p-7 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => {setEditandoId(j.id); setNuevoJugador(j)}} className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-all">✎</button>
                                                <button onClick={() => handleBorrar(j.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all">🗑</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {jugadores.length === 0 && (
                        <div className="p-24 text-center">
                            <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-xs italic">La plantilla está vacía</p>
                        </div>
                    )}
                </section>
            </main>

            {/* AREA OCULTA PARA PDF */}
            <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
                <PlantillaPreview equipo={equipo} jugadores={jugadores} reference={plantillaRef} />
            </div>
        </div>
    );
};

export default EquipoDetalle;