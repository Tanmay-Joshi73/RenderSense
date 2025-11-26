'use client'
import React, { useState } from 'react';
import { Activity, Server, Globe, TrendingUp, Key, FileText, Settings, RefreshCw, Sun, Moon, Play, StopCircle, Plus, Trash2, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ListServices from './components/ListServices';
import { div } from 'framer-motion/client';
import {RenderKeys} from './components/renderKey';
// Mock Data
const mockOverviewStats = {
  totalServices: 12,
  activeDeployments: 8,
  averageUptime: 99.7,
  lastSynced: new Date().toLocaleString()
};

const mockApiCallsData = [
  { day: 'Mon', calls: 245},
  { day: 'Tue', calls: 312 },
  { day: 'Wed', calls: 289 },
  { day: 'Thu', calls: 356 },
  { day: 'Fri', calls: 298 },
  { day: 'Sat', calls: 201 },
  { day: 'Sun', calls: 178 }
];

const mockRenderApps = [
  { id: 1, name: 'api-service', status: 'Running', cpu: 45, memory: 62, uptime: 99.9, lastDeploy: '2h ago' },
  { id: 2, name: 'web-frontend', status: 'Running', cpu: 32, memory: 48, uptime: 99.8, lastDeploy: '5h ago' },
  { id: 3, name: 'worker-queue', status: 'Building', cpu: 0, memory: 0, uptime: 99.5, lastDeploy: '1m ago' },
  { id: 4, name: 'database-backup', status: 'Crashed', cpu: 0, memory: 0, uptime: 95.2, lastDeploy: '1d ago' }
];

const mockUptimeMonitors = [
  { id: 1, name: 'Main Website', url: 'https://example.com', status: 'Up', uptime: 99.98, responseTime: 245, lastDowntime: 'Never' },
  { id: 2, name: 'API Endpoint', url: 'https://api.example.com', status: 'Up', uptime: 99.85, responseTime: 189, lastDowntime: '2d ago' },
  { id: 3, name: 'Dashboard', url: 'https://dashboard.example.com', status: 'Down', uptime: 98.5, responseTime: 0, lastDowntime: 'Now' },
  { id: 4, name: 'CDN Assets', url: 'https://cdn.example.com', status: 'Up', uptime: 100, responseTime: 95, lastDowntime: 'Never' }
];

const mockCpuData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: Math.floor(Math.random() * 40) + 30
}));

const mockMemoryData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  memory: Math.floor(Math.random() * 30) + 50
}));

const mockLogs = [
  { id: 1, timestamp: '2024-11-07 14:32:15', type: 'INFO', message: 'API health check completed successfully' },
  { id: 2, timestamp: '2024-11-07 14:25:03', type: 'WARN', message: 'High CPU usage detected on api-service' },
  { id: 3, timestamp: '2024-11-07 14:18:47', type: 'ERROR', message: 'database-backup deployment failed' },
  { id: 4, timestamp: '2024-11-07 14:10:22', type: 'INFO', message: 'UptimeRobot sync completed' },
  { id: 5, timestamp: '2024-11-07 14:05:18', type: 'INFO', message: 'Render deployment webhook received' }
];

export default function CalmCircuitDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [renderApiKey, setRenderApiKey] = useState('');
  const [showRenderKey, setShowRenderKey] = useState(false);
  const [renderKeyValid, setRenderKeyValid] = useState(null);
  const [showUptimeKey, setShowUptimeKey] = useState(false);
  const [uptimeApiKey, setUptimeApiKey] = useState('');
  const [uptimeKeyValid, setUptimeKeyValid] = useState(null);
  const [uptimeFilter, setUptimeFilter] = useState('all');
  const [performanceTimeRange, setPerformanceTimeRange] = useState('24h');

  const getStatusColor = (status:string) => {
    if (status === 'Running' || status === 'Up') return 'text-green-500';
    if (status === 'Building') return 'text-yellow-500';
    return 'text-red-500';
  };
