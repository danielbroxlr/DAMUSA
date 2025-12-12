import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Clock, User, CheckCircle, FileText, Beaker, X, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const initialExperiments = [
  { id: 'EXP-2024-001', title: 'Síntesis de Aspirina por Acetilación', date: '2024-01-15', author: 'Dr. García', status: 'completed', yield: 87.5, project: 'Analgésicos Novel', objective: 'Sintetizar ácido acetilsalicílico mediante acetilación del ácido salicílico' },
  { id: 'EXP-2024-002', title: 'Optimización Paracetamol Route B', date: '2024-01-14', author: 'Dra. Martínez', status: 'in_review', yield: 92.1, project: 'Analgésicos Novel', objective: 'Optimizar la ruta sintética B para paracetamol' },
  { id: 'EXP-2024-003', title: 'Complejo Fe-EDTA Caracterización', date: '2024-01-16', author: 'Dr. López', status: 'draft', yield: null, project: 'Catalizadores', objective: 'Caracterizar el complejo Fe(III)-EDTA mediante técnicas espectroscópicas' },
  { id: 'EXP-2024-004', title: 'Resolución Quiral Ibuprofeno', date: '2024-01-13', author: 'Dr. García', status: 'pending_approval', yield: 45.2, project: 'Analgésicos Novel', objective: 'Resolver los enantiómeros del ibuprofeno mediante HPLC quiral' },
  { id: 'EXP-2024-005', title: 'Síntesis Nanopartículas Au', date: '2024-01-12', author: 'Dra. Sánchez', status: 'completed', yield: 78.3, project: 'Nanomateriales', objective: 'Preparar nanopartículas de oro mediante reducción química' },
];

