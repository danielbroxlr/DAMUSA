import React, { useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, Users, TestTube, Clock, Target } from 'lucide-react';
import Chart from 'chart.js/auto';

const Analytics = () => {
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const charts = useRef([]);

  useEffect(() => {
    charts.current.forEach(c => c?.destroy());
    charts.current = [];

    if (barRef.current) {
      charts.current.push(new Chart(barRef.current.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Dr. García', 'Dra. Martínez', 'Dr. López', 'Dra. Sánchez'],
          datasets: [{
            label: 'Experimentos',
            data: [23, 31, 15, 18],
            backgroundColor: 'rgba(6, 182, 212, 0.6)',
            borderColor: '#06b6d4',
            borderWidth: 1,
          }, {
            label: 'Moléculas',
            data: [12, 8, 5, 9],
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: '#10b981',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#9ca3af' } } },
          scales: {
            x: { grid: { color: 'rgba(55, 65, 81, 0.5)' }, ticks: { color: '#9ca3af' } },
            y: { grid: { color: 'rgba(55, 65, 81, 0.5)' }, ticks: { color: '#9ca3af' }, beginAtZero: true }
          }
        }
      }));
    }

    if (pieRef.current) {
      charts.current.push(new Chart(pieRef.current.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Orgánica', 'Inorgánica', 'Analítica', 'Materiales'],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', padding: 20 } } }
        }
      }));
    }

    return () => charts.current.forEach(c => c?.destroy());
  }, []);

  const kpis = [
    { label: 'Productividad Media', value: '87%', change: '+5%', icon: TrendingUp, color: 'cyan' },
    { label: 'Rendimiento Promedio', value: '78.5%', change: '-2%', icon: Target, color: 'emerald' },
    { label: 'Tiempo por Experimento', value: '2.3h', change: '-15min', icon: Clock, color: 'amber' },
    { label: 'Tasa de Éxito', value: '94%', change: '+3%', icon: BarChart3, color: 'violet' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div><h2 className="text-2xl font-bold text-white">Analíticas y KPIs</h2><p className="text-gray-400">Métricas de rendimiento del laboratorio</p></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className={`glass rounded-xl p-6 bg-gradient-to-br from-${kpi.color}-500/20 to-${kpi.color}-500/5 border border-${kpi.color}-500/30`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{kpi.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{kpi.value}</p>
                <p className={`text-sm mt-2 ${kpi.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{kpi.change} vs mes anterior</p>
              </div>
              <div className={`p-3 rounded-lg bg-${kpi.color}-500/20`}><kpi.icon className={`w-6 h-6 text-${kpi.color}-400`} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Productividad por Químico</h3>
          <div className="h-80"><canvas ref={barRef}></canvas></div>
        </div>
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Distribución por Área</h3>
          <div className="h-80"><canvas ref={pieRef}></canvas></div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Ranking de Investigadores</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Investigador</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Experimentos</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Moléculas</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Rendimiento Prom.</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Tasa Éxito</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Dra. Martínez', exp: 31, mol: 8, yield: '92.1%', success: '97%' },
              { name: 'Dr. García', exp: 23, mol: 12, yield: '87.5%', success: '94%' },
              { name: 'Dra. Sánchez', exp: 18, mol: 9, yield: '78.3%', success: '91%' },
              { name: 'Dr. López', exp: 15, mol: 5, yield: '75.0%', success: '88%' },
            ].map((r, i) => (
              <tr key={r.name} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-3 px-4 text-white font-medium">{r.name}</td>
                <td className="py-3 px-4 text-gray-300">{r.exp}</td>
                <td className="py-3 px-4 text-gray-300">{r.mol}</td>
                <td className="py-3 px-4 text-emerald-400">{r.yield}</td>
                <td className="py-3 px-4 text-cyan-400">{r.success}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