type Status = 'Running' | 'Building' | 'Crashed' | 'Up' | 'Down';
  const getStatusBadge = (status:Status):string => {
  const colors: Record<Status, string> = {
    Running: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Building: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Crashed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Up: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Down: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredMonitors = uptimeFilter === 'all' 
    ? mockUptimeMonitors 
    : mockUptimeMonitors.filter(m => m.status.toLowerCase() === uptimeFilter);

  const renderSidebar = () => (
    <aside className={`w-64 h-screen ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r fixed left-0 top-0 flex flex-col`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Calm Circuit</h1>
            <p className="text-xs text-gray-500">Monitor</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {[
          { id: 'overview', icon: Activity, label: 'Overview' },
          { id: 'render', icon: Server, label: 'Render' },
          { id: 'uptime', icon: Globe, label: 'UptimeRobot' },
          { id: 'performance', icon: TrendingUp, label: 'Performance' },
          { id: 'keys', icon: Key, label: 'API Keys' },
          { id: 'logs', icon: FileText, label: 'Logs' },
          { id: 'settings', icon: Settings, label: 'Settings' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === item.id
                ? 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );

  const renderHeader = () => (
    <header className={`h-16 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b fixed top-0 right-0 left-64 flex items-center justify-between px-6 z-10`}>
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold capitalize">{activeSection}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">
          Last synced: {mockOverviewStats.lastSynced}
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <RefreshCw className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
          U
        </div>
      </div>
    </header>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Services</p>
              <p className="text-3xl font-bold">{mockOverviewStats.totalServices}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-xl flex items-center justify-center">
              <Server className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Deployments</p>
              <p className="text-3xl font-bold">{mockOverviewStats.activeDeployments}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Average Uptime (7d)</p>
              <p className="text-3xl font-bold">{mockOverviewStats.averageUptime}%</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">System Status</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-600">All Healthy</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">API Calls - Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockApiCallsData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="day" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="calls" fill="#06b6d4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  //Render Services
 
  // const renderUptime = () => (
  //   <div className="space-y-6">
  //     <div className="flex justify-between items-center">
  //       <div className="flex gap-2">
  //         {['all', 'up', 'down'].map(filter => (
  //           <button
  //             key={filter}
  //             onClick={() => setUptimeFilter(filter)}
  //             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
  //               uptimeFilter === filter
  //                 ? 'bg-cyan-600 text-white'
  //                 : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
  //             }`}
  //           >
  //             {filter.charAt(0).toUpperCase() + filter.slice(1)}
  //           </button>
  //         ))}
  //       </div>
  //       <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
  //         <Plus className="w-4 h-4" />
  //         Add Monitor
  //       </button>
  //     </div>

  //     <div className={`rounded-2xl shadow-md overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
  //       <div className="overflow-x-auto">
  //         <table className="w-full">
  //           <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
  //             <tr>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monitor Name</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime %</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Downtime</th>
  //             </tr>
  //           </thead>
  //           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
  //             {filteredMonitors.map(monitor => (
  //               <tr key={monitor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
  //                 <td className="px-6 py-4 whitespace-nowrap font-medium">{monitor.name}</td>
  //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{monitor.url}</td>
  //                 <td className="px-6 py-4 whitespace-nowrap">
  //                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(monitor.status)}`}>
  //                     {monitor.status}
  //                   </span>
  //                 </td>
  //                 <td className="px-6 py-4 whitespace-nowrap">{monitor.uptime}%</td>
  //                 <td className="px-6 py-4 whitespace-nowrap">{monitor.responseTime || 'N/A'} ms</td>
  //                 <td className="px-6 py-4 whitespace-nowrap text-gray-500">{monitor.lastDowntime}</td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>

  //     <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
  //       <h3 className="text-lg font-semibold mb-4">Response Time Trend</h3>
  //       <ResponsiveContainer width="100%" height={250}>
  //         <LineChart data={mockCpuData.slice(-12).map(d => ({ ...d, response: Math.floor(Math.random() * 200) + 100 }))}>
  //           <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
  //           <XAxis dataKey="time" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
  //           <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
  //           <Tooltip 
  //             contentStyle={{ 
  //               backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
  //               border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
  //               borderRadius: '8px'
  //             }}
  //           />
  //           <Line type="monotone" dataKey="response" stroke="#10b981" strokeWidth={2} dot={false} />
  //         </LineChart>
  //       </ResponsiveContainer>
  //     </div>
  //   </div>
  // );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">System performance metrics</p>
        <div className="flex gap-2">
          {['1h', '24h', '7d'].map(range => (
            <button
              key={range}
              onClick={() => setPerformanceTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                performanceTimeRange === range
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <p className="text-sm text-gray-500 mb-1">Average CPU</p>
          <p className="text-3xl font-bold">42.3%</p>
        </div>
        <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <p className="text-sm text-gray-500 mb-1">Max Memory</p>
          <p className="text-3xl font-bold">1.2 GB</p>
        </div>
        <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <p className="text-sm text-gray-500 mb-1">System Uptime</p>
          <p className="text-3xl font-bold">15d 6h</p>
        </div>
      </div>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">CPU Usage - Last 24 Hours</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockCpuData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="time" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">Memory Usage - Last 24 Hours</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockMemoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="time" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">System activity and API usage logs</p>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          Clear Logs
        </button>
      </div>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">API Calls per Day</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mockApiCallsData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="day" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="calls" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-2xl shadow-md overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      log.type === 'INFO' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      log.type === 'WARN' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <p className="text-gray-600 dark:text-gray-400">Customize your monitoring preferences</p>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <p className="font-medium">Downtime Alerts</p>
              <p className="text-sm text-gray-500">Get notified when services go down</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <p className="font-medium">High CPU Alerts</p>
              <p className="text-sm text-gray-500">Alert when CPU usage exceeds 80%</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <p className="font-medium">Memory Warnings</p>
              <p className="text-sm text-gray-500">Notify on high memory usage</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">Refresh Interval</h3>
        <select className={`w-full px-4 py-3 border rounded-lg ${
          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}>
          <option value="5">5 minutes</option>
          <option value="10">10 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
        </select>
      </div>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">Data Retention</h3>
        <select className={`w-full px-4 py-3 border rounded-lg ${
          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}>
          <option value="7">7 days</option>
          <option value="30">30 days</option>
          <option value="90">90 days</option>
          <option value="365">1 year</option>
        </select>
      </div>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-gray-500">Switch between light and dark theme</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
          </label>
        </div>
      </div>

      <button className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium">
        Save Settings
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {renderSidebar()}
      {renderHeader()}
      
      <main className="ml-64 pt-16 p-8">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'render' && <ListServices isDarkMode={isDarkMode} />}   //This will be in the next file where for the perfect readibility
        {/* {activeSection === 'uptime' && renderUptime()} */}
        {activeSection === 'performance' && renderPerformance()}
        {activeSection === 'keys' && <RenderKeys />}
        {activeSection === 'logs' && renderLogs()}
        {activeSection === 'settings' && renderSettings()}
      </main>
    </div>
  );
}