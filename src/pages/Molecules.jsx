import React, { useState } from 'react';
import { Plus, Search, Download, Eye, Edit, Trash2, Atom, AlertTriangle, X, Save, TestTube } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../App';

const initialMolecules = [
  { id: 'MOL-001', name: 'Ácido Acetilsalicílico', formula: 'C9H8O4', mw: 180.16, smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O', logP: 1.19, pKa: 3.5, status: 'validated', category: 'aromatic' },
  { id: 'MOL-002', name: 'Paracetamol', formula: 'C8H9NO2', mw: 151.16, smiles: 'CC(=O)NC1=CC=C(O)C=C1', logP: 0.46, pKa: 9.5, status: 'validated', category: 'aromatic' },
  { id: 'MOL-003', name: 'Ibuprofeno', formula: 'C13H18O2', mw: 206.28, smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', logP: 3.97, pKa: 4.91, status: 'validated', category: 'aromatic' },
  { id: 'MOL-004', name: 'EDTA', formula: 'C10H16N2O8', mw: 292.24, smiles: 'OC(=O)CN(CCN(CC(=O)O)CC(=O)O)CC(=O)O', logP: -3.86, pKa: 2.0, status: 'pending', category: 'chelator' },
];

const StatusBadge = ({ status }) => {
  const cfg = { validated: 'bg-emerald-500/20 text-emerald-400', pending: 'bg-amber-500/20 text-amber-400' };
  return <span className={`px-2 py-1 text-xs rounded-full ${cfg[status] || 'bg-gray-500/20 text-gray-400'}`}>{status === 'validated' ? 'Validada' : 'Pendiente'}</span>;
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={onClose}>
      <div className={`bg-gray-800 border border-gray-700 rounded-2xl ${size === 'lg' ? 'max-w-4xl' : 'max-w-2xl'} w-full mx-4 max-h-[90vh] overflow-hidden`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
};

const Molecules = () => {
  const { hasPermission } = useApp();
  const [molecules, setMolecules] = useState(initialMolecules);
  const [modal, setModal] = useState({ type: null, data: null });
  const [search, setSearch] = useState('');

  const canEdit = hasPermission('canEditMolecules');
  const canDelete = hasPermission('canDeleteMolecules');

  const filtered = molecules.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.formula.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()));
  const closeModal = () => setModal({ type: null, data: null });

  const saveMolecule = (form, isNew) => {
    if (isNew) {
      const newId = `MOL-${String(molecules.length + 1).padStart(3, '0')}`;
      setMolecules([{ id: newId, ...form, status: 'pending' }, ...molecules]);
      toast.success('Molécula registrada');
    } else {
      setMolecules(molecules.map(m => m.id === form.id ? { ...m, ...form } : m));
      toast.success('Molécula actualizada');
    }
    closeModal();
  };

  const deleteMolecule = (id) => {
    if (!canDelete) { toast.error('Sin permiso'); return; }
    if (confirm('¿Eliminar?')) { setMolecules(molecules.filter(m => m.id !== id)); toast.success('Eliminada'); closeModal(); }
  };

  const exportSD = () => {
    const content = molecules.map(m => `${m.name}\n${m.formula}\n${m.smiles}\n$$$$`).join('\n');
    const blob = new Blob([content], { type: 'chemical/x-mdl-sdfile' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'molecules.sdf'; a.click();
    toast.success('SD File exportado');
  };

  const MoleculeForm = ({ molecule }) => {
    const [f, setF] = useState(molecule || { name: '', formula: '', smiles: '', mw: '', logP: '', pKa: '', category: 'aromatic' });
    return (
      <form onSubmit={e => { e.preventDefault(); saveMolecule(molecule ? { ...molecule, ...f } : f, !molecule); }} className="space-y-4">
        <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl h-40 flex items-center justify-center mb-4">
          <Atom className="w-10 h-10 text-gray-600" />
        </div>
        <input required placeholder="Nombre *" value={f.name} onChange={e => setF({...f, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="Fórmula (C9H8O4) *" value={f.formula} onChange={e => setF({...f, formula: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono" />
          <input placeholder="PM (g/mol)" type="number" step="0.01" value={f.mw} onChange={e => setF({...f, mw: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
        </div>
        <input required placeholder="SMILES *" value={f.smiles} onChange={e => setF({...f, smiles: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono" />
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="LogP" type="number" step="0.01" value={f.logP} onChange={e => setF({...f, logP: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <input placeholder="pKa" type="number" step="0.1" value={f.pKa} onChange={e => setF({...f, pKa: e.target.value})} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
        </div>
        <div className="flex justify-end gap-3"><button type="button" onClick={closeModal} className="btn-secondary">Cancelar</button><button type="submit" className="btn-primary">{molecule ? 'Guardar' : 'Registrar'}</button></div>
      </form>
    );
  };

  const MoleculeDetail = ({ molecule }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl h-48 flex items-center justify-center">
          <div className="text-center"><Atom className="w-12 h-12 mx-auto text-gray-600" /><p className="text-xs font-mono text-gray-500 mt-2 max-w-xs break-all">{molecule.smiles}</p></div>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2"><span className="font-mono text-cyan-400">{molecule.id}</span><StatusBadge status={molecule.status} /></div>
          <h3 className="text-2xl font-bold text-white">{molecule.name}</h3>
          <p className="text-xl font-mono text-gray-400">{molecule.formula}</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-900 rounded-lg p-3"><p className="text-xs text-gray-500">PM</p><p className="text-white font-semibold">{molecule.mw} g/mol</p></div>
            <div className="bg-gray-900 rounded-lg p-3"><p className="text-xs text-gray-500">LogP</p><p className="text-white font-semibold">{molecule.logP}</p></div>
            <div className="bg-gray-900 rounded-lg p-3"><p className="text-xs text-gray-500">pKa</p><p className="text-white font-semibold">{molecule.pKa}</p></div>
            <div className="bg-gray-900 rounded-lg p-3"><p className="text-xs text-gray-500">Categoría</p><p className="text-white font-semibold capitalize">{molecule.category}</p></div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-400 mb-3">Espectros disponibles:</p>
        <div className="flex gap-2 flex-wrap">
          {['¹H NMR', '¹³C NMR', 'IR', 'MS'].map(s => <button key={s} onClick={() => toast.success(`${s} cargado`)} className="btn-secondary text-sm"><Eye className="w-4 h-4 mr-1" />{s}</button>)}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
        {canEdit && <button onClick={() => setModal({ type: 'edit', data: molecule })} className="btn-secondary"><Edit className="w-4 h-4 mr-1" />Editar</button>}
        <button onClick={() => { exportSD(); }} className="btn-secondary"><Download className="w-4 h-4 mr-1" />Exportar SD</button>
        <button onClick={() => toast.success('Muestra creada desde molécula')} className="btn-primary"><TestTube className="w-4 h-4 mr-1" />Crear Muestra</button>
        {canDelete && <button onClick={() => deleteMolecule(molecule.id)} className="btn-secondary text-rose-400"><Trash2 className="w-4 h-4 mr-1" />Eliminar</button>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">Registro de Moléculas</h2><p className="text-gray-400">Base de datos de compuestos</p></div>
        <button onClick={() => setModal({ type: 'new', data: null })} className="btn-primary"><Plus className="w-5 h-5 mr-2" />Nueva Molécula</button>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input placeholder="Buscar nombre, fórmula, SMILES..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white" />
        </div>
        <button onClick={exportSD} className="btn-secondary"><Download className="w-4 h-4 mr-2" />Exportar SD</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(m => (
          <div key={m.id} onClick={() => setModal({ type: 'view', data: m })} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 cursor-pointer hover:border-cyan-500/50 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3"><span className="font-mono text-sm text-cyan-400">{m.id}</span><StatusBadge status={m.status} /></div>
            <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-lg h-28 flex items-center justify-center mb-3"><Atom className="w-8 h-8 text-gray-600" /></div>
            <h3 className="font-semibold text-white">{m.name}</h3>
            <p className="font-mono text-sm text-gray-400">{m.formula}</p>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="bg-gray-900 rounded px-2 py-1"><span className="text-gray-500">PM:</span> <span className="text-white">{m.mw}</span></div>
              <div className="bg-gray-900 rounded px-2 py-1"><span className="text-gray-500">LogP:</span> <span className="text-white">{m.logP}</span></div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modal.type === 'new'} onClose={closeModal} title="Nueva Molécula"><MoleculeForm /></Modal>
      <Modal isOpen={modal.type === 'edit'} onClose={closeModal} title="Editar Molécula"><MoleculeForm molecule={modal.data} /></Modal>
      <Modal isOpen={modal.type === 'view'} onClose={closeModal} title="Detalle" size="lg">{modal.data && <MoleculeDetail molecule={modal.data} />}</Modal>
    </div>
  );
};

export default Molecules;
