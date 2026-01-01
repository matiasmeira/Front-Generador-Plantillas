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
    const [cargando, setCargando] = useState(true);
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
        setCargando(true);
        try {
            // Obtenemos los equipos para encontrar el actual y ver su dueño
            const resEq = await api.get('/equipos');
            const equipoEncontrado = resEq.data.find(e => e.id == id);
            setEquipo(equipoEncontrado);

            // Obtenemos la lista de jugadores
            const resJug = await api.get(`/jugadores/equipo/${id}`);
            setJugadores(resJug.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setCargando(false);
        }
    };

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

    if (cargando || !equipo) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-emerald-500 font-black animate-pulse tracking-widest text-2xl uppercase italic">Analizando Táctica...</div>
        </div>
    );

    const gestionActiva = puedeGestionar();

    return (
        <div className="min-h-screen bg-slate-50 pb-20 italic">
            {/* Header Moderno con Color Dinámico */}
            <div className="h-64 relative overflow-hidden flex items-end shadow-2xl transition-all duration-700" 
                 style={{ backgroundColor: equipo.colorPrincipal || '#1e293b' }}>
                
                {/* Texto decorativo de fondo */}
                <div className="absolute inset-0 bg-black/10 text-[180px] font-black opacity-10 select-none -bottom-16 -left-10 leading-none uppercase truncate">
                    {equipo.nombre}
                </div>

                <div className="max-w-7xl mx-auto w-full p-10 flex flex-col md:flex-row justify-between items-end relative z-10 text-white gap-6">
                    <div>
                        <Link to="/home" className="text-[10px] font-black bg-white/20 backdrop-blur-md px-5 py-2 rounded-full hover:bg-white hover:text-slate-900 transition-all uppercase tracking-[0.2em]">
                            ← Volver al Panel
                        </Link>
                        <h1 className="text-6xl font-black uppercase mt-4 tracking-tighter leading-none">{equipo.nombre}</h1>
                        <div className="flex items-center gap-3 mt-4">
                            <span className={`w-3 h-3 rounded-full ${gestionActiva ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                                {gestionActiva ? "Estratega: Modo Edición Habilitado" : "Modo Observador"}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={descargarPDF} 
                        className="bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black shadow-2xl hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all text-[11px] tracking-widest uppercase"
                    >
                        Generar Informe PDF
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto mt-[-40px] px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
                
                {/* Panel de Registro (Solo si tiene permisos) */}
                {gestionActiva && (
                    <section className="lg:col-span-4 bg-white p-10 rounded-[3rem] shadow-xl border border-white h-fit sticky top-28">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                                {editandoId ? 'Editar Ficha' : 'Fichar Jugador'}
                            </h3>
                            <div className="bg-slate-950 text-emerald-400 text-[10px] font-black px-4 py-2 rounded-xl italic">
                                {jugadores.length} / 22
                            </div>
                        </div>
                        
                        <form onSubmit={handleGuardar} className="space-y-4">
                            <div className="space-y-3">
                                <div className="group">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block group-focus-within:text-emerald-600">Nombre</label>
                                    <input className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all" value={nuevoJugador.nombre} onChange={e => setNuevoJugador({...nuevoJugador, nombre: e.target.value})} required />
                                </div>
                                <div className="group">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block group-focus-within:text-emerald-600">Apellido</label>
                                    <input className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all" value={nuevoJugador.apellido} onChange={e => setNuevoJugador({...nuevoJugador, apellido: e.target.value})} required />
                                </div>
                                <div className="group">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block group-focus-within:text-emerald-600">DNI / ID</label>
                                    <input className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-mono font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all" value={nuevoJugador.dni} onChange={e => setNuevoJugador({...nuevoJugador, dni: e.target.value})} required />
                                </div>
                                <div className="group">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block group-focus-within:text-emerald-600">Fecha Nacimiento</label>
                                    <input className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all" type="date" value={nuevoJugador.fechaNacimiento} onChange={e => setNuevoJugador({...nuevoJugador, fechaNacimiento: e.target.value})} required />
                                </div>
                            </div>

                            <button className={`w-full mt-4 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 ${editandoId ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white hover:bg-emerald-600'}`}>
                                {editandoId ? 'Actualizar Contrato' : 'Confirmar Ingreso'}
                            </button>
                            
                            {editandoId && (
                                <button type="button" onClick={() => {setEditandoId(null); setNuevoJugador({nombre:'', apellido:'', dni:'', fechaNacimiento:''})}} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Descartar Edición</button>
                            )}
                        </form>
                    </section>
                )}

                {/* Tabla de Jugadores */}
                <section className={`${gestionActiva ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-[3rem] shadow-xl border border-white overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="p-8 text-left">N° / Jugador</th>
                                    <th className="p-8 text-left">DNI</th>
                                    <th className="p-8 text-left">Edad</th>
                                    {gestionActiva && <th className="p-8 text-right">Acciones</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {jugadores.map((j, index) => (
                                    <tr key={j.id} className="group hover:bg-emerald-50/50 transition-all duration-300">
                                        <td className="p-8">
                                            <div className="flex items-center gap-5">
                                                <span className="text-slate-200 font-black text-3xl italic group-hover:text-emerald-200 transition-colors">
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </span>
                                                <div>
                                                    <div className="font-black text-slate-800 text-xl tracking-tighter uppercase leading-none italic">{j.apellido}</div>
                                                    <div className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest">{j.nombre}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <span className="text-[10px] font-mono font-black bg-slate-100 px-3 py-1.5 rounded-xl text-slate-500 group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-200">
                                                {j.dni}
                                            </span>
                                        </td>
                                        <td className="p-8">
                                            <div className="text-sm font-black text-slate-400 group-hover:text-slate-600 transition-colors">
                                                {new Date().getFullYear() - new Date(j.fechaNacimiento).getFullYear()} <span className="text-[10px] ml-1">AÑOS</span>
                                            </div>
                                        </td>
                                        {gestionActiva && (
                                            <td className="p-8 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button onClick={() => {setEditandoId(j.id); setNuevoJugador(j)}} className="w-11 h-11 flex items-center justify-center bg-amber-100 text-amber-600 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                                                        ✎
                                                    </button>
                                                    <button onClick={() => handleBorrar(j.id)} className="w-11 h-11 flex items-center justify-center bg-red-100 text-red-600 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                        🗑
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {jugadores.length === 0 && (
                        <div className="p-32 text-center">
                            <div className="text-slate-200 text-6xl mb-4 italic font-black">VACÍO</div>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs">Sin jugadores registrados en la plantilla</p>
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