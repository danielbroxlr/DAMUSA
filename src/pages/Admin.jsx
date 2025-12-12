import React, { useState } from 'react';
import { 
  Shield, Users, BookOpen, Key, Download, Settings, 
  UserPlus, UserMinus, Lock, Unlock, Eye, Edit, Trash2,
  CheckCircle, XCircle, AlertTriangle, FileText, Database,
  ToggleLeft, ToggleRight, X, Save, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../App';

const initialUsers = [
  { id: 1, name: 'Dr. Antonio García', email: 'a.garcia@lab.com', role: 'admin', status: 'active', lastLogin: '2024-01-16 09:00', notebooks: 5 },
  { id: 2, name: 'Dra. María Martínez', email: 'm.martinez@lab.com', role: 'senior_chemist', status: 'active', lastLogin: '2024-01-16 08:30', notebooks: 3 },
  { id: 3, name: 'Dr. Carlos López', email: 'c.lopez@lab.com', role: 'junior_chemist', status: 'active', lastLogin: '2024-01-15 14:00', notebooks: 2 },
  { id: 4, name: 'Dra. Ana Sánchez', email: 'a.sanchez@lab.com', role: 'analyst', status: 'inactive', lastLogin: '2024-01-10 10:00', notebooks: 0 },
  { id: 5, name: 'Prof. Roberto Fernández', email: 'r.fernandez@lab.com', role: 'pi', status: 'active', lastLogin: '2024-01-16 07:00', notebooks: 8 },
  { id: 6, name: 'Laura Gómez', email: 'l.gomez@lab.com', role: 'qa', status: 'active', lastLogin: '2024-01-15 16:00', notebooks: 1 },
];

const initialNotebooks = [
  { id: 1, name: 'Síntesis Orgánica 2024', owner: 'Dr. García', status: 'open', users: 4, experiments: 23, created: '2024-01-01' },
  { id: 2, name: 'Catalizadores Metálicos', owner: 'Dr. López', status: 'open', users: 2, experiments: 15, created: '2024-01-05' },
  { id: 3, name: 'Nanomateriales Q1', owner: 'Dra. Sánchez', status: 'closed', users: 3, experiments: 45, created: '2023-10-15' },
  { id: 4, name: 'Analgésicos Novel', owner: 'Dra. Martínez', status: 'open', users: 5, experiments: 67, created: '2023-06-01' },
];

const roleLabels = {
  admin: { label: 'Administrador', color: 'bg-rose-500/20 text-rose-400', icon: Shield },
  pi: { label: 'Jefe de Laboratorio', color: 'bg-violet-500/20 text-violet-400', icon: Key },
  senior_chemist: { label: 'Químico Senior', color: 'bg-cyan-500/20 text-cyan-400', icon: Users },
  junior_chemist: { label: 'Químico Junior', color: 'bg-emerald-500/20 text-emerald-400', icon: Users },
  analyst: { label: 'Analista', color: 'bg-amber-500/20 text-amber-400', icon: Eye },
  qa: { label: 'Control de Calidad', color: 'bg-blue-500/20 text-blue-400', icon: CheckCircle },
  viewer: { label: 'Solo Lectura', color: 'bg-gray-500/20 text-gray-400', icon: Eye },
};

const permissionsList = [
  { key: 'canManageUsers', label: 'Gestionar usuarios', desc: 'Crear, editar y eliminar usuarios' },
  { key: 'canManageRoles', label: 'Gestionar roles', desc: 'Asignar y modificar roles de usuarios' },
  { key: 'canExportUsers', label: 'Exportar usuarios', desc: 'Descargar listado de usuarios' },
  { key: 'canOpenNotebooks', label: 'Abrir libretas', desc: 'Crear y abrir nuevas libretas ELN' },
  { key: 'canCloseNotebooks', label: 'Cerrar libretas', desc: 'Cerrar y archivar libretas ELN' },
  { key: 'canGrantAccess', label: 'Otorgar acceso', desc: 'Dar acceso a otros usuarios a libretas' },
  { key: 'canModifyPlatform', label: 'Modificar plataforma', desc: 'Cambiar configuración del sistema' },
  { key: 'canViewAudit', label: 'Ver auditoría', desc: 'Acceder al registro de auditoría' },
  { key: 'canEditSamples', label: 'Editar muestras', desc: 'Modificar información de muestras' },
  { key: 'canDeleteSamples', label: 'Eliminar muestras', desc: 'Borrar muestras del sistema' },
  { key: 'canApproveExperiments', label: 'Aprobar experimentos', desc: 'Revisar y aprobar experimentos' },
  { key: 'canExportData', label: 'Exportar datos', desc: 'Descargar datos en formatos externos' },
];

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={onClose}>
      <div className={`bg-gray-800 border border-gray-700 rounded-2xl ${sizes[size]} w-full mx-4 max-h-[90vh] overflow-hidden`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">{children}</div>
      </div>
    </div>
  );
};

