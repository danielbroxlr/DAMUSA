import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, Clock, User, CheckCircle, FileText, Beaker, X, Save, Send, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../App';

const initialExperiments = [
  { id: 'EXP-2024-001', title: 'Síntesis de Aspirina por Acetilación', date: '2024-01-15', author: 'Dr. García', status: 'completed', yield: 87.5, project: 'Analgésicos Novel', objective: 'Sintetizar ácido acetilsalicílico mediante acetilación', procedure: 'Se disolvió 2g de ácido salicílico...', observations: 'Cristales blancos', results: 'Rendimiento 87.5%' },
  { id: 'EXP-2024-002', title: 'Optimización Paracetamol Route B', date: '2024-01-14', author: 'Dra. Martínez', status: 'in_review', yield: 92.1, project: 'Analgésicos Novel', objective: 'Optimizar ruta sintética B' },
  { id: 'EXP-2024-003', title: 'Complejo Fe-EDTA Caracterización', date: '2024-01-16', author: 'Dr. López', status: 'draft', yield: null, project: 'Catalizadores', objective: 'Caracterizar complejo Fe(III)-EDTA' },
  { id: 'EXP-2024-004', title: 'Resolución Quiral Ibuprofeno', date: '2024-01-13', author: 'Dr. García', status: 'pending_approval', yield: 45.2, project: 'Analgésicos Novel', objective: 'Resolver enantiómeros' },
];

