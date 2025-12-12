import React, { useState } from 'react';
import { Plus, Search, Download, Eye, Edit, Trash2, ArrowLeftRight, QrCode, MapPin, Thermometer, Calendar, User, CheckCircle, X, Save, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../App';

const initialSamples = [
  { id: 'ORG-2024-001', name: 'Aspirina Síntesis Batch A', type: 'organic', status: 'in_progress', location: 'Lab-A-R3', temperature: '4°C', created: '2024-01-15', assignee: 'Dr. García', project: 'Analgésicos Novel' },
  { id: 'ORG-2024-002', name: 'Paracetamol Derivado 2B', type: 'organic', status: 'completed', location: 'Lab-A-R1', temperature: '-20°C', created: '2024-01-14', assignee: 'Dra. Martínez', project: 'Analgésicos Novel' },
  { id: 'INO-2024-001', name: 'Complejo Fe(III)-EDTA', type: 'inorganic', status: 'pending', location: 'Lab-B-R2', temperature: '25°C', created: '2024-01-16', assignee: 'Dr. López', project: 'Catalizadores' },
  { id: 'ORG-2024-003', name: 'Ibuprofeno Isómero R', type: 'organic', status: 'quarantine', location: 'Lab-A-R5', temperature: '-80°C', created: '2024-01-13', assignee: 'Dr. García', project: 'Analgésicos Novel' },
];

const StatusBadge = ({ status }) => {
  const cfg = { in_progress: 'bg-cyan-500/20 text-cyan-400', completed: 'bg-emerald-500/20 text-emerald-400', pending: 'bg-amber-500/20 text-amber-400', quarantine: 'bg-rose-500/20 text-rose-400', in_transit: 'bg-violet-500/20 text-violet-400' };
  const labels = { in_progress: 'En Proceso', completed: 'Completada', pending: 'Pendiente', quarantine: 'Cuarentena', in_transit: 'En Tránsito' };
  return <span className={`px-2 py-1 text-xs rounded-full ${cfg[status] || 'bg-gray-500/20 text-gray-400'}`}>{labels[status] || status}</span>;
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
};

const Samples = () => {
  const { hasPermission } = useApp();
  const [samples, setSamples] = useState(initialSamples);
  const [modal, setModal] = useState({ type: null, data: null });
  const [filters, setFilters] = useState({ status: 'all', type: 'all', search: '' });

  const canEdit = hasPermission('canEditSamples');
  const canDelete = hasPermission('canDeleteSamples');

  const filtered = samples.filter(s => 
    (filters.status === 'all' || s.status === filters.status) &&
    (filters.type === 'all' || s.type === filters.type) &&
    (s.id.toLowerCase().includes(filters.search.toLowerCase()) || s.name.toLowerCase().includes(filters.search.toLowerCase()))
  );

  const closeModal = () => setModal({ type: null, data: null });

  const saveSample = (form, isNew) => {
    if (isNew) {
      const newId = `${form.type === 'organic' ? 'ORG' : 'INO'}-2024-${String(samples.length + 1).padStart(3, '0')}`;
      setSamples([{ id: newId, ...form, status: 'pending', created: new Date().toISOString().split('T')[0], assignee: 'Usuario Actual' }, ...samples]);
      toast.success('Muestra creada');
    } else {
      setSamples(samples.map(s => s.id === form.id ? { ...s, ...form } : s));
      toast.success('Muestra actualizada');
    }
    closeModal();
  };

  const deleteSample = (id) => {
    if (!canDelete) { toast.error('Sin permiso para eliminar'); return; }
    if (confirm('¿Eliminar muestra?')) { setSamples(samples.filter(s => s.id !== id)); toast.success('Eliminada'); closeModal(); }
  };

  const toggleQuarantine = (id) => {
    setSamples(samples.map(s => s.id === id ? { ...s, status: s.status === 'quarantine' ? 'pending' : 'quarantine' } : s));
    toast.success('Estado actualizado'); closeModal();
  };

  const transferSample = (id, dest) => {
    setSamples(samples.map(s => s.id === id ? { ...s, status: 'in_transit', location: `Transit → ${dest}` } : s));
    toast.success(`Transferencia a ${dest} iniciada`); closeModal();
  };

  const SampleForm = ({ sample }) => {
    const [f, setF] = useState(sample || { name: '', type: 'organic', location: '', temperature: '25°C', project: '', notes: '' });
    return (
      <form onSubmit={e => { e.preventDefault(); saveSample(sample ? { ...sample, ...f } : f, !sample); }} className="space-y-4">
        <input required placeholder="Nombre *" value={f.name} onChange={e => setF({...f, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
        <div className="grid grid-cols-2 gap-4">
          <select value={f.type} onChange={e => setF({...f, type: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option value="organic">Orgánica</option><option value="inorganic">Inorgánica</option>
          </select>
          <input required placeholder="Ubicación *" value={f.location} onChange={e => setF({...f, location: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <select value={f.temperature} onChange={e => setF({...f, temperature: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option value="25°C">25°C</option><option value="4°C">4°C</option><option value="-20°C">-20°C</option><option value="-80°C">-80°C</option>
          </select>
          <input placeholder="Proyecto" value={f.project} onChange={e => setF({...f, project: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
        </div>
        <div className="flex justify-end gap-3"><button type="button" onClick={closeModal} className="btn-secondary">Cancelar</button><button type="submit" className="btn-primary">{sample ? 'Guardar' : 'Crear'}</button></div>
      </form>
    );
  };

  const SampleDetail = ({ sample }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><span className="font-mono text-cyan-400 text-lg">{sample.id}</span><StatusBadge status={sample.status} /></div>
      <h3 className="text-xl font-semibold text-white">{sample.name}</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-900 rounded-lg p-3"><MapPin className="w-4 h-4 inline text-gray-400 mr-2" />{sample.location}</div>
        <div className="bg-gray-900 rounded-lg p-3"><Thermometer className="w-4 h-4 inline text-gray-400 mr-2" />{sample.temperature}</div>
        <div className="bg-gray-900 rounded-lg p-3"><Calendar className="w-4 h-4 inline text-gray-400 mr-2" />{sample.created}</div>
        <div className="bg-gray-900 rounded-lg p-3"><User className="w-4 h-4 inline text-gray-400 mr-2" />{sample.assignee}</div>
      </div>
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
        {canEdit && <button onClick={() => setModal({ type: 'edit', data: sample })} className="btn-secondary"><Edit className="w-4 h-4 mr-1" />Editar</button>}
        <button onClick={() => setModal({ type: 'transfer', data: sample })} className="btn-secondary"><ArrowLeftRight className="w-4 h-4 mr-1" />Transferir</button>
        <button onClick={() => toast.success('QR generado')} className="btn-secondary"><QrCode className="w-4 h-4 mr-1" />QR</button>
        <button onClick={() => toggleQuarantine(sample.id)} className="btn-secondary text-amber-400"><AlertTriangle className="w-4 h-4 mr-1" />Cuarentena</button>
        {canDelete && <button onClick={() => deleteSample(sample.id)} className="btn-secondary text-rose-400"><Trash2 className="w-4 h-4 mr-1" />Eliminar</button>}
      </div>
    </div>
  );

  const TransferForm = ({ sample }) => {
    const [dest, setDest] = useState('');
    return (
      <div className="space-y-4">
        <p className="text-gray-400">Transferir: <span className="text-white">{sample.id}</span></p>
        <select required value={dest} onChange={e => setDest(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white">
          <option value="">Destino...</option><option value="Lab-A">Lab-A</option><option value="Lab-B">Lab-B</option><option value="Lab-C">Lab-C</option>
        </select>
        <div className="flex justify-end gap-3"><button onClick={closeModal} className="btn-secondary">Cancelar</button><button onClick={() => dest && transferSample(sample.id, dest)} className="btn-primary">Transferir</button></div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">Gestión de Muestras</h2><p className="text-gray-400">Trazabilidad completa</p></div>
        <button onClick={() => setModal({ type: 'new', data: null })} className="btn-primary"><Plus className="w-5 h-5 mr-2" />Nueva Muestra</button>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input placeholder="Buscar..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white" />
        </div>
        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white">
          <option value="all">Todo Estado</option><option value="in_progress">En Proceso</option><option value="completed">Completada</option><option value="pending">Pendiente</option><option value="quarantine">Cuarentena</option>
        </select>
        <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white">
          <option value="all">Todo Tipo</option><option value="organic">Orgánica</option><option value="inorganic">Inorgánica</option>
        </select>
        <button onClick={() => toast.success('CSV exportado')} className="btn-secondary"><Download className="w-4 h-4 mr-2" />Exportar</button>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-800">
            <th className="text-left py-4 px-4 text-xs text-gray-500 uppercase">ID</th>
            <th className="text-left py-4 px-4 text-xs text-gray-500 uppercase">Nombre</th>
            <th className="text-left py-4 px-4 text-xs text-gray-500 uppercase">Estado</th>
            <th className="text-left py-4 px-4 text-xs text-gray-500 uppercase">Ubicación</th>
            <th className="text-left py-4 px-4 text-xs text-gray-500 uppercase">Acciones</th>
          </tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-t border-gray-700/50 hover:bg-gray-800/30">
                <td className="py-4 px-4 font-mono text-cyan-400">{s.id}</td>
                <td className="py-4 px-4 text-white">{s.name}</td>
                <td className="py-4 px-4"><StatusBadge status={s.status} /></td>
                <td className="py-4 px-4 text-gray-400">{s.location}</td>
                <td className="py-4 px-4 flex gap-1">
                  <button onClick={() => setModal({ type: 'view', data: s })} className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white"><Eye className="w-4 h-4" /></button>
                  {canEdit && <button onClick={() => setModal({ type: 'edit', data: s })} className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>}
                  <button onClick={() => setModal({ type: 'transfer', data: s })} className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white"><ArrowLeftRight className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal.type === 'new'} onClose={closeModal} title="Nueva Muestra"><SampleForm /></Modal>
      <Modal isOpen={modal.type === 'edit'} onClose={closeModal} title="Editar Muestra"><SampleForm sample={modal.data} /></Modal>
      <Modal isOpen={modal.type === 'view'} onClose={closeModal} title="Detalle">{modal.data && <SampleDetail sample={modal.data} />}</Modal>
      <Modal isOpen={modal.type === 'transfer'} onClose={closeModal} title="Transferir">{modal.data && <TransferForm sample={modal.data} />}</Modal>
    </div>
  );
};

export default Samples;
