import { useState } from 'react';
import api from '../services/api';

const Login = ({ setUsuario }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false); // Estado para manejar visualmente el error

    const handleLogin = (e) => {
        e.preventDefault();
        setError(false);
        
        api.post('/usuarios/login', { username, password })
            .then(res => {
                localStorage.setItem('usuario', JSON.stringify(res.data));
                setUsuario(res.data);
            })
            .catch(() => {
                setError(true);
                alert("Credenciales incorrectas");
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans" 
            style={{ backgroundImage: `radial-gradient(circle at 50% 50%, #064e3b 0%, #020617 100%)` }}>
            
            {/* Líneas decorativas de fondo (Cancha) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-4 border-white rounded-full"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-white"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm px-4">
                <form 
                    onSubmit={handleLogin} 
                    className={`bg-white rounded-[2.5rem] p-10 shadow-2xl border transition-all duration-300 ${error ? 'border-red-500 animate-shake' : 'border-white/10'}`}
                >
                    {/* Header con Icono */}
                    <div className="text-center mb-8">
                        <div className="inline-block bg-emerald-100 p-4 rounded-full mb-4 shadow-inner">
                            <span className="text-4xl block leading-none">⚽</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
                            Generador de <br/>
                            <span className="text-emerald-600">Plantillas</span>
                        </h2>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-5">
                        <div className="group">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">
                                Usuario
                            </label>
                            <input 
                                type="text" 
                                placeholder="test" 
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-700 font-medium"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="group">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">
                                Contraseña
                            </label>
                            <input 
                                type="password" 
                                placeholder="test123" 
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-700 font-medium"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Botón de Acción */}
                    <button 
                        type="submit"
                        className="w-full mt-10 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-lg tracking-wide shadow-xl shadow-emerald-200 transition-all transform active:scale-95"
                    >
                        SALTAR AL CAMPO
                    </button>

                    {/* Acceso de Prueba (Ayuda visual) */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-300">
                            <p className="text-[10px] text-center text-slate-400 font-bold mb-2 uppercase tracking-tighter">Acceso Rápido para Pruebas</p>
                            <div className="flex justify-center gap-4 text-xs font-mono">
                                <span className="text-slate-600">👤 <b>test</b></span>
                                <span className="text-slate-600">🔑 <b>test123</b></span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
            `}} />
        </div>
    );
};

export default Login;