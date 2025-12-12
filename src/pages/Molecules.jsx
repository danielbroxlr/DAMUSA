import React, { useState } from 'react';
import { Plus, Search, Download, Eye, Edit, Atom, AlertTriangle, X, Grid, List } from 'lucide-react';
import toast from 'react-hot-toast';

const initialMolecules = [
  { id: 'MOL-001', name: 'Ácido Acetilsalicílico', formula: 'C9H8O4', mw: 180.16, smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O', logP: 1.19, pKa: 3.5, status: 'validated', category: 'aromatic' },
  { id: 'MOL-002', name: 'Paracetamol', formula: 'C8H9NO2', mw: 151.16, smiles: 'CC(=O)NC1=CC=C(O)C=C1', logP: 0.46, pKa: 9.5, status: 'validated', category: 'aromatic' },
  { id: 'MOL-003', name: 'Ibuprofeno', formula: 'C13H18O2', mw: 206.28, smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', logP: 3.97, pKa: 4.91, status: 'validated', category: 'aromatic' },
  { id: 'MOL-004', name: 'EDTA', formula: 'C10H16N2O8', mw: 292.24, smiles: 'OC(=O)CN(CCN(CC(=O)O)CC(=O)O)CC(=O)O', logP: -3.86, pKa: 2.0, status: 'pending', category: 'chelator' },
  { id: 'MOL-005', name: 'Benzocaína', formula: 'C9H11NO2', mw: 165.19, smiles: 'CCOC(=O)C1=CC=C(N)C=C1', logP: 1.86, pKa: 2.51, status: 'validated', category: 'ester' },
  { id: 'MOL-006', name: 'Lidocaína', formula: 'C14H22N2O', mw: 234.34, smiles: 'CCN(CC)CC(=O)NC1=C(C)C=CC=C1C', logP: 2.44, pKa: 7.9, status: 'validated', category: 'amide' },
];

const StatusBadge = ({ status }) => {
  const config = {
    validated: { label: 'Validada', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    pending: { label: 'Pendiente', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  }[status] || { label: status, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full border ${config.color}`}>{config.label}</span>;
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
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

const MoleculeCard = ({ molecule, onClick }) => (
  <div className="glass rounded-xl p-6 card-hover cursor-pointer" onClick={() => onClick(molecule)}>
    <div className="flex items-start justify-between mb-4">
      <span className="font-mono text-sm text-cyan-400">{molecule.id}</span>
      <StatusBadge status={molecule.status} />
    </div>
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-dashed border-gray-700 rounded-lg mb-4 h-32 flex items-center justify-center">
      <Atom className="w-8 h-8 text-gray-600" />
    </div>
    <h3 className="font-semibold text-white mb-1">{molecule.name}</h3>
    <p className="font-mono text-sm text-gray-400 mb-3">{molecule.formula}</p>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="bg-gray-800/50 rounded px-2 py-1"><span className="text-gray-500">PM:</span> <span className="text-white">{molecule.mw}</span></div>
      <div className="bg-gray-800/50 rounded px-2 py-1"><span className="text-gray-500">LogP:</span> <span className="text-white">{molecule.logP}</span></div>
    </div>
  </div>
);

const Molecules = () => {
  const [molecules, setMolecules] = useState(initialMolecules);
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');

  const filtered = molecules.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.formula.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  );

  const NewForm = () => {
    const [form, setForm] = useState({ name: '', formula: '', smiles: '', mw: '', logP: '', pKa: '', category: 'aromatic' });
    const handleSubmit = (e) => {
      e.preventDefault();
      setMolecules([{ id: `MOL-${String(molecules.length + 1).padStart(3, '0')}`, ...form, mw: parseFloat(form.mw) || 0, logP: parseFloat(form.logP) || 0, pKa: parseFloat(form.pKa) || 0, status: 'pending' }, ...molecules]);
      setShowNew(false);
      toast.success('Molécula registrada');
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl h-40 flex items-center justify-center">
          <div className="text-center text-gray-500"><Atom className="w-10 h-10 mx-auto mb-2" /><p className="text-sm">Editor de estructura (Ketcher)</p></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="Nombre *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="col-span-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <input required placeholder="Fórmula (C9H8O4) *" value={form.formula} onChange={e => setForm({...form, formula: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono" />
          <input placeholder="PM (g/mol)" type="number" step="0.01" value={form.mw} onChange={e => setForm({...form, mw: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <input required placeholder="SMILES *" value={form.smiles} onChange={e => setForm({...form, smiles: e.target.value})} className="col-span-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono" />
          <input placeholder="LogP" type="number" step="0.01" value={form.logP} onChange={e => setForm({...form, logP: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <input placeholder="pKa" type="number" step="0.1" value={form.pKa} onChange={e => setForm({...form, pKa: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <button type="button" onClick={() => setShowNew(false)} className="btn-secondary">Cancelar</button>
          <button type="submit" className="btn-primary">Registrar</button>
        </div>
      </form>
    );
  };

  const Detail = ({ molecule }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl h-64 flex items-center justify-center">
          <div className="text-center text-gray-500"><Atom className="w-12 h-12 mx-auto mb-2" /><p className="text-xs font-mono max-w-xs break-all">{molecule.smiles}</p></div>
        </div>
        <div className="space-y-4">
          <div><span className="font-mono text-cyan-400">{molecule.id}</span><h3 className="text-2xl font-bold text-white">{molecule.name}</h3><p className="text-xl font-mono text-gray-400">{molecule.formula}</p></div>
          <div className="grid grid-cols-2 gap-3">
            {[['Peso Molecular', `${molecule.mw} g/mol`], ['LogP', molecule.logP], ['pKa', molecule.pKa], ['Categoría', molecule.category]].map(([label, val]) => (
              <div key={label} className="bg-gray-800/50 rounded-lg p-3"><p className="text-xs text-gray-500">{label}</p><p className="font-semibold text-white capitalize">{val}</p></div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-6">
        <h4 className="font-semibold text-white mb-4">Datos Espectrales</h4>
        <div className="grid grid-cols-4 gap-3">
          {['¹H NMR', '¹³C NMR', 'IR', 'MS'].map(s => <button key={s} className="btn-secondary text-sm"><Eye className="w-4 h-4 inline mr-2" />{s}</button>)}
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <button className="btn-secondary"><Edit className="w-4 h-4 inline mr-2" />Editar</button>
        <button className="btn-secondary"><Download className="w-4 h-4 inline mr-2" />Exportar SD</button>
        <button className="btn-primary"><Plus className="w-4 h-4 inline mr-2" />Crear Muestra</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">Registro de Moléculas</h2><p className="text-gray-400">Base de datos de compuestos químicos</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" /> Nueva Molécula</button>
      </div>
      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input placeholder="Buscar por nombre, fórmula, SMILES..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white" />
        </div>
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400'}`}><Grid className="w-5 h-5" /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400'}`}><List className="w-5 h-5" /></button>
        </div>
        <button className="btn-secondary"><Download className="w-4 h-4 inline mr-2" />Exportar SD</button>
      </div>
      <p className="text-sm text-gray-400">{filtered.length} moléculas encontradas</p>
      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
        {filtered.map(m => view === 'grid' ? <MoleculeCard key={m.id} molecule={m} onClick={setSelected} /> : (
          <div key={m.id} className="glass rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-800/50" onClick={() => setSelected(m)}>
            <Atom className="w-8 h-8 text-gray-600" />
            <div className="flex-1"><p className="font-semibold text-white">{m.name}</p><p className="text-sm text-gray-400 font-mono">{m.formula}</p></div>
            <StatusBadge status={m.status} />
          </div>
        ))}
      </div>
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Nueva Molécula" size="lg"><NewForm /></Modal>
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Detalle de Molécula" size="xl">{selected && <Detail molecule={selected} />}</Modal>
    </div>
  );
};

export default Molecules;