const StatusBadge = ({ status }) => {
  const cfg = { completed: 'bg-emerald-500/20 text-emerald-400', in_review: 'bg-amber-500/20 text-amber-400', draft: 'bg-gray-500/20 text-gray-400', pending_approval: 'bg-orange-500/20 text-orange-400' };
  const labels = { completed: 'Completado', in_review: 'En Revisión', draft: 'Borrador', pending_approval: 'Pend. Aprobación' };
  return <span className={`px-2 py-1 text-xs rounded-full ${cfg[status] || 'bg-gray-500/20 text-gray-400'}`}>{labels[status] || status}</span>;
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={onClose}>
      <div className={`bg-gray-800 border border-gray-700 rounded-2xl ${size === 'xl' ? 'max-w-5xl' : size === 'lg' ? 'max-w-4xl' : 'max-w-2xl'} w-full mx-4 max-h-[90vh] overflow-hidden`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
};

const ELN = () => {
  const { hasPermission, isAdmin } = useApp();
  const [experiments, setExperiments] = useState(initialExperiments);
  const [modal, setModal] = useState({ type: null, data: null });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const canApprove = hasPermission('canApproveExperiments');
  const canOpen = hasPermission('canOpenNotebooks');

  const filtered = experiments.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const closeModal = () => setModal({ type: null, data: null });

  const saveExperiment = (form, isNew, isDraft = false) => {
    const status = isDraft ? 'draft' : 'pending_approval';
    if (isNew) {
      const newId = `EXP-2024-${String(experiments.length + 1).padStart(3, '0')}`;
      setExperiments([{ id: newId, ...form, date: new Date().toISOString().split('T')[0], author: 'Usuario Actual', status, yield: null }, ...experiments]);
      toast.success(isDraft ? 'Borrador guardado' : 'Enviado para revisión');
    } else {
      setExperiments(experiments.map(e => e.id === form.id ? { ...e, ...form, status } : e));
      toast.success('Experimento actualizado');
    }
    closeModal();
  };

  const approveExperiment = (id) => {
    if (!canApprove) { toast.error('Sin permiso para aprobar'); return; }
    setExperiments(experiments.map(e => e.id === id ? { ...e, status: 'completed' } : e));
    toast.success('Experimento aprobado y firmado');
    closeModal();
  };

  const deleteExperiment = (id) => {
    if (confirm('¿Eliminar experimento?')) {
      setExperiments(experiments.filter(e => e.id !== id));
      toast.success('Eliminado');
      closeModal();
    }
  };

  const exportPDF = (exp) => {
    toast.success(`PDF de ${exp.id} generado`);
  };

  const ExperimentForm = ({ experiment }) => {
    const [f, setF] = useState(experiment || { title: '', project: '', objective: '', hypothesis: '', procedure: '', observations: '', results: '', conclusions: '' });
    return (
      <div className="space-y-4">
        <input required placeholder="Título del Experimento *" value={f.title} onChange={e => setF({...f, title: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg" />
        <div className="grid grid-cols-2 gap-4">
          <select value={f.project} onChange={e => setF({...f, project: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option value="">Proyecto...</option><option value="Analgésicos Novel">Analgésicos Novel</option><option value="Catalizadores">Catalizadores</option><option value="Nanomateriales">Nanomateriales</option>
          </select>
          <select className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option value="">Template...</option><option>Síntesis Orgánica</option><option>Caracterización</option><option>Purificación</option>
          </select>
        </div>
        <textarea placeholder="Objetivo" value={f.objective} onChange={e => setF({...f, objective: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white h-20 resize-none" />
        <textarea placeholder="Hipótesis" value={f.hypothesis} onChange={e => setF({...f, hypothesis: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white h-20 resize-none" />
        <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl h-32 flex items-center justify-center">
          <Beaker className="w-8 h-8 text-gray-600" />
        </div>
        <textarea placeholder="Procedimiento paso a paso..." value={f.procedure} onChange={e => setF({...f, procedure: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white h-32 resize-none font-mono text-sm" />
        <div className="grid grid-cols-2 gap-4">
          <textarea placeholder="Observaciones" value={f.observations} onChange={e => setF({...f, observations: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white h-24 resize-none" />
          <textarea placeholder="Resultados" value={f.results} onChange={e => setF({...f, results: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white h-24 resize-none" />
        </div>
        <textarea placeholder="Conclusiones" value={f.conclusions} onChange={e => setF({...f, conclusions: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white h-20 resize-none" />
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <button onClick={closeModal} className="btn-secondary">Cancelar</button>
          <button onClick={() => saveExperiment(experiment ? { ...experiment, ...f } : f, !experiment, true)} className="btn-secondary"><Save className="w-4 h-4 mr-1" />Borrador</button>
          <button onClick={() => saveExperiment(experiment ? { ...experiment, ...f } : f, !experiment, false)} className="btn-primary"><Send className="w-4 h-4 mr-1" />Enviar</button>
        </div>
      </div>
    );
  };

  const ExperimentDetail = ({ experiment }) => (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2"><span className="font-mono text-cyan-400">{experiment.id}</span><StatusBadge status={experiment.status} /></div>
          <h3 className="text-2xl font-bold text-white">{experiment.title}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <span><User className="w-4 h-4 inline mr-1" />{experiment.author}</span>
            <span><Clock className="w-4 h-4 inline mr-1" />{experiment.date}</span>
            <span><FileText className="w-4 h-4 inline mr-1" />{experiment.project}</span>
          </div>
        </div>
        {experiment.yield && <div className="text-right"><p className="text-sm text-gray-400">Rendimiento</p><p className="text-3xl font-bold text-emerald-400">{experiment.yield}%</p></div>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-lg p-4"><h4 className="text-white font-semibold mb-2">Objetivo</h4><p className="text-gray-300">{experiment.objective || 'No especificado'}</p></div>
        <div className="bg-gray-900 rounded-lg p-4"><h4 className="text-white font-semibold mb-2">Esquema de Reacción</h4><div className="h-32 flex items-center justify-center"><Beaker className="w-12 h-12 text-gray-700" /></div></div>
      </div>
      {experiment.procedure && <div className="bg-gray-900 rounded-lg p-4"><h4 className="text-white font-semibold mb-2">Procedimiento</h4><p className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{experiment.procedure}</p></div>}
      <div className="border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-400 mb-3">Datos analíticos:</p>
        <div className="flex gap-2 flex-wrap">
          {['¹H NMR', '¹³C NMR', 'IR', 'MS'].map(s => <button key={s} onClick={() => toast.success(`${s} cargado`)} className="btn-secondary text-sm"><Eye className="w-4 h-4 mr-1" />{s}</button>)}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
        <button onClick={() => setModal({ type: 'edit', data: experiment })} className="btn-secondary"><Edit className="w-4 h-4 mr-1" />Editar</button>
        <button onClick={() => exportPDF(experiment)} className="btn-secondary"><Download className="w-4 h-4 mr-1" />PDF</button>
        {canApprove && experiment.status === 'pending_approval' && <button onClick={() => approveExperiment(experiment.id)} className="btn-primary"><CheckCircle className="w-4 h-4 mr-1" />Aprobar</button>}
        <button onClick={() => deleteExperiment(experiment.id)} className="btn-secondary text-rose-400"><Trash2 className="w-4 h-4 mr-1" />Eliminar</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">Cuaderno Electrónico (ELN)</h2><p className="text-gray-400">Registro de experimentos</p></div>
        {canOpen ? <button onClick={() => setModal({ type: 'new', data: null })} className="btn-primary"><Plus className="w-5 h-5 mr-2" />Nuevo Experimento</button> : <span className="text-sm text-gray-500">Solo lectura</span>}
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input placeholder="Buscar experimentos..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white">
          <option value="all">Todo Estado</option><option value="draft">Borrador</option><option value="pending_approval">Pend. Aprobación</option><option value="in_review">En Revisión</option><option value="completed">Completado</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(exp => (
          <div key={exp.id} onClick={() => setModal({ type: 'view', data: exp })} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 cursor-pointer hover:border-cyan-500/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2"><span className="font-mono text-sm text-cyan-400">{exp.id}</span><StatusBadge status={exp.status} /></div>
                <h3 className="font-semibold text-white text-lg">{exp.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{exp.objective}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span><User className="w-3 h-3 inline mr-1" />{exp.author}</span>
                  <span><Clock className="w-3 h-3 inline mr-1" />{exp.date}</span>
                  <span><FileText className="w-3 h-3 inline mr-1" />{exp.project}</span>
                </div>
              </div>
              {exp.yield && <div className="text-right"><p className="text-xs text-gray-500">Rendimiento</p><p className="text-2xl font-bold text-emerald-400">{exp.yield}%</p></div>}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modal.type === 'new'} onClose={closeModal} title="Nuevo Experimento" size="xl"><ExperimentForm /></Modal>
      <Modal isOpen={modal.type === 'edit'} onClose={closeModal} title="Editar Experimento" size="xl"><ExperimentForm experiment={modal.data} /></Modal>
      <Modal isOpen={modal.type === 'view'} onClose={closeModal} title="Detalle" size="lg">{modal.data && <ExperimentDetail experiment={modal.data} />}</Modal>
    </div>
  );
};

export default ELN;
