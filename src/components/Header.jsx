import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';

const Header = ({ user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, type: 'sample', message: 'Muestra ORG-2024-001 completada', time: '5 min' },
    { id: 2, type: 'approval', message: 'Experimento pendiente de aprobación', time: '1 hora' },
    { id: 3, type: 'transfer', message: 'Transferencia recibida de Lab-B', time: '2 horas' },
  ];

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'Administrador',
      pi: 'Jefe de Laboratorio',
      senior_chemist: 'Químico Senior',
      junior_chemist: 'Químico Junior',
      analyst: 'Analista',
      qa: 'Control de Calidad',
      viewer: 'Consulta'
    };
    return roles[role] || role;
  };

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <header className="glass border-b border-gray-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar muestras, moléculas, experimentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-gray-700 rounded text-gray-400 border border-gray-600">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-xs flex items-center justify-center font-semibold">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 glass rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden z-50 animate-fadeIn">
                <div className="p-4 border-b border-gray-700/50">
                  <h3 className="font-semibold text-white">Notificaciones</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className="p-4 hover:bg-gray-800/50 cursor-pointer border-b border-gray-700/30 transition-colors"
                    >
                      <p className="text-sm text-white">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-700/50">
                  <button className="w-full text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-4 border-l border-gray-700 hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-semibold text-white">
                {getUserInitials(user?.name || 'User')}
              </div>
              <div className="hidden md:block text-left">
                <p className="font-medium text-sm text-white">{user?.name}</p>
                <p className="text-xs text-gray-500">{getRoleLabel(user?.role)}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 glass rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden z-50 animate-fadeIn">
                <div className="p-4 border-b border-gray-700/50">
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span>Mi Perfil</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Configuración</span>
                  </button>
                </div>
                <div className="p-2 border-t border-gray-700/50">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