const Admin = () => {
  const { rolePermissions } = useApp();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(initialUsers);
  const [notebooks, setNotebooks] = useState(initialNotebooks);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(null);
  const [showNotebookModal, setShowNotebookModal] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const tabs = [
    { id: 'users', label: 'Gestión de Usuarios', icon: Users },
    { id: 'permissions', label: 'Roles y Permisos', icon: Key },
    { id: 'notebooks', label: 'Libretas ELN', icon: BookOpen },
    { id: 'system', label: 'Sistema', icon: Settings },
  ];

  const handleExportUsers = () => {
    const csv = users.map(u => `${u.name},${u.email},${u.role},${u.status}`).join('\n');
    const blob = new Blob([`Nombre,Email,Rol,Estado\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_damusa.csv';
    a.click();
    toast.success('Listado de usuarios exportado');
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    toast.success('Estado del usuario actualizado');
  };

  const handleDeleteUser = (userId) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success('Usuario eliminado');
    }
  };

  const handleToggleNotebook = (notebookId) => {
    setNotebooks(notebooks.map(n => n.id === notebookId ? { ...n, status: n.status === 'open' ? 'closed' : 'open' } : n));
    toast.success('Estado de la libreta actualizado');
  };

  const UserForm = ({ user, onClose }) => {
    const [form, setForm] = useState(user || { name: '', email: '', role: 'junior_chemist', status: 'active' });
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (user) {
        setUsers(users.map(u => u.id === user.id ? { ...u, ...form } : u));
        toast.success('Usuario actualizado');
      } else {
        setUsers([{ id: users.length + 1, ...form, lastLogin: 'Nunca', notebooks: 0 }, ...users]);
        toast.success('Usuario creado');
      }
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Nombre Completo *</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Email *</label>
          <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Rol *</label>
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white">
            {Object.entries(roleLabels).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Estado</label>
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" className="btn-primary">{user ? 'Guardar Cambios' : 'Crear Usuario'}</button>
        </div>
      </form>
    );
  };

  const NotebookAccessModal = ({ notebook, onClose }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    
    return (
      <div className="space-y-4">
        <p className="text-gray-400">Selecciona los usuarios que tendrán acceso a la libreta <strong className="text-white">{notebook.name}</strong></p>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {users.filter(u => u.status === 'active').map(user => (
            <label key={user.id} className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800">
              <input 
                type="checkbox" 
                checked={selectedUsers.includes(user.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedUsers([...selectedUsers, user.id]);
                  } else {
                    setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                  }
                }}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500"
              />
              <div>
                <p className="text-white">{user.name}</p>
                <p className="text-xs text-gray-500">{roleLabels[user.role]?.label}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={() => { toast.success(`Acceso otorgado a ${selectedUsers.length} usuarios`); onClose(); }} className="btn-primary">
            Guardar Acceso
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-rose-400" />
            Panel de Administración
          </h2>
          <p className="text-gray-400">Gestión completa del sistema LIMS</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Usuarios del Sistema</h3>
            <div className="flex gap-2">
              <button onClick={handleExportUsers} className="btn-secondary flex items-center gap-2">
                <Download className="w-4 h-4" /> Exportar CSV
              </button>
              <button onClick={() => { setEditingUser(null); setShowUserModal(true); }} className="btn-primary flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Nuevo Usuario
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Usuario</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Rol</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Último Acceso</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Libretas</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t border-gray-700/50 hover:bg-gray-800/30">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${roleLabels[user.role]?.color}`}>
                        {roleLabels[user.role]?.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`flex items-center gap-2 ${user.status === 'active' ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {user.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-400">{user.lastLogin}</td>
                    <td className="py-4 px-4 text-sm text-gray-400">{user.notebooks}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingUser(user); setShowUserModal(true); }} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white" title="Editar">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleToggleUserStatus(user.id)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white" title={user.status === 'active' ? 'Desactivar' : 'Activar'}>
                          {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setShowPermissionsModal(user)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white" title="Ver permisos">
                          <Key className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 hover:bg-rose-500/20 rounded-lg text-gray-400 hover:text-rose-400" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Matriz de Permisos por Rol</h3>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-800">
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase sticky left-0 bg-gray-800">Permiso</th>
                  {Object.entries(roleLabels).map(([key, val]) => (
                    <th key={key} className="text-center py-4 px-3 text-xs font-semibold text-gray-500 uppercase">{val.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionsList.map(perm => (
                  <tr key={perm.key} className="border-t border-gray-700/50 hover:bg-gray-800/30">
                    <td className="py-3 px-4 sticky left-0 bg-gray-800/90">
                      <p className="text-white text-sm">{perm.label}</p>
                      <p className="text-xs text-gray-500">{perm.desc}</p>
                    </td>
                    {Object.keys(roleLabels).map(role => (
                      <td key={role} className="text-center py-3 px-3">
                        {rolePermissions[role]?.[perm.key] ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-600 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notebooks Tab */}
      {activeTab === 'notebooks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Libretas de Laboratorio (ELN)</h3>
            <button className="btn-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Nueva Libreta
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notebooks.map(notebook => (
              <div key={notebook.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold">{notebook.name}</h4>
                    <p className="text-sm text-gray-500">Propietario: {notebook.owner}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${notebook.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {notebook.status === 'open' ? '🔓 Abierta' : '🔒 Cerrada'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-xl font-bold text-white">{notebook.users}</p>
                    <p className="text-xs text-gray-500">Usuarios</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-xl font-bold text-white">{notebook.experiments}</p>
                    <p className="text-xs text-gray-500">Experimentos</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-sm font-medium text-white">{notebook.created}</p>
                    <p className="text-xs text-gray-500">Creada</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowNotebookModal(notebook)} className="btn-secondary flex-1 text-sm">
                    <Users className="w-4 h-4 inline mr-1" /> Gestionar Acceso
                  </button>
                  <button onClick={() => handleToggleNotebook(notebook.id)} className={`btn-secondary text-sm ${notebook.status === 'open' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {notebook.status === 'open' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" /> Estado del Sistema
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Base de datos</span>
                  <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Conectada</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Último backup</span>
                  <span className="text-white">Hoy, 03:00 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Usuarios activos</span>
                  <span className="text-white">{users.filter(u => u.status === 'active').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Libretas abiertas</span>
                  <span className="text-white">{notebooks.filter(n => n.status === 'open').length}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" /> Acciones Rápidas
              </h4>
              <div className="space-y-2">
                <button className="w-full btn-secondary text-left flex items-center gap-3">
                  <RefreshCw className="w-4 h-4" /> Forzar Backup Ahora
                </button>
                <button className="w-full btn-secondary text-left flex items-center gap-3">
                  <FileText className="w-4 h-4" /> Generar Reporte de Auditoría
                </button>
                <button className="w-full btn-secondary text-left flex items-center gap-3">
                  <Download className="w-4 h-4" /> Exportar Configuración
                </button>
                <button className="w-full btn-secondary text-left flex items-center gap-3 text-amber-400">
                  <AlertTriangle className="w-4 h-4" /> Modo Mantenimiento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <UserForm user={editingUser} onClose={() => setShowUserModal(false)} />
      </Modal>

      <Modal isOpen={!!showPermissionsModal} onClose={() => setShowPermissionsModal(null)} title={`Permisos de ${showPermissionsModal?.name}`}>
        {showPermissionsModal && (
          <div className="space-y-3">
            <p className="text-gray-400 mb-4">Rol actual: <span className={`px-2 py-1 text-xs rounded-full ${roleLabels[showPermissionsModal.role]?.color}`}>{roleLabels[showPermissionsModal.role]?.label}</span></p>
            {permissionsList.map(perm => (
              <div key={perm.key} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div>
                  <p className="text-white text-sm">{perm.label}</p>
                  <p className="text-xs text-gray-500">{perm.desc}</p>
                </div>
                {rolePermissions[showPermissionsModal.role]?.[perm.key] ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-600" />
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal isOpen={!!showNotebookModal} onClose={() => setShowNotebookModal(null)} title="Gestionar Acceso a Libreta">
        {showNotebookModal && <NotebookAccessModal notebook={showNotebookModal} onClose={() => setShowNotebookModal(null)} />}
      </Modal>
    </div>
  );
};

export default Admin;
