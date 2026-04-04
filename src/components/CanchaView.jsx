import { motion } from 'framer-motion';
import { useState } from 'react';

const POSICIONES = {
    PORTERO: { x: 50, y: 85, nombre: 'Portero' },
    DEFENSORES: [
        { x: 20, y: 70, nombre: 'Defensor Izq' },
        { x: 35, y: 65, nombre: 'Central Izq' },
        { x: 65, y: 65, nombre: 'Central Der' },
        { x: 80, y: 70, nombre: 'Defensor Der' }
    ],
    MEDIOCAMPISTAS: [
        { x: 35, y: 45, nombre: 'Medio Izq' },
        { x: 50, y: 40, nombre: 'Medio Centro' },
        { x: 65, y: 45, nombre: 'Medio Der' }
    ],
    DELANTEROS: [
        { x: 35, y: 20, nombre: 'Delantero Izq' },
        { x: 65, y: 20, nombre: 'Delantero Der' }
    ]
};

const CanchaView = ({ jugadores, onEditarJugador, onEliminarJugador, puedeEditar }) => {
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

    // Asignar posiciones a los jugadores
    const asignarPosiciones = () => {
        const posicionesAsignadas = [];
        let index = 0;

        // Portero
        if (jugadores[index]) {
            posicionesAsignadas.push({
                ...jugadores[index],
                posicion: POSICIONES.PORTERO
            });
            index++;
        }

        // Defensores
        POSICIONES.DEFENSORES.forEach(pos => {
            if (jugadores[index]) {
                posicionesAsignadas.push({
                    ...jugadores[index],
                    posicion: pos
                });
                index++;
            }
        });

        // Mediocampistas
        POSICIONES.MEDIOCAMPISTAS.forEach(pos => {
            if (jugadores[index]) {
                posicionesAsignadas.push({
                    ...jugadores[index],
                    posicion: pos
                });
                index++;
            }
        });

        // Delanteros
        POSICIONES.DELANTEROS.forEach(pos => {
            if (jugadores[index]) {
                posicionesAsignadas.push({
                    ...jugadores[index],
                    posicion: pos
                });
                index++;
            }
        });

        return posicionesAsignadas;
    };

    const jugadoresPosicionados = asignarPosiciones();

    return (
        <div className="relative">
            {/* CANCHA DE FÚTBOL */}
            <div className="relative bg-sports-accent/10 border-4 border-sports-accent rounded-3xl overflow-hidden shadow-2xl"
                 style={{
                     width: '100%',
                     maxWidth: '600px',
                     aspectRatio: '2/3',
                     background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                 }}>

                {/* CÉSPED */}
                <div className="absolute inset-0 bg-gradient-to-b from-sports-accent/20 to-sports-accent/5">
                    {/* Líneas de la cancha */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 300">
                        {/* Línea central */}
                        <line x1="100" y1="0" x2="100" y2="300" stroke="white" strokeWidth="2" opacity="0.8"/>
                        <circle cx="100" cy="150" r="30" fill="none" stroke="white" strokeWidth="2" opacity="0.8"/>

                        {/* Área grande visitante (arriba) */}
                        <rect x="40" y="0" width="120" height="60" fill="none" stroke="white" strokeWidth="2" opacity="0.8"/>
                        <rect x="70" y="0" width="60" height="20" fill="none" stroke="white" strokeWidth="2" opacity="0.8"/>
                        <circle cx="100" cy="20" r="1" fill="white" opacity="0.8"/>

                        {/* Área grande local (abajo) */}
                        <rect x="40" y="240" width="120" height="60" fill="none" stroke="white" strokeWidth="2" opacity="0.8"/>
                        <rect x="70" y="280" width="60" height="20" fill="none" stroke="white" strokeWidth="2" opacity="0.8"/>
                        <circle cx="100" cy="280" r="1" fill="white" opacity="0.8"/>

                        {/* Área chica visitante */}
                        <rect x="80" y="0" width="40" height="15" fill="none" stroke="white" strokeWidth="2" opacity="0.8"/>
                        <circle cx="100" cy="15" r="1" fill="white" opacity="0.8"/>

                        {/* Área chica local */}
                        <rect x="80" y="285" width="40" height="15" fill="none" stroke="white" strokeWidth="2" opacity="0.8"/>
                        <circle cx="100" cy="285" r="1" fill="white" opacity="0.8"/>
                    </svg>
                </div>

                {/* JUGADORES EN LA CANCHA */}
                {jugadoresPosicionados.map((jugador, index) => (
                    <motion.div
                        key={jugador.id}
                        className="absolute cursor-pointer group"
                        style={{
                            left: `${jugador.posicion.x}%`,
                            top: `${jugador.posicion.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => setJugadorSeleccionado(jugador)}
                    >
                        {/* Círculo del jugador */}
                        <div className="w-12 h-12 bg-sports-dark border-3 border-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all">
                            <span className="text-white font-black text-xs">
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                        </div>

                        {/* Nombre del jugador */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-sports-dark text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {jugador.apellido}
                        </div>
                    </motion.div>
                ))}

                {/* Jugadores en banca (si hay más de 11) */}
                {jugadores.slice(11).map((jugador, index) => (
                    <motion.div
                        key={jugador.id}
                        className="absolute cursor-pointer group"
                        style={{
                            right: '10px',
                            top: `${10 + index * 15}%`
                        }}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (11 + index) * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setJugadorSeleccionado(jugador)}
                    >
                        <div className="w-8 h-8 bg-sports-dark/80 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-xs">
                                {(12 + index).toString().padStart(2, '0')}
                            </span>
                        </div>
                        <div className="absolute left-full ml-2 bg-sports-dark text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {jugador.apellido}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* MODAL DE DETALLES DEL JUGADOR */}
            {jugadorSeleccionado && (
                <motion.div
                    className="fixed inset-0 bg-sports-dark/80 backdrop-blur-md flex items-center justify-center p-6 z-[100]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setJugadorSeleccionado(null)}
                >
                    <motion.div
                        className="bg-sports-card w-full max-w-md p-6 rounded-3xl shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-sports-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-black text-sports-dark">
                                    {(jugadores.findIndex(j => j.id === jugadorSeleccionado.id) + 1).toString().padStart(2, '0')}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-sports-text uppercase tracking-tighter">
                                {jugadorSeleccionado.apellido}
                            </h3>
                            <p className="text-sports-accent font-bold">
                                {jugadorSeleccionado.nombre}
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-sports-text-secondary font-bold">DNI:</span>
                                <span className="text-sports-text font-mono">{jugadorSeleccionado.dni}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sports-text-secondary font-bold">Edad:</span>
                                <span className="text-sports-text">
                                    {new Date().getFullYear() - new Date(jugadorSeleccionado.fechaNacimiento).getFullYear()} años
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sports-text-secondary font-bold">Posición:</span>
                                <span className="text-sports-text">{jugadorSeleccionado.posicion?.nombre || 'Sin asignar'}</span>
                            </div>
                        </div>

                        {puedeEditar && (
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={() => {
                                        onEditarJugador(jugadorSeleccionado);
                                        setJugadorSeleccionado(null);
                                    }}
                                    className="flex-1 btn-primary text-sm"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Editar
                                </motion.button>
                                <motion.button
                                    onClick={() => {
                                        onEliminarJugador(jugadorSeleccionado.id);
                                        setJugadorSeleccionado(null);
                                    }}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest px-4 py-3 rounded-2xl shadow-lg transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Eliminar
                                </motion.button>
                            </div>
                        )}

                        <button
                            onClick={() => setJugadorSeleccionado(null)}
                            className="w-full mt-4 text-sports-text-secondary hover:text-sports-text transition-colors text-sm font-bold"
                        >
                            Cerrar
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default CanchaView;