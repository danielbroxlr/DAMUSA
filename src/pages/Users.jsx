import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Mail, Building, X } from 'lucide-react';
import toast from 'react-hot-toast';

const initialUsers = [
  { id: 1, name: 'Dr. Antonio García', role: 'senior_chemist', email: 'a.garcia@lab.com', department: 'Química Orgánica', status: 'active', experiments: 23 },
  { id: 2, name: 'Dra. María Martínez', role: 'senior_chemist', email: 'm.martinez@lab.com', department: 'Química Orgánica', status: 'active', experiments: 31 },
  { id: 3, name: 'Dr. Carlos López', role: 'junior_chemist', email: 'c.lopez@lab.com', department: 'Química Inorgánica', status: 'active', experiments: 15 },
  { id: 4, name: 'Dra. Ana Sánchez', role: 'analyst', email: 'a.sanchez@lab.com', department: 'Análisis Instrumental', status: 'active', experiments: 0 },
  { id: 5, name: 'Prof. Roberto Fernández', role: 'pi', email: 'r.fernandez@lab.com', department: 'Dirección', status: 'active', experiments: 45 },
  { id: 6, name: 'Laura Gómez', role: 'qa', email: 'l.gomez@lab.com', department: 'Control de Calidad', status: 'active', experiments: 0 },
];

const roleLabels = {
  admin: { label: 'Administrador', color: 'bg-rose-500/20 text-rose-400' },
  pi: { label: 'Jefe de Laboratorio', color: 'bg-violet-500/20 text-violet-400' },
  senior_chemist: { label: 'Químico Senior', color: 'bg-cyan-500/20 text-cyan-400' },
  junior_chemist: { label: 'Químico Junior', color: 'bg-emerald-500/20 text-emerald-400' },
  analyst: { label: 'Analista', color: 'bg-amber-500/20 text-amber-400' },
  qa: { label: 'Control de Calidad', color: 'bg-blue-500/20 text-blue-400' },
  viewer: { label: 'Solo Lectura', color: 'bg-gray-500/20 text-gray-400' },
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="glass rounded-2xl max-w-lg w-full mx-4 animate-fadeIn" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const NewUserForm = () => {
    const [form, setForm] = useState({ name: '', email: '', role: 'junior_chemist', department: '' });
    const handleSubmit = (e) => {
      e.preventDefault();
      setUsers([{ id: users.length + 1, ...form, status: 'active', experiments: 0 }, ...users]);
      setShowNew(false);
      toast.success('Usuario creado exitosamente');
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Nombre Completo *</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" placeholder="Dr. Juan Pérez" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Email *</label>
          <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" placeholder="j.perez@lab.com" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Rol *</label>
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
            {Object.entries(roleLabels).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Departamento</label>
          <input value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" placeholder="Química Orgánica" />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => setShowNew(false)} className="btn-secondary">Cancelar</button>
          <button type="submit" className="btn-primary">Crear Usuario</button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2><p className="text-gray-400">Administración de roles y permisos</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" /> Nuevo Usuario</button>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input placeholder="Buscar usuarios..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white" />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white min-w-40">
          <option value="all">Todos los roles</option>
          {Object.entries(roleLabels).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(user => (
          <div key={user.id} className="glass rounded-xl p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-semibold text-white text-lg">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleLabels[user.role]?.color}`}>
                {roleLabels[user.role]?.label}
              </span>
            </div>
            <h3 className="font-semibold text-white">{user.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-400">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</p>
              <p className="flex items-center gap-2"><Building className="w-4 h-4" /> {user.department}</p>
              <p className="flex items-center gap-2"><Shield className="w-4 h-4" /> {user.experiments} experimentos</p>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
              <button className="btn-secondary text-sm flex-1"><Edit className="w-4 h-4 inline mr-1" /> Editar</button>
              <button className="p-2 hover:bg-rose-500/20 text-rose-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Nuevo Usuario"><NewUserForm /></Modal>
    </div>
  );
};

export default Users;
