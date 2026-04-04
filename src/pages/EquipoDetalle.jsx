import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import PlantillaPreview from '../components/PlantillaPreview';
import CanchaView from '../components/CanchaView';

// Componente Skeleton para carga
const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="h-64 bg-sports-border rounded-3xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 h-96 bg-sports-card rounded-3xl"></div>
            <div className="lg:col-span-8 h-96 bg-sports-card rounded-3xl"></div>
        </div>
    </div>
);

const EquipoDetalle = () => {
    const { id } = useParams();
    const [equipo, setEquipo] = useState(null);
    const [jugadores, setJugadores] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [nuevoJugador, setNuevoJugador] = useState({
        nombre: '', apellido: '', dni: '', fechaNacimiento: ''
    });
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [vistaCancha, setVistaCancha] = useState(true);
    const plantillaRef = useRef();
    const { usuario } = useAuth();

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
            toast.error('Error al cargar los datos del equipo');
            console.error("Error cargando datos:", error);
        } finally {
            setCargando(false);
        }
    };

    const puedeGestionar = () => {
        if (!equipo || !usuario) return false;
        return usuario.rol === 'ADMIN' || (equipo.usuarioDueno && equipo.usuarioDueno.id === usuario.id);
    };

    const validarLimiteJugadores = () => {
        if (jugadores.length >= 22) {
            toast.warning('El equipo ya tiene el máximo de 22 jugadores permitido');
            return false;
        }
        return true;
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        if (!validarLimiteJugadores() && !editandoId) return;

        setGuardando(true);
        try {
            const peticion = editandoId
                ? api.put(`/jugadores/${editandoId}`, nuevoJugador, config)
                : api.post(`/jugadores?equipoId=${id}`, nuevoJugador, config);

            await peticion;
            setEditandoId(null);
            setNuevoJugador({ nombre: '', apellido: '', dni: '', fechaNacimiento: '' });
            await obtenerDatos();
            toast.success(editandoId ? 'Jugador actualizado exitosamente' : 'Jugador agregado exitosamente');
        } catch (error) {
            toast.error(error.message || 'Error al guardar el jugador');
        } finally {
            setGuardando(false);
        }
    };

    const handleBorrar = async (jId) => {
        if (!window.confirm("¿Estás seguro de eliminar a este jugador?")) return;

        try {
            await api.delete(`/jugadores/${jId}`, config);
            await obtenerDatos();
            toast.success('Jugador eliminado exitosamente');
        } catch (error) {
            toast.error('Error al eliminar el jugador');
        }
    };

    const descargarPDF = async () => {
        const elemento = plantillaRef.current;
        if (!elemento) return;

        try {
            toast.info('Generando PDF...');
            const canvas = await html2canvas(elemento, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                width: 794,
                height: 1123,
                scrollY: -window.scrollY
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
            pdf.save(`Planilla_Oficial_${equipo.nombre}.pdf`);
            toast.success('PDF generado exitosamente');
        } catch (error) {
            console.error("Error al generar PDF:", error);
            toast.error('Error al generar el PDF');
        }
    };

    if (cargando || !equipo) {
        return (
            <div className="min-h-screen bg-sports-dark flex items-center justify-center">
                <SkeletonLoader />
            </div>
        );
    }

    const gestionActiva = puedeGestionar();

    return (
        <div className="min-h-screen bg-sports-dark pb-20 font-sports">
            {/* Header Moderno con Color Dinámico */}
            <motion.div
                className="h-64 relative overflow-hidden flex items-end shadow-2xl"
                style={{ backgroundColor: equipo.colorPrincipal || '#1e293b' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Texto decorativo de fondo */}
                <div className="absolute inset-0 bg-black/10 text-[180px] font-black opacity-10 select-none -bottom-16 -left-10 leading-none uppercase truncate">
                    {equipo.nombre}
                </div>

                <div className="max-w-7xl mx-auto w-full p-10 flex flex-col md:flex-row justify-between items-end relative z-10 text-white gap-6">
                    <div>
                        <Link to="/home" className="text-xs font-black bg-white/20 backdrop-blur-md px-5 py-2 rounded-full hover:bg-white hover:text-slate-900 transition-all uppercase tracking-[0.2em] inline-block mb-4">
                            ← Volver al Panel
                        </Link>
                        <h1 className="text-6xl font-black uppercase mt-4 tracking-tighter leading-none">{equipo.nombre}</h1>
                        <div className="flex items-center gap-3 mt-4">
                            <span className={`w-3 h-3 rounded-full ${gestionActiva ? 'bg-sports-accent animate-pulse' : 'bg-slate-400'}`}></span>
                            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80">
                                {gestionActiva ? "Estratega: Modo Edición Habilitado" : "Modo Observador"}
                            </p>
                        </div>
                    </div>
                    <motion.button
                        onClick={descargarPDF}
                        className="bg-sports-dark text-white px-10 py-5 rounded-3xl font-black shadow-2xl hover:bg-sports-accent hover:scale-105 active:scale-95 transition-all text-sm tracking-widest uppercase"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Generar Informe PDF
                    </motion.button>
                </div>
            </motion.div>

            <main className="max-w-7xl mx-auto mt-[-40px] px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">

                {/* Panel de Registro (Solo si tiene permisos) */}
                {gestionActiva && (
                    <motion.section
                        className="lg:col-span-4 bg-sports-card p-10 rounded-3xl shadow-xl border border-sports-border h-fit sticky top-28"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                                {editandoId ? 'Editar Ficha' : 'Fichar Jugador'}
                            </h3>
                            <div className={`bg-sports-darker text-sports-text text-xs font-black px-4 py-2 rounded-xl ${jugadores.length >= 22 ? 'border-2 border-red-500' : ''}`}>
                                {jugadores.length} / 22
                            </div>
                        </div>

                        <form onSubmit={handleGuardar} className="space-y-4">
                            <div className="space-y-3">
                                <div className="group">
                                    <label className="text-xs font-black text-sports-text-secondary uppercase tracking-widest ml-2 mb-1 block group-focus-within:text-sports-accent">Nombre</label>
                                    <input
                                        className="input-field w-full"
                                        value={nuevoJugador.nombre}
                                        onChange={e => setNuevoJugador({...nuevoJugador, nombre: e.target.value})}
                                        required
                                        disabled={guardando}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-xs font-black text-sports-text-secondary uppercase tracking-widest ml-2 mb-1 block group-focus-within:text-sports-accent">Apellido</label>
                                    <input
                                        className="input-field w-full"
                                        value={nuevoJugador.apellido}
                                        onChange={e => setNuevoJugador({...nuevoJugador, apellido: e.target.value})}
                                        required
                                        disabled={guardando}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-xs font-black text-sports-text-secondary uppercase tracking-widest ml-2 mb-1 block group-focus-within:text-sports-accent">DNI / ID</label>
                                    <input
                                        className="input-field w-full"
                                        value={nuevoJugador.dni}
                                        onChange={e => setNuevoJugador({...nuevoJugador, dni: e.target.value})}
                                        required
                                        disabled={guardando}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-xs font-black text-sports-text-secondary uppercase tracking-widest ml-2 mb-1 block group-focus-within:text-sports-accent">Fecha Nacimiento</label>
                                    <input
                                        className="input-field w-full"
                                        type="date"
                                        value={nuevoJugador.fechaNacimiento}
                                        onChange={e => setNuevoJugador({...nuevoJugador, fechaNacimiento: e.target.value})}
                                        required
                                        disabled={guardando}
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={guardando || (!editandoId && jugadores.length >= 22)}
                                className={`w-full mt-4 py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 ${
                                    editandoId
                                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                                        : 'bg-sports-accent text-sports-dark hover:bg-sports-accent-light'
                                } ${guardando ? 'opacity-50 cursor-not-allowed' : ''}`}
                                whileHover={{ scale: guardando ? 1 : 1.02 }}
                                whileTap={{ scale: guardando ? 1 : 0.98 }}
                            >
                                {guardando ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        {editandoId ? 'Actualizando...' : 'Guardando...'}
                                    </div>
                                ) : (
                                    editandoId ? 'Actualizar Contrato' : 'Confirmar Ingreso'
                                )}
                            </motion.button>

                            {editandoId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditandoId(null);
                                        setNuevoJugador({nombre:'', apellido:'', dni:'', fechaNacimiento:''});
                                    }}
                                    className="w-full text-xs font-black text-sports-text-secondary uppercase tracking-widest mt-4 hover:text-sports-text transition-colors"
                                    disabled={guardando}
                                >
                                    Descartar Edición
                                </button>
                            )}
                        </form>
                    </motion.section>
                )}

                {/* Vista de Plantilla */}
                <motion.section
                    className={`${gestionActiva ? 'lg:col-span-8' : 'lg:col-span-12'} bg-sports-card rounded-3xl shadow-xl border border-sports-border overflow-hidden`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {/* Toggle de vista */}
                    <div className="p-6 border-b border-sports-border">
                        <div className="flex justify-center gap-4">
                            <motion.button
                                onClick={() => setVistaCancha(true)}
                                className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                                    vistaCancha
                                        ? 'bg-sports-accent text-sports-dark shadow-lg'
                                        : 'bg-sports-darker text-sports-text-secondary hover:bg-sports-border'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Vista Cancha ⚽
                            </motion.button>
                            <motion.button
                                onClick={() => setVistaCancha(false)}
                                className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                                    !vistaCancha
                                        ? 'bg-sports-accent text-sports-dark shadow-lg'
                                        : 'bg-sports-darker text-sports-text-secondary hover:bg-sports-border'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Vista Tabla 📊
                            </motion.button>
                        </div>
                    </div>

                    <div className="p-8">
                        {vistaCancha ? (
                            <CanchaView
                                jugadores={jugadores}
                                onEditarJugador={(jugador) => {
                                    setEditandoId(jugador.id);
                                    setNuevoJugador(jugador);
                                }}
                                onEliminarJugador={handleBorrar}
                                puedeEditar={gestionActiva}
                            />
                        ) : (
                            /* Tabla de Jugadores */
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-sports-darker text-sports-text text-xs font-black uppercase tracking-[0.2em]">
                                            <th className="p-8 text-left">N° / Jugador</th>
                                            <th className="p-8 text-left">DNI</th>
                                            <th className="p-8 text-left">Edad</th>
                                            {gestionActiva && <th className="p-8 text-right">Acciones</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sports-border">
                                        {jugadores.map((j, index) => (
                                            <motion.tr
                                                key={j.id}
                                                className="group hover:bg-sports-accent/10 transition-all duration-300"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <td className="p-8">
                                                    <div className="flex items-center gap-5">
                                                        <span className="text-sports-text-secondary font-black text-3xl italic group-hover:text-sports-accent transition-colors">
                                                            {(index + 1).toString().padStart(2, '0')}
                                                        </span>
                                                        <div>
                                                            <div className="font-black text-sports-text text-xl tracking-tighter uppercase leading-none italic">{j.apellido}</div>
                                                            <div className="text-sports-accent font-bold text-xs uppercase tracking-widest">{j.nombre}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-8">
                                                    <span className="text-xs font-mono font-black bg-sports-darker px-3 py-1.5 rounded-xl text-sports-text-secondary group-hover:bg-sports-border transition-colors border border-transparent group-hover:border-sports-border">
                                                        {j.dni}
                                                    </span>
                                                </td>
                                                <td className="p-8">
                                                    <div className="text-sm font-black text-sports-text-secondary group-hover:text-sports-text transition-colors">
                                                        {new Date().getFullYear() - new Date(j.fechaNacimiento).getFullYear()} <span className="text-xs ml-1">AÑOS</span>
                                                    </div>
                                                </td>
                                                {gestionActiva && (
                                                    <td className="p-8 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                            <motion.button
                                                                onClick={() => {
                                                                    setEditandoId(j.id);
                                                                    setNuevoJugador(j);
                                                                }}
                                                                className="w-11 h-11 flex items-center justify-center bg-amber-100 text-amber-600 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                ✎
                                                            </motion.button>
                                                            <motion.button
                                                                onClick={() => handleBorrar(j.id)}
                                                                className="w-11 h-11 flex items-center justify-center bg-red-100 text-red-600 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                🗑
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                )}
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {jugadores.length === 0 && (
                            <motion.div
                                className="p-32 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="text-sports-text-secondary text-6xl mb-4 italic font-black">VACÍO</div>
                                <p className="text-sports-text-secondary font-bold uppercase tracking-[0.4em] text-xs">Sin jugadores registrados en la plantilla</p>
                            </motion.div>
                        )}
                    </div>
                </motion.section>
            </main>

            {/* AREA OCULTA PARA PDF */}
            <div style={{ position: 'absolute', left: '-10000px', top: 0 }}>
                <div id="print-area">
                    <PlantillaPreview
                        equipo={equipo}
                        jugadores={jugadores}
                        reference={plantillaRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default EquipoDetalle;