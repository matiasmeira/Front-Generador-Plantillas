import React from 'react';

const PlantillaPreview = ({ equipo, jugadores, reference }) => {
    return (
        <div 
            ref={reference} 
            style={{ 
                backgroundColor: '#ffffff', 
                padding: '10mm', 
                width: '210mm', 
                height: '297mm', 
                color: '#000000', 
                fontFamily: 'Arial, sans-serif',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}
        >
            {/* CABECERA */}
            <div style={{ position: 'relative', textAlign: 'center', marginBottom: '10px' }}>
                <img src="/logo-pilar.jpg" alt="Escudo" style={{ position: 'absolute', left: '10px', top: '0', height: '70px' }} />
                <h1 style={{ margin: '0', fontSize: '22px', fontWeight: 'bold', textDecoration: 'underline' }}>ASOCIACION PILARENSE DE FUTBOL</h1>
                <h2 style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'normal' }}>CAT SUPER SENIORS</h2>
                <h2 style={{ margin: '0', fontSize: '16px', fontWeight: 'normal' }}>TORNEO APERTURA 2024</h2>
                <img src="/logo-pelota.jpg" alt="Pelota" style={{ position: 'absolute', right: '10px', top: '0', height: '70px' }} />
            </div>

            {/* SECCIÓN DE CAMPOS: FECHA, HORARIO, ETC */}
            <div style={{ fontSize: '12px', marginTop: '30px', marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {[
                    { label: 'FECHA:', width: '120px' },
                    { label: 'HORARIO:', width: '140px' },
                    { label: 'CHANCHA:', width: '160px' },
                    { label: 'ARBITRO:', width: '160px' },
                    { label: 'DIA:', width: '110px' }
                ].map((item, idx) => (
                    <div key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'baseline',
                        backgroundImage: 'linear-gradient(to right, black 100%, black 100%)',
                        backgroundPosition: '0 1.25em',
                        backgroundSize: '100% 1px',
                        backgroundRepeat: 'no-repeat',
                        minWidth: item.width
                    }}>
                        <span style={{ backgroundColor: 'white', paddingRight: '4px', fontSize: '11px' }}>{item.label}</span>
                    </div>
                ))}
            </div>

            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                CLUB: {equipo?.nombre?.toUpperCase() || ''}
            </div>

            {/* TABLA DE JUGADORES */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid black', fontSize: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#a6c9ec', height: '25px' }}>
                        <th style={{ border: '1px solid black', width: '70px', textAlign: 'center' }}>F.DE.NAC</th>
                        <th style={{ border: '1px solid black', width: '80px', textAlign: 'center' }}>DNI</th>
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>NOMBRE Y APELLIDO</th>
                        <th style={{ border: '1px solid black', width: '40px', textAlign: 'center' }}>NUM.</th>
                        <th style={{ border: '1px solid black', width: '110px', textAlign: 'center' }}>FIRMA</th>
                        <th style={{ border: '1px solid black', width: '45px', textAlign: 'center' }}>GOLES</th>
                        <th style={{ border: '1px solid black', width: '40px', textAlign: 'center' }}>AMAR.</th>
                        <th style={{ border: '1px solid black', width: '40px', textAlign: 'center' }}>ROJA</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(40)].map((_, i) => {
                        const j = jugadores[i];
                        const rowHeight = '18.2px';
                        return (
                            <tr key={i} style={{ height: rowHeight }}> 
                                <td style={{ border: '1px solid black', textAlign: 'center', lineHeight: rowHeight, verticalAlign: 'middle' }}>
                                    {j?.fechaNacimiento ? new Date(j.fechaNacimiento).toLocaleDateString('en-US') : ''}
                                </td>
                                <td style={{ border: '1px solid black', textAlign: 'center', lineHeight: rowHeight, verticalAlign: 'middle' }}>
                                    {j?.dni || ''}
                                </td>
                                <td style={{ border: '1px solid black', paddingLeft: '5px', lineHeight: rowHeight, verticalAlign: 'middle', textTransform: 'uppercase' }}>
                                    {j ? `${j.apellido} ${j.nombre}` : ''}
                                </td>
                                <td style={{ border: '1px solid black' }}></td>
                                <td style={{ border: '1px solid black' }}></td>
                                <td style={{ border: '1px solid black' }}></td>
                                <td style={{ border: '1px solid black' }}></td>
                                <td style={{ border: '1px solid black', backgroundColor: '#ff0000' }}></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* OBSERVACIONES AL FINAL */}
            <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>OBSERVACIONES:</div>
                <div style={{ border: '1px solid black', height: '40px', width: '100%' }}></div>
            </div>
        </div>
    );
};

export default PlantillaPreview;