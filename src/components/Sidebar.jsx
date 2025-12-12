import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TestTube, 
  Atom, 
  BookOpen, 
  BarChart3, 
  Users, 
  FileSearch, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed, userRole }) => {
  const location = useLocation();
  
  const isAdmin = userRole === 'admin';

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['all'] },
    { path: '/samples', label: 'Muestras', icon: TestTube, roles: ['all'] },
    { path: '/molecules', label: 'Moléculas', icon: Atom, roles: ['all'] },
    { path: '/eln', label: 'Cuaderno ELN', icon: BookOpen, roles: ['all'] },
    { path: '/analytics', label: 'Analíticas', icon: BarChart3, roles: ['all'] },
    { path: '/admin', label: 'Administración', icon: Shield, roles: ['admin'] },
    { path: '/users', label: 'Usuarios', icon: Users, roles: ['admin', 'pi'] },
    { path: '/audit', label: 'Auditoría', icon: FileSearch, roles: ['admin', 'qa'] },
    { path: '/settings', label: 'Configuración', icon: Settings, roles: ['admin'] },
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes('all') || item.roles.includes(userRole)
  );

  return (
    <aside 
      className={`bg-gray-900/80 backdrop-blur-xl border-r border-gray-700/50 transition-all duration-300 ease-in-out flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-700/50">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center flex-shrink-0" style={{boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'}}>
            <Atom className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg text-white">DAMUSA</h1>
              <p className="text-xs text-gray-500">LIMS Pro v1.0</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Role Badge */}
      {!collapsed && (
        <div className="px-4 py-2">
          <div className={`px-3 py-2 rounded-lg text-center text-xs font-medium ${
            isAdmin ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
          }`}>
            {isAdmin ? '🔐 Administrador' : '👤 Usuario'}
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-2 py-2 text-gray-500 hover:text-white transition-colors text-sm rounded-lg hover:bg-gray-800/50 px-3`}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Colapsar</span>
            </>
          )}
        </button>
      </div>

      {/* Version Info */}
      {!collapsed && (
        <div className="p-4 text-center text-xs text-gray-600">
          © 2024 DAMUSA Labs
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