const StatusBadge = ({ status }) => {
  const config = {
    completed: { label: 'Completado', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    in_review: { label: 'En Revisión', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    draft: { label: 'Borrador', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    pending_approval: { label: 'Pendiente Aprobación', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  }[status] || { label: status, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full border ${config.color}`}>{config.label}</span>;
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl', full: 'max-w-7xl' };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className={`glass rounded-2xl ${sizes[size]} w-full mx-4 max-h-[90vh] overflow-hidden animate-fadeIn`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">{children}</div>
      </div>
    </div>
  );
};

const ELN = () => {
  const [experiments, setExperiments] = useState(initialExperiments);
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = experiments.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(search.toLowerCase()) || exp.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || exp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const ExperimentEditor = ({ onClose, experiment = null }) => {
    const [form, setForm] = useState(experiment || {
      title: '', project: '', objective: '', hypothesis: '', procedure: '', observations: '', results: '', conclusions: ''
    });
    
    const handleSubmit = (isDraft = false) => {
      const newExp = {
        id: experiment?.id || `EXP-2024-${String(experiments.length + 1).padStart(3, '0')}`,
        ...form,
        date: new Date().toISOString().split('T')[0],
        author: 'Usuario Actual',
        status: isDraft ? 'draft' : 'pending_approval',
        yield: null
      };
      if (experiment) {
        setExperiments(experiments.map(e => e.id === experiment.id ? newExp : e));
      } else {
        setExperiments([newExp, ...experiments]);
      }
      onClose();
      toast.success(isDraft ? 'Borrador guardado' : 'Experimento enviado para revisión');
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Título del Experimento *</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Ej: Síntesis de Aspirina por Acetilación" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Proyecto</label>
            <select value={form.project} onChange={e => setForm({...form, project: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
              <option value="">Seleccionar...</option>
              <option value="Analgésicos Novel">Analgésicos Novel</option>
              <option value="Catalizadores">Catalizadores</option>
              <option value="Nanomateriales">Nanomateriales</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Template</label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
              <option value="">Sin template</option>
              <option value="synthesis">Síntesis Orgánica</option>
              <option value="characterization">Caracterización</option>
              <option value="purification">Purificación</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Objetivo</label>
          <textarea value={form.objective} onChange={e => setForm({...form, objective: e.target.value})} placeholder="Describe el objetivo principal del experimento..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-20 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Hipótesis</label>
          <textarea value={form.hypothesis} onChange={e => setForm({...form, hypothesis: e.target.value})} placeholder="¿Qué resultados esperas obtener?" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-20 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Esquema de Reacción</label>
          <div className="bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl h-32 flex items-center justify-center">
            <div className="text-center text-gray-500"><Beaker className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">Editor de estructuras (Ketcher)</p></div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Procedimiento</label>
          <textarea value={form.procedure} onChange={e => setForm({...form, procedure: e.target.value})} placeholder="Describe el procedimiento paso a paso..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-40 resize-none font-mono text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Observaciones</label>
            <textarea value={form.observations} onChange={e => setForm({...form, observations: e.target.value})} placeholder="Observaciones durante el experimento..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-32 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Resultados</label>
            <textarea value={form.results} onChange={e => setForm({...form, results: e.target.value})} placeholder="Resultados obtenidos..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-32 resize-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Conclusiones</label>
          <textarea value={form.conclusions} onChange={e => setForm({...form, conclusions: e.target.value})} placeholder="Conclusiones del experimento..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-24 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Adjuntos</label>
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center">
            <p className="text-gray-500">Arrastra archivos aquí o haz clic para seleccionar</p>
            <p className="text-xs text-gray-600 mt-1">Espectros, imágenes, datos...</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={() => handleSubmit(true)} className="btn-secondary flex items-center gap-2"><Save className="w-4 h-4" /> Guardar Borrador</button>
          <button onClick={() => handleSubmit(false)} className="btn-primary flex items-center gap-2"><Send className="w-4 h-4" /> Enviar para Revisión</button>
        </div>
      </div>
    );
  };

  const ExperimentDetail = ({ experiment }) => (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-cyan-400">{experiment.id}</span>
            <StatusBadge status={experiment.status} />
          </div>
          <h3 className="text-2xl font-bold text-white">{experiment.title}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {experiment.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {experiment.date}</span>
            <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {experiment.project}</span>
          </div>
        </div>
        {experiment.yield && (
          <div className="text-right">
            <p className="text-sm text-gray-400">Rendimiento</p>
            <p className="text-3xl font-bold text-emerald-400">{experiment.yield}%</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Objetivo</h4>
            <p className="text-gray-300">{experiment.objective || 'No especificado'}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Esquema de Reacción</h4>
            <div className="bg-gray-900 rounded-lg h-40 flex items-center justify-center">
              <Beaker className="w-12 h-12 text-gray-700" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Datos Analíticos</h4>
            <div className="grid grid-cols-2 gap-2">
              {['¹H NMR', '¹³C NMR', 'IR', 'MS'].map(s => (
                <button key={s} className="btn-secondary text-sm py-2"><Eye className="w-4 h-4 inline mr-1" />{s}</button>
              ))}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Historial de Firmas</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Creado por {experiment.author}</span>
                <span className="text-gray-500 ml-auto">{experiment.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <button className="btn-secondary flex items-center gap-2"><Edit className="w-4 h-4" /> Editar</button>
        <button className="btn-secondary flex items-center gap-2"><Eye className="w-4 h-4" /> Exportar PDF</button>
        {experiment.status === 'pending_approval' && (
          <button className="btn-primary flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Aprobar</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">Cuaderno Electrónico (ELN)</h2><p className="text-gray-400">Registro y documentación de experimentos</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" /> Nuevo Experimento</button>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input placeholder="Buscar experimentos..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white min-w-40">
          <option value="all">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="pending_approval">Pendiente Aprobación</option>
          <option value="in_review">En Revisión</option>
          <option value="completed">Completado</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(exp => (
          <div key={exp.id} className="glass rounded-xl p-5 card-hover cursor-pointer" onClick={() => setSelected(exp)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm text-cyan-400">{exp.id}</span>
                  <StatusBadge status={exp.status} />
                </div>
                <h3 className="font-semibold text-white text-lg">{exp.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{exp.objective}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {exp.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exp.date}</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {exp.project}</span>
                </div>
              </div>
              {exp.yield && (
                <div className="text-right ml-4">
                  <p className="text-xs text-gray-500">Rendimiento</p>
                  <p className="text-2xl font-bold text-emerald-400">{exp.yield}%</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Nuevo Experimento" size="full">
        <ExperimentEditor onClose={() => setShowNew(false)} />
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Detalle del Experimento" size="xl">
        {selected && <ExperimentDetail experiment={selected} />}
      </Modal>
    </div>
  );
};

export default ELN;
