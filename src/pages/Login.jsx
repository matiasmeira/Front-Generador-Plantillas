import { useState } from 'react';
import api from '../services/api';

const Login = ({ setUsuario }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        api.post('/usuarios/login', { username, password })
            .then(res => {
                localStorage.setItem('usuario', JSON.stringify(res.data));
                setUsuario(res.data);
            })
            .catch(() => alert("Credenciales incorrectas"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-80">
                <h2 className="text-2xl font-bold mb-6 text-center">TEAM GEN</h2>
                <input 
                    type="text" placeholder="Usuario" 
                    className="w-full mb-4 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="password" placeholder="Contraseña" 
                    className="w-full mb-6 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;