import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Atom, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useApp } from '../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { login({ email, password }); navigate('/'); }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 gradient-mesh">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 mb-4 animate-glow">
            <Atom className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">DAMUSA</h1>
          <p className="text-gray-400 mt-2">Sistema de Gestión de Laboratorio</p>
        </div>
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white" placeholder="usuario@lab.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-12 py-3 text-white" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Iniciar Sesión'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">Demo: cualquier email/contraseña</p>
        </div>
        <p className="text-center text-xs text-gray-600 mt-8">© 2024 DAMUSA - LIMS Pro v1.0</p>
      </div>
    </div>
  );
};

export default Login;
