import React, { useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Atom, 
  BarChart3, 
  TestTube, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import Chart from 'chart.js/auto';

// KPI Card Component
const KPICard = ({ title, value, change, icon: Icon, color = 'cyan' }) => {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/30',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/30',
  };

  const iconColorClasses = {
    cyan: 'bg-cyan-500/20 text-cyan-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    violet: 'bg-violet-500/20 text-violet-400',
    rose: 'bg-rose-500/20 text-rose-400',
  };

  return (
    <div className={`glass rounded-xl p-6 bg-gradient-to-br ${colorClasses[color]} card-hover`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold font-mono text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(change)}% vs mes anterior
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Status Badge
const StatusBadge = ({ status }) => {
  const statusConfig = {
    in_progress: { label: 'En Proceso', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    completed: { label: 'Completada', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    pending: { label: 'Pendiente', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    in_review: { label: 'En Revisión', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    draft: { label: 'Borrador', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  };
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
};

// Mock Data
const mockKPIs = {
  experimentsCompleted: 47,
  moleculesSynthesized: 23,
  avgYield: 78.5,
  samplesProcessed: 156,
  pendingReviews: 8,
  equipmentUtilization: 72,
};

const recentSamples = [
  { id: 'ORG-2024-001', name: 'Aspirina Síntesis Batch A', status: 'in_progress', location: 'Lab-A-R3' },
  { id: 'ORG-2024-002', name: 'Paracetamol Derivado 2B', status: 'completed', location: 'Lab-A-R1' },
  { id: 'INO-2024-001', name: 'Complejo Fe(III)-EDTA', status: 'pending', location: 'Lab-B-R2' },
  { id: 'ORG-2024-003', name: 'Ibuprofeno Isómero R', status: 'in_progress', location: 'Lab-A-R5' },
];

const pendingExperiments = [
  { id: 'EXP-2024-002', title: 'Optimización Paracetamol Route B', author: 'Dra. Martínez', status: 'in_review' },
  { id: 'EXP-2024-003', title: 'Complejo Fe-EDTA Caracterización', author: 'Dr. López', status: 'draft' },
  { id: 'EXP-2024-004', title: 'Resolución Quiral Ibuprofeno', author: 'Dr. García', status: 'pending' },
];

const recentActivity = [
  { action: 'Sample Created', user: 'Dr. García', target: 'ORG-2024-001', time: '5 min' },
  { action: 'Status Changed', user: 'Dra. Martínez', target: 'ORG-2024-002', time: '15 min' },
  { action: 'Experiment Submitted', user: 'Dr. López', target: 'EXP-2024-003', time: '1 hora' },
  { action: 'Transfer Initiated', user: 'Dra. Sánchez', target: 'INO-2024-002', time: '2 horas' },
  { action: 'Molecule Registered', user: 'Dr. García', target: 'MOL-005', time: '3 horas' },
];

const Dashboard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [{
            label: 'Experimentos',
            data: [12, 19, 15, 25, 22, 30],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#06b6d4',
            pointRadius: 4,
            pointHoverRadius: 6,
          }, {
            label: 'Moléculas',
            data: [5, 8, 6, 12, 10, 15],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#10b981',
            pointRadius: 4,
            pointHoverRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            legend: {
              labels: { 
                color: '#9ca3af',
                usePointStyle: true,
                padding: 20,
              }
            },
            tooltip: {
              backgroundColor: '#1f2937',
              titleColor: '#f9fafb',
              bodyColor: '#9ca3af',
              borderColor: '#374151',
              borderWidth: 1,
              padding: 12,
              displayColors: true,
            }
          },
          scales: {
            x: {
              grid: { 
                color: 'rgba(55, 65, 81, 0.5)',
                drawBorder: false,
              },
              ticks: { color: '#9ca3af' }
            },
            y: {
              grid: { 
                color: 'rgba(55, 65, 81, 0.5)',
                drawBorder: false,
              },
              ticks: { color: '#9ca3af' },
              beginAtZero: true,
            }
          }
        }
      });
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400">Resumen de actividad del laboratorio</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500">
            <option>Últimos 30 días</option>
            <option>Últimos 7 días</option>
            <option>Este mes</option>
            <option>Este año</option>
          </select>
          <button className="btn-primary flex items-center gap-2">
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Experimentos Completados" 
          value={mockKPIs.experimentsCompleted}
          change={12}
          icon={BookOpen}
          color="cyan"
        />
        <KPICard 
          title="Moléculas Sintetizadas" 
          value={mockKPIs.moleculesSynthesized}
          change={8}
          icon={Atom}
          color="emerald"
        />
        <KPICard 
          title="Rendimiento Promedio" 
          value={`${mockKPIs.avgYield}%`}
          change={-2}
          icon={BarChart3}
          color="amber"
        />
        <KPICard 
          title="Muestras Procesadas" 
          value={mockKPIs.samplesProcessed}
          change={15}
          icon={TestTube}
          color="violet"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Chart */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Tendencia de Productividad</h3>
          <div className="h-80">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div 
                key={i} 
                className="flex items-start gap-3 animate-slideIn" 
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-cyan-500 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.target}</p>
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-cyan-400 text-sm hover:text-cyan-300 transition-colors flex items-center justify-center gap-1">
            Ver todo el historial
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Samples */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Muestras Recientes</h3>
            <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
              Ver todas
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {recentSamples.map(sample => (
                  <tr key={sample.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm text-cyan-400">{sample.id}</td>
                    <td className="py-3 px-4 text-sm text-white">{sample.name}</td>
                    <td className="py-3 px-4"><StatusBadge status={sample.status} /></td>
                    <td className="py-3 px-4 text-sm text-gray-400">{sample.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Experiments */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Experimentos Pendientes</h3>
            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
              {mockKPIs.pendingReviews} pendientes
            </span>
          </div>
          <div className="space-y-3">
            {pendingExperiments.map(exp => (
              <div 
                key={exp.id} 
                className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-medium text-sm text-white">{exp.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{exp.author} • {exp.id}</p>
                </div>
                <StatusBadge status={exp.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/20">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{mockKPIs.equipmentUtilization}%</p>
            <p className="text-sm text-gray-400">Uso de Equipos</p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/20">
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">2.3h</p>
            <p className="text-sm text-gray-400">Tiempo Promedio</p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-cyan-500/20">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">94%</p>
            <p className="text-sm text-gray-400">Tasa de Éxito</p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-rose-500/20">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-sm text-gray-400">Alertas Activas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
