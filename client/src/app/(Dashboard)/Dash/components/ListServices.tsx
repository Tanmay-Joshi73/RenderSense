'use client';
import React, { useEffect, useState } from 'react';
import { Play, StopCircle, RefreshCw, Plus, Activity, FileText, BarChart3 } from 'lucide-react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface RenderDashboardProps {
  isDarkMode: boolean;
}

interface Service {
  id: string;
  name: string;
  createdAt: string;
  region: string;
  status: string;
  type: string;
  url:string

}

interface Log {
  timestamp: string;
  message: string;
}

const ListServices: React.FC<RenderDashboardProps> = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'services' | 'logs' | 'metrics'>('services');
  const [working, setWorking] = useState<Service[]>([]);
  const [stopped, setStopped] = useState<Service[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [cpuMetrics, setCpuMetrics] = useState<any[]>([]);
  const [memoryMetrics, setMemoryMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const BackendUrl = 'http://localhost:5000';
  const RENDER_API_KEY = "rnd_h9grLtY0Z98yZXOuH1cUb2FSqVRb";
  const UptimeRObotAPIKey='u3084781-f8637905a333e32da7917b31'
  // Normalize backend statuses
  const normalizeStatus = (status: string) => {
    if (status === 'not_suspended') return 'working';
    if (status === 'suspended') return 'stopped';
    return status;
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BackendUrl}/render/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: RENDER_API_KEY })
      });
      const data = await res.json();

      if (data.Status) {
        setWorking(data.Working?.map((s: Service) => ({ ...s, status: normalizeStatus(s.status) })) || []);
        setStopped(data.Stopped?.map((s: Service) => ({ ...s, status: normalizeStatus(s.status) })) || []);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs
  const fetchLogs = async (serviceId: string | null = null) => {
    try {
      const body: any = { key: RENDER_API_KEY, limit: 50 };
      if (serviceId) body.serviceId = serviceId;

      const res = await fetch(`${BackendUrl}/render/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.Status) {
        setLogs(data.data?.logs || []);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  ///Create a monitor for the given render service
  const handleCreateMonitor = async (app:any) => {
  try {
    console.log(app)
    alert(app)
    const res = await fetch(`${BackendUrl}/monitor/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: app.name,
        url: app.url,  // service URL
        interval: 300, // enforce 5 minutes (free limit)
      }),
    });

    const data = await res.json();

    if (data.stat === "ok") {
      alert(`Monitor created for ${app.name}`);
    } else {
      alert(data.error?.message || "Failed to create monitor");
    }

  } catch (error) {
    console.error(error);
    alert("Something went wrong while creating monitor.");
  }
};


  // Fetch metrics
  const fetchMetrics = async (metric: 'cpu' | 'memory', serviceId: string | null = null) => {
    try {
      const body: any = { key: RENDER_API_KEY, metric };
      if (serviceId) body.resourceIds = [serviceId];

      const res = await fetch(`${BackendUrl}/render/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.Status) {
        const chartData = formatMetricsData(data.data);
        if (metric === 'cpu') setCpuMetrics(chartData);
        else setMemoryMetrics(chartData);
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
    }
  };

  // Format metrics for chart
  const formatMetricsData = (data: any) => {
    if (!data?.data) return [];
    return data.data.map((point: any) => ({
      time: new Date(point.timestamp).toLocaleTimeString(),
      value: Number(parseFloat(point.value).toFixed(2))
    }));
  };

  // Service actions
  const handleAction = async (action: 'restart' | 'suspend' | 'resume', serviceId: string) => {
    try {
      await fetch(`${BackendUrl}/render/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: RENDER_API_KEY, serviceId })
      });
      fetchServices();
    } catch (err) {
      console.error(`Failed to ${action} service:`, err);
    }
  };

  const handleDeploy = async (serviceId: string) => {
    try {
      await fetch(`${BackendUrl}/render/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: RENDER_API_KEY, serviceId })
      });
      fetchServices();
    } catch (err) {
      console.error('Failed to deploy service:', err);
    }
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      working: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      deploying: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      stopped: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return badges[status] || badges.unknown;
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') fetchLogs(selectedService);
    if (activeTab === 'metrics') {
      fetchMetrics('cpu', selectedService);
      fetchMetrics('memory', selectedService);
    }
  }, [activeTab, selectedService]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  // Render services table
  const renderServicesTable = (services: Service[], type: string) => (
    <div className="rounded-xl shadow-lg overflow-hidden mb-6 bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {type} Services ({services.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">App Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Region</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {services.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedService(app.id)}>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{app.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>{app.status}</span>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{app.type}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown'}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{app.region || 'Unknown'}</td>
                <td className="px-6 py-4">
  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>

    {/* Restart / Stop / Resume Buttons */}
    {app.status === 'working' ? (
      <>
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title="Restart" onClick={() => handleAction('restart', app.id)}>
          <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </button>

        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title="Stop" onClick={() => handleAction('suspend', app.id)}>
          <StopCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
        </button>
      </>
    ) : (
      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
        title="Resume" onClick={() => handleAction('resume', app.id)}>
        <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
      </button>
    )}

    {/* Deploy Button */}
    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
      title="Deploy" onClick={() => handleDeploy(app.id)}>
      <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
    </button>

    {/* Create UptimeRobot Monitor Button */}
    <button
      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
      title="Create Monitor"
      onClick={() => handleCreateMonitor(app)}
    >
      <Activity className="w-4 h-4 text-green-500" />
    </button>

  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render logs
  const renderLogs = () => (
    <div className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Service Logs {selectedService && `(${selectedService})`}
        </h2>
        <button onClick={() => fetchLogs(selectedService)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No logs available. Select a service to view logs.</p>
        ) : logs.map((log) => (
          <div key={log.timestamp} className="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-xs text-gray-800 dark:text-gray-200">
            <span className="text-gray-500 dark:text-gray-400 mr-2">[{new Date(log.timestamp).toLocaleString()}]</span>
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );

  // Render metrics
  const renderMetrics = () => (
    <div className="space-y-6">
      <div className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          CPU Usage {selectedService && `(${selectedService})`}
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={cpuMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} name="CPU %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Memory Usage {selectedService && `(${selectedService})`}
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={memoryMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Memory MB" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">Monitor and manage your Render deployments</p>
        <button onClick={fetchServices} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Services</p>
              <p className="text-3xl font-bold mt-1">{working.length + stopped.length}</p>
            </div>
            <Activity className="w-12 h-12 text-cyan-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Working</p>
              <p className="text-3xl font-bold mt-1 text-green-600">{working.length}</p>
            </div>
            <Play className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Stopped</p>
              <p className="text-3xl font-bold mt-1 text-red-600">{stopped.length}</p>
            </div>
            <StopCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setActiveTab('services')} className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'services' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}><Activity className="w-4 h-4" /> Services</button>
        <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'logs' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}><FileText className="w-4 h-4" /> Logs</button>
        <button onClick={() => setActiveTab('metrics')} className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'metrics' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}><BarChart3 className="w-4 h-4" /> Metrics</button>
      </div>

      {/* Tab Content */}
      {activeTab === 'services' && (
        <div>
          {renderServicesTable(working, 'Working')}
          {renderServicesTable(stopped, 'Stopped')}
        </div>
      )}
      {activeTab === 'logs' && renderLogs()}
      {activeTab === 'metrics' && renderMetrics()}
    </div>
  );
};

export default ListServices;
