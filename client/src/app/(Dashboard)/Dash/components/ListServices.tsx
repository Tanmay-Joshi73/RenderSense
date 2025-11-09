'use client';
import React from 'react';
import { useTheme } from '@/app/Context/ThemeContext';
import { Plus, Play, StopCircle } from 'lucide-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const mockRenderApps = [
  { id: 1, name: 'api-service', status: 'Running', cpu: 45, memory: 62, uptime: 99.9, lastDeploy: '2h ago' },
  { id: 2, name: 'web-frontend', status: 'Running', cpu: 32, memory: 48, uptime: 99.8, lastDeploy: '5h ago' },
  { id: 3, name: 'worker-queue', status: 'Building', cpu: 0, memory: 0, uptime: 99.5, lastDeploy: '1m ago' },
  { id: 4, name: 'database-backup', status: 'Crashed', cpu: 0, memory: 0, uptime: 95.2, lastDeploy: '1d ago' },
];

const mockCpuData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: Math.floor(Math.random() * 40) + 30,
}));

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Running':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Building':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Crashed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const ListServices = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">Monitor your Render deployments</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add Deployment
        </button>
      </div>

      <div className={`rounded-2xl shadow-md overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Deploy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockRenderApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{app.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.cpu}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.memory}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.uptime}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{app.lastDeploy}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="Restart">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="Stop">
                        <StopCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">CPU Usage Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mockCpuData.slice(-12)}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="time" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
              }}
            />
            <Line type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
