import React, { useState } from 'react';
import { Save, Database, Shield, Bell, Palette, Globe, Server, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'database', label: 'Base de Datos', icon: Database },
    { id: 'integrations', label: 'Integraciones', icon: Server },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
  ];

  const handleSave = () => {
    toast.success('Configuración guardada');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">Configuración</h2><p className="text-gray-400">Administración del sistema LIMS</p></div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2"><Save className="w-5 h-5" /> Guardar Cambios</button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 glass rounded-xl p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Configuración General</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nombre del Laboratorio</label>
                  <input defaultValue="Laboratorio Central de Química" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Código de Laboratorio</label>
                  <input defaultValue="LAB-001" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Zona Horaria</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
                    <option>Europe/Madrid (UTC+1)</option>
                    <option>America/Mexico_City (UTC-6)</option>
                    <option>America/New_York (UTC-5)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Idioma</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
                    <option>Español</option>
                    <option>English</option>
                    <option>Português</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Prefijo de Muestras Orgánicas</label>
                <input defaultValue="ORG" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Prefijo de Muestras Inorgánicas</label>
                <input defaultValue="INO" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono" />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Configuración de Seguridad</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div><p className="text-white font-medium">Autenticación de dos factores (2FA)</p><p className="text-sm text-gray-400">Requerir 2FA para todos los usuarios</p></div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div><p className="text-white font-medium">Firma electrónica certificada</p><p className="text-sm text-gray-400">21 CFR Part 11 compliant</p></div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div><p className="text-white font-medium">Bloqueo automático de sesión</p><p className="text-sm text-gray-400">Cerrar sesión tras inactividad</p></div>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                    <option>15 minutos</option>
                    <option>30 minutos</option>
                    <option>1 hora</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Política de contraseñas</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
                    <option>Alta (12+ caracteres, mayúsculas, números, símbolos)</option>
                    <option>Media (8+ caracteres, mayúsculas, números)</option>
                    <option>Básica (8+ caracteres)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Configuración de Notificaciones</h3>
              <div className="space-y-4">
                {[
                  { title: 'Nuevas muestras asignadas', desc: 'Notificar cuando se asigne una muestra' },
                  { title: 'Experimentos pendientes de revisión', desc: 'Alertar sobre experimentos que requieren aprobación' },
                  { title: 'Transferencias de muestras', desc: 'Notificar transferencias entrantes y salientes' },
                  { title: 'Caducidad de muestras', desc: 'Alertar sobre muestras próximas a caducar' },
                  { title: 'Mantenimiento de equipos', desc: 'Recordatorios de calibración y mantenimiento' },
                ].map(item => (
                  <div key={item.title} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div><p className="text-white font-medium">{item.title}</p><p className="text-sm text-gray-400">{item.desc}</p></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Configuración de Base de Datos</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg">
                <div><p className="text-sm text-gray-400">Estado</p><p className="text-emerald-400 font-medium">● Conectado</p></div>
                <div><p className="text-sm text-gray-400">Servidor</p><p className="text-white font-mono">db.damusa.io:5432</p></div>
                <div><p className="text-sm text-gray-400">Base de datos</p><p className="text-white font-mono">damusa_prod</p></div>
                <div><p className="text-sm text-gray-400">Último backup</p><p className="text-white">Hoy, 03:00 AM</p></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div><p className="text-white font-medium">Backup automático</p><p className="text-sm text-gray-400">Realizar backup diario a las 3:00 AM</p></div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Retención de backups</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
                    <option>30 días</option>
                    <option>60 días</option>
                    <option>90 días</option>
                    <option>1 año</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Integraciones</h3>
              <div className="space-y-4">
                {[
                  { name: 'ERP (SAP)', status: 'connected', desc: 'Sincronización de costes y órdenes' },
                  { name: 'Active Directory', status: 'connected', desc: 'Autenticación SSO' },
                  { name: 'PubChem', status: 'connected', desc: 'Búsqueda de moléculas' },
                  { name: 'AWS S3', status: 'connected', desc: 'Almacenamiento de backups' },
                  { name: 'Slack', status: 'disconnected', desc: 'Notificaciones de equipo' },
                ].map(int => (
                  <div key={int.name} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${int.status === 'connected' ? 'bg-emerald-400' : 'bg-gray-500'}`}></div>
                      <div><p className="text-white font-medium">{int.name}</p><p className="text-sm text-gray-400">{int.desc}</p></div>
                    </div>
                    <button className={`btn-secondary text-sm ${int.status === 'connected' ? '' : 'text-cyan-400'}`}>
                      {int.status === 'connected' ? 'Configurar' : 'Conectar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Apariencia</h3>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tema</label>
                <div className="flex gap-4">
                  <button className="flex-1 p-4 bg-gray-900 border-2 border-cyan-500 rounded-lg text-center">
                    <div className="w-full h-8 bg-gray-800 rounded mb-2"></div>
                    <p className="text-white">Oscuro</p>
                  </button>
                  <button className="flex-1 p-4 bg-gray-100 border-2 border-gray-700 rounded-lg text-center opacity-50">
                    <div className="w-full h-8 bg-white rounded mb-2"></div>
                    <p className="text-gray-800">Claro (próximamente)</p>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Color de acento</label>
                <div className="flex gap-3">
                  {['bg-cyan-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500'].map(color => (
                    <button key={color} className={`w-10 h-10 rounded-full ${color} ${color === 'bg-cyan-500' ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}></button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
