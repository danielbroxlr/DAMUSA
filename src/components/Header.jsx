import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onSearch }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, type: 'sample', message: 'Muestra ORG-2024-001 completada', time: '5 min', read: false },
    { id: 2, type: 'approval', message: 'Experimento pendiente de aprobación', time: '1 hora', read: false },
    { id: 3, type: 'transfer', message: 'Transferencia recibida de Lab-B', time: '2 horas', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'Administrador',
      pi: 'Jefe de Laboratorio',
      senior_chemist: 'Químico Senior',
      junior_chemist: 'Químico Junior',
      analyst: 'Analista',
      qa: 'Control de Calidad',
      viewer: 'Solo Lectura'
    };
    return roles[role] || role;
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
    if (onSearch) onSearch(query);
  };

  const closeAllMenus = () => {
    setShowNotifications(false);
    setShowUserMenu(false);
    setShowSearchResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        closeAllMenus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <form onSubmit={(e) => e.preventDefault()} className="relative flex-1 max-w-xl dropdown-container">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar muestras, moléculas, experimentos..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-12 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-gray-700 rounded text-gray-400">⌘K</kbd>
            
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-[9999]">
                <div className="p-3 border-b border-gray-700">
                  <p className="text-xs text-gray-500">Resultados para "{searchQuery}"</p>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  <button onClick={() => { navigate('/samples'); closeAllMenus(); }} className="w-full px-3 py-2 text-left hover:bg-gray-700/50 rounded-lg">
                    <p className="text-white text-sm">Buscar en Muestras</p>
                  </button>
                  <button onClick={() => { navigate('/molecules'); closeAllMenus(); }} className="w-full px-3 py-2 text-left hover:bg-gray-700/50 rounded-lg">
                    <p className="text-white text-sm">Buscar en Moléculas</p>
                  </button>
                  <button onClick={() => { navigate('/eln'); closeAllMenus(); }} className="w-full px-3 py-2 text-left hover:bg-gray-700/50 rounded-lg">
                    <p className="text-white text-sm">Buscar en Experimentos</p>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative dropdown-container">
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-xs flex items-center justify-center font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-[9999]">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Notificaciones</h3>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300">Marcar leídas</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 hover:bg-gray-700/50 cursor-pointer border-b border-gray-700/30 ${!n.read ? 'bg-cyan-500/5' : ''}`}>
                      <p className="text-sm text-white">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative dropdown-container">
            <button 
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
              className="flex items-center gap-3 pl-4 border-l border-gray-700 hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-semibold text-white">
                {getUserInitials(user?.name)}
              </div>
              <div className="hidden md:block text-left">
                <p className="font-medium text-sm text-white">{user?.name}</p>
                <p className="text-xs text-gray-500">{getRoleLabel(user?.role)}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 hidden md:block transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-[9999]">
                <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${user?.role === 'admin' ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                    {getRoleLabel(user?.role)}
                  </span>
                </div>
                <div className="p-2">
                  <button onClick={() => { navigate('/settings'); closeAllMenus(); }} className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg">
                    <User className="w-4 h-4" /><span>Mi Perfil</span>
                  </button>
                  <button onClick={() => { navigate('/settings'); closeAllMenus(); }} className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg">
                    <Settings className="w-4 h-4" /><span>Configuración</span>
                  </button>
                </div>
                <div className="p-2 border-t border-gray-700">
                  <button onClick={() => { navigate('/login'); closeAllMenus(); }} className="w-full flex items-center gap-3 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg">
                    <LogOut className="w-4 h-4" /><span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
