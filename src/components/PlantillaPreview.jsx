import React from 'react';

const PlantillaPreview = ({ equipo, jugadores, reference }) => {
    // Si el equipo no tiene color, usamos un azul por defecto
    const colorPrimario = equipo.colorPrincipal || '#1e293b';

    return (
        <div 
            ref={reference} 
            className="p-10 bg-white w-[800px]" 
            style={{ 
                borderTop: `20px solid ${colorPrimario}`,
                backgroundColor: '#ffffff' // Forzamos fondo blanco
            }}
        >
            <div className="flex justify-between items-center mb-10 border-b-2 pb-6" style={{ borderColor: '#f1f5f9' }}>
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter" style={{ color: '#1e293b' }}>
                        {equipo.nombre}
                    </h1>
                    <p className="font-bold tracking-widest mt-1 uppercase" style={{ color: '#64748b' }}>
                        Plantel Oficial
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black" style={{ color: '#e2e8f0' }}>TEAM GEN</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                {jugadores.map((j) => (
                    <div key={j.id} className="flex items-center gap-4 border-b pb-3" style={{ borderColor: '#f8fafc' }}>
                        <span className="text-3xl font-black w-12" style={{ color: '#cbd5e1' }}>
                            {j.dorsal}
                        </span>
                        <div className="flex-1">
                            <p className="font-extrabold uppercase text-xl leading-none" style={{ color: '#0f172a' }}>
                                {j.apellido}
                            </p>
                            <p className="text-sm font-bold uppercase tracking-tight" style={{ color: '#94a3b8' }}>
                                {j.nombre} • {j.posicion}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 pt-6 border-t text-center" style={{ borderColor: '#f1f5f9' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#cbd5e1' }}>
                    Documento generado por la plataforma Team Gen
                </p>
            </div>
        </div>
    );
};

export default PlantillaPreview;