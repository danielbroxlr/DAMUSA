import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  ArrowLeftRight,
  QrCode,
  MapPin,
  Thermometer,
  Calendar,
  User,
  CheckCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data
const initialSamples = [
  { id: 'ORG-2024-001', name: 'Aspirina Síntesis Batch A', type: 'organic', status: 'in_progress', location: 'Lab-A-R3', temperature: '4°C', created: '2024-01-15', assignee: 'Dr. García', project: 'Analgésicos Novel' },
  { id: 'ORG-2024-002', name: 'Paracetamol Derivado 2B', type: 'organic', status: 'completed', location: 'Lab-A-R1', temperature: '-20°C', created: '2024-01-14', assignee: 'Dra. Martínez', project: 'Analgésicos Novel' },
  { id: 'INO-2024-001', name: 'Complejo Fe(III)-EDTA', type: 'inorganic', status: 'pending', location: 'Lab-B-R2', temperature: '25°C', created: '2024-01-16', assignee: 'Dr. López', project: 'Catalizadores' },
  { id: 'ORG-2024-003', name: 'Ibuprofeno Isómero R', type: 'organic', status: 'quarantine', location: 'Lab-A-R5', temperature: '-80°C', created: '2024-01-13', assignee: 'Dr. García', project: 'Analgésicos Novel' },
  { id: 'INO-2024-002', name: 'Nanopartículas Au-Ag', type: 'inorganic', status: 'in_transit', location: 'Transit', temperature: '4°C', created: '2024-01-12', assignee: 'Dra. Sánchez', project: 'Nanomateriales' },
  { id: 'ORG-2024-004', name: 'Benzocaína Sal HCl', type: 'organic', status: 'archived', location: 'Archive-2', temperature: '-20°C', created: '2024-01-10', assignee: 'Dra. Martínez', project: 'Anestésicos Locales' },
];

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    in_progress: { label: 'En Proceso', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    completed: { label: 'Completada', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    pending: { label: 'Pendiente', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    quarantine: { label: 'Cuarentena', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    in_transit: { label: 'En Tránsito', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
    archived: { label: 'Archivada', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  };
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className={`glass rounded-2xl ${sizes[size]} w-full mx-4 max-h-[90vh] overflow-hidden animate-fadeIn`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

const Samples = () => {
  const [samples, setSamples] = useState(initialSamples);
  const [showNewSample, setShowNewSample] = useState(false);
  const [showSampleDetail, setShowSampleDetail] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSamples = samples.filter(sample => {
    const matchesStatus = filterStatus === 'all' || sample.status === filterStatus;
    const matchesType = filterType === 'all' || sample.type === filterType;
    const matchesSearch = sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // New Sample Form
  const NewSampleForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      type: 'organic',
      location: '',
      temperature: '',
      project: '',
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newSample = {
        id: `${formData.type === 'organic' ? 'ORG' : 'INO'}-2024-${String(samples.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'pending',
        created: new Date().toISOString().split('T')[0],
        assignee: 'Usuario Actual'
      };
      setSamples([newSample, ...samples]);
      setShowNewSample(false);
      toast.success('Muestra creada exitosamente');
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nombre de la Muestra *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              placeholder="Ej: Aspirina Batch 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tipo *</label>
            <select
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="organic">Química Orgánica</option>
              <option value="inorganic">Química Inorgánica</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Ubicación *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              placeholder="Ej: Lab-A-R3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Temperatura</label>
            <select
              value={formData.temperature}
              onChange={e => setFormData({...formData, temperature: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">Seleccionar...</option>
              <option value="25°C">Ambiente (25°C)</option>
              <option value="4°C">Refrigerado (4°C)</option>
              <option value="-20°C">Congelado (-20°C)</option>
              <option value="-80°C">Ultra-frío (-80°C)</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Proyecto</label>
            <input
              type="text"
              value={formData.project}
              onChange={e => setFormData({...formData, project: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              placeholder="Ej: Analgésicos Novel"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Notas</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 h-24 resize-none"
              placeholder="Observaciones adicionales..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <button type="button" onClick={() => setShowNewSample(false)} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Crear Muestra
          </button>
        </div>
      </form>
    );
  };

  // Sample Detail View
  const SampleDetail = ({ sample }) => {
    const custodyChain = [
      { action: 'Creación', user: sample.assignee, date: sample.created, time: '09:00', icon: Plus },
      { action: 'Análisis NMR', user: 'Dra. Sánchez', date: sample.created, time: '11:30', icon: Eye },
      { action: 'Verificación', user: 'Dr. García', date: sample.created, time: '14:15', icon: CheckCircle },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-cyan-400 text-lg">{sample.id}</span>
              <StatusBadge status={sample.status} />
            </div>
            <h3 className="text-xl font-semibold text-white">{sample.name}</h3>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <QrCode className="w-4 h-4" /> Generar QR
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4" /> Transferir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <MapPin className="w-4 h-4" /> Ubicación
            </div>
            <p className="font-medium text-white">{sample.location}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Thermometer className="w-4 h-4" /> Temperatura
            </div>
            <p className="font-medium text-white">{sample.temperature}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Calendar className="w-4 h-4" /> Creación
            </div>
            <p className="font-medium text-white">{sample.created}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <User className="w-4 h-4" /> Responsable
            </div>
            <p className="font-medium text-white">{sample.assignee}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Cadena de Custodia</h4>
          <div className="space-y-3">
            {custodyChain.map((event, i) => {
              const Icon = event.icon;
              return (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{event.action}</p>
                    <p className="text-sm text-gray-400">{event.user}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{event.date}</p>
                    <p>{event.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <button className="btn-secondary flex items-center gap-2">
            <Edit className="w-4 h-4" /> Editar
          </button>
          <button className="btn-secondary flex items-center gap-2 text-amber-400 border-amber-500/30 hover:bg-amber-500/10">
            Cuarentena
          </button>
          <button className="btn-secondary flex items-center gap-2 text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
            <Trash2 className="w-4 h-4" /> Eliminar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Muestras</h2>
          <p className="text-gray-400">Trazabilidad completa de muestras de laboratorio</p>
        </div>
        <button onClick={() => setShowNewSample(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Nueva Muestra
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por ID o nombre..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 min-w-40"
          >
            <option value="all">Todos los estados</option>
            <option value="in_progress">En Proceso</option>
            <option value="completed">Completada</option>
            <option value="pending">Pendiente</option>
            <option value="quarantine">Cuarentena</option>
            <option value="in_transit">En Tránsito</option>
            <option value="archived">Archivada</option>
          </select>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 min-w-40"
          >
            <option value="all">Todos los tipos</option>
            <option value="organic">Orgánica</option>
            <option value="inorganic">Inorgánica</option>
          </select>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-400">
        Mostrando {filteredSamples.length} de {samples.length} muestras
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50 bg-gray-800/50">
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Ubicación</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Temp.</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Responsable</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.map(sample => (
                <tr 
                  key={sample.id} 
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => setShowSampleDetail(sample)}
                >
                  <td className="py-4 px-4 font-mono text-sm text-cyan-400">{sample.id}</td>
                  <td className="py-4 px-4 text-sm text-white">{sample.name}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs rounded ${sample.type === 'organic' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-500/20 text-violet-400'}`}>
                      {sample.type === 'organic' ? 'Orgánica' : 'Inorgánica'}
                    </span>
                  </td>
                  <td className="py-4 px-4"><StatusBadge status={sample.status} /></td>
                  <td className="py-4 px-4 text-sm text-gray-400">{sample.location}</td>
                  <td className="py-4 px-4 text-sm text-gray-400">{sample.temperature}</td>
                  <td className="py-4 px-4 text-sm text-gray-400">{sample.assignee}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button 
                        className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
                        onClick={e => { e.stopPropagation(); setShowSampleDetail(sample); }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
                        onClick={e => e.stopPropagation()}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
                        onClick={e => e.stopPropagation()}
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showNewSample} onClose={() => setShowNewSample(false)} title="Nueva Muestra" size="md">
        <NewSampleForm />
      </Modal>

      <Modal isOpen={!!showSampleDetail} onClose={() => setShowSampleDetail(null)} title="Detalle de Muestra" size="lg">
        {showSampleDetail && <SampleDetail sample={showSampleDetail} />}
      </Modal>
    </div>
  );
};

export default Samples;
