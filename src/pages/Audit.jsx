import React, { useState } from 'react';
import { Search, Download, Filter, Eye, FileText, User, Clock, ArrowRight } from 'lucide-react';

const auditLogs = [
  { id: 1, action: 'Sample Created', category: 'samples', user: 'Dr. García', target: 'ORG-2024-001', timestamp: '2024-01-15 09:23:45', ip: '192.168.1.100', details: 'Nueva muestra registrada: Aspirina Síntesis Batch A' },
  { id: 2, action: 'Status Changed', category: 'samples', user: 'Dra. Martínez', target: 'ORG-2024-002', timestamp: '2024-01-15 10:15:22', ip: '192.168.1.101', details: 'Estado cambiado: in_progress → completed' },
  { id: 3, action: 'Experiment Submitted', category: 'eln', user: 'Dr. López', target: 'EXP-2024-003', timestamp: '2024-01-16 08:30:00', ip: '192.168.1.102', details: 'Experimento enviado para revisión' },
  { id: 4, action: 'Transfer Initiated', category: 'samples', user: 'Dra. Sánchez', target: 'INO-2024-002', timestamp: '2024-01-15 14:45:10', ip: '192.168.1.103', details: 'Transferencia iniciada: Lab-B → Lab-C' },
  { id: 5, action: 'Molecule Registered', category: 'molecules', user: 'Dr. García', target: 'MOL-005', timestamp: '2024-01-14 16:20:33', ip: '192.168.1.100', details: 'Nueva molécula registrada: Benzocaína' },
  { id: 6, action: 'User Login', category: 'auth', user: 'Prof. Fernández', target: 'SESSION-8721', timestamp: '2024-01-16 07:00:00', ip: '192.168.1.50', details: 'Inicio de sesión exitoso' },
  { id: 7, action: 'Experiment Approved', category: 'eln', user: 'Prof. Fernández', target: 'EXP-2024-001', timestamp: '2024-01-15 17:30:00', ip: '192.168.1.50', details: 'Experimento aprobado y firmado digitalmente' },
  { id: 8, action: 'Report Generated', category: 'reports', user: 'Laura Gómez', target: 'RPT-2024-015', timestamp: '2024-01-15 18:00:00', ip: '192.168.1.104', details: 'Reporte de compliance generado' },
  { id: 9, action: 'Sample Archived', category: 'samples', user: 'Dr. García', target: 'ORG-2024-004', timestamp: '2024-01-14 12:00:00', ip: '192.168.1.100', details: 'Muestra archivada tras análisis completo' },
  { id: 10, action: 'Permission Changed', category: 'admin', user: 'Admin', target: 'USER-003', timestamp: '2024-01-13 09:00:00', ip: '192.168.1.1', details: 'Rol actualizado: junior_chemist → senior_chemist' },
];

const categoryColors = {
  samples: 'bg-cyan-500/20 text-cyan-400',
  eln: 'bg-emerald-500/20 text-emerald-400',
  molecules: 'bg-violet-500/20 text-violet-400',
  auth: 'bg-amber-500/20 text-amber-400',
  reports: 'bg-blue-500/20 text-blue-400',
  admin: 'bg-rose-500/20 text-rose-400',
};

const Audit = () => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || 
                         log.user.toLowerCase().includes(search.toLowerCase()) ||
                         log.target.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">Registro de Auditoría</h2><p className="text-gray-400">Historial completo de acciones del sistema (21 CFR Part 11)</p></div>
        <button className="btn-primary flex items-center gap-2"><Download className="w-5 h-5" /> Exportar Audit Trail</button>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input placeholder="Buscar en audit log..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white" />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white">
            <option value="all">Todas las categorías</option>
            <option value="samples">Muestras</option>
            <option value="eln">Experimentos</option>
            <option value="molecules">Moléculas</option>
            <option value="auth">Autenticación</option>
            <option value="reports">Reportes</option>
            <option value="admin">Administración</option>
          </select>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white" />
          <span className="text-gray-500">a</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white" />
        </div>
      </div>

      <div className="text-sm text-gray-400">{filtered.length} registros encontrados</div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50 bg-gray-800/50">
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Acción</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Categoría</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Usuario</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Objetivo</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">IP</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-400 font-mono">{log.timestamp}</td>
                <td className="py-4 px-4 text-sm text-white font-medium">{log.action}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${categoryColors[log.category]}`}>
                    {log.category}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-300">{log.user}</td>
                <td className="py-4 px-4 text-sm text-cyan-400 font-mono">{log.target}</td>
                <td className="py-4 px-4 text-sm text-gray-500 font-mono">{log.ip}</td>
                <td className="py-4 px-4">
                  <button onClick={() => setSelected(log)} className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="glass rounded-2xl max-w-lg w-full mx-4 p-6 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-white mb-4">Detalle del Registro</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-400">ID:</span><span className="text-white font-mono">#{selected.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Timestamp:</span><span className="text-white font-mono">{selected.timestamp}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Acción:</span><span className="text-white">{selected.action}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Usuario:</span><span className="text-white">{selected.user}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Objetivo:</span><span className="text-cyan-400 font-mono">{selected.target}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">IP:</span><span className="text-white font-mono">{selected.ip}</span></div>
              <div className="pt-3 border-t border-gray-700">
                <span className="text-gray-400 block mb-2">Detalles:</span>
                <p className="text-white bg-gray-800 rounded-lg p-3">{selected.details}</p>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="btn-secondary w-full mt-6">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audit;
