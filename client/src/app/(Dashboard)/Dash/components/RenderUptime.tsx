'use client';
import React, { useState, useEffect } from 'react';
import {
  Activity,
  Plus,
  Trash2,
  Pause,
  Play,
  RefreshCw,
  Globe,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface MonitorLog {
  datetime: number;
  type: number; // 0 = up, 1 = down
}

interface Monitor {
  id: string;
  friendly_name: string;
  url: string;
  status: number; // 0 = paused, 2 = up, 9 = down
  interval: number; // in seconds
  logs?: MonitorLog[];
  custom_uptime_ratio?: number;
}

interface MonitorResponse {
  Status: boolean;
  Monitors?: Monitor[];
  Monitor?: Monitor;
}

export default function UptimeMonitorDashboard() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);

  const [formData, setFormData] = useState<{ name: string; url: string; interval: number }>({
    name: '',
    url: '',
    interval: 5,
  });

  const API_BASE = 'http://localhost:5000/monitor';

  useEffect(() => {
    fetchMonitors();
  }, []);

  const fetchMonitors = async () => {
    console.log("hey i am inside the fetching mechanism")
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data: MonitorResponse = await res.json();
      console.log(data)
      setMonitors(data.Monitors || []);
    } catch (err) {
      console.error('Error fetching monitors:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMonitor = async () => {
    if (!formData.name || !formData.url) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await res.json();
      setFormData({ name: '', url: '', interval: 5 });
      setShowCreateForm(false);
      fetchMonitors();
    } catch (err) {
      console.error('Error creating monitor:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMonitor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this monitor?')) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchMonitors();
      if (selectedMonitor?.id === id) setSelectedMonitor(null);
    } catch (err) {
      console.error('Error deleting monitor:', err);
    } finally {
      setLoading(false);
    }
  };

  const pauseMonitor = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchMonitors();
    } catch (err) {
      console.error('Error pausing monitor:', err);
    } finally {
      setLoading(false);
    }
  };

  const restartMonitor = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/restart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchMonitors();
    } catch (err) {
      console.error('Error restarting monitor:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      const data: MonitorResponse = await res.json();
      setSelectedMonitor(data.Monitor || null);
    } catch (err) {
      console.error('Error fetching monitor details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 2:
        return 'bg-green-500';
      case 9:
        return 'bg-red-500';
      case 0:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 2:
        return 'Up';
      case 9:
        return 'Down';
      case 0:
        return 'Paused';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Uptime Monitor</h1>
                <p className="text-slate-400">Monitor your services in real-time</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Monitor
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Monitor</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Monitor Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="My Website"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Check Interval (minutes)</label>
                <select
                    value={formData.interval}
                    onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                </select>
                </div>

              <div className="flex gap-3">
                <button
                  onClick={createMonitor}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  Create Monitor
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Monitor List */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {loading && monitors.length === 0 ? (
    <div className="col-span-full text-center py-12 text-slate-400">
      <RefreshCw className="w-12 h-12 mx-auto mb-3 animate-spin" />
      Loading monitors...
    </div>
  ) : monitors.length === 0 ? (
    <div className="col-span-full text-center py-12 text-slate-400">
      <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
      No monitors yet. Create your first one!
    </div>
  ) : (
    monitors.map((monitor) => (
      <div
        key={monitor.id}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(monitor.status)}`}></div>
              <h3 className="font-bold text-lg truncate">{monitor.friendly_name}</h3>
            </div>
            <p className="text-sm text-slate-400 truncate flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {monitor.url}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <span
            className={`px-3 py-1 rounded-full ${getStatusColor(
              monitor.status
            )} bg-opacity-20 font-medium`}
          >
            {getStatusText(monitor.status)}
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Every {monitor.interval / 60}m
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => viewDetails(monitor.id)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
          >
            <TrendingUp className="w-4 h-4" />
            Details
          </button>
          <button
            onClick={() =>
              monitor.status === 0 ? restartMonitor(monitor.id) : pauseMonitor(monitor.id)
            }
            className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-all"
          >
            {monitor.status === 0 ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={() => deleteMonitor(monitor.id)}
            className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    ))
  )}
</div>

{/* Monitor Details Modal */}
{selectedMonitor && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{selectedMonitor.friendly_name}</h2>
          <p className="text-slate-400">{selectedMonitor.url}</p>
        </div>
        <button
          onClick={() => setSelectedMonitor(null)}
          className="text-slate-400 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Status</p>
          <p className="text-xl font-bold">{getStatusText(selectedMonitor.status)}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Uptime Ratio</p>
          <p className="text-xl font-bold">{selectedMonitor.custom_uptime_ratio ?? 'N/A'}%</p>
        </div>
      </div>

      {selectedMonitor.logs && selectedMonitor.logs.length > 0 && (
        <div>
          <h3 className="font-bold mb-3">Recent Logs</h3>
          <div className="space-y-2">
            {selectedMonitor.logs.slice(0, 10).map((log, idx) => (
              <div key={idx} className="bg-slate-900 p-3 rounded-lg text-sm">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      log.type === 1 ? 'bg-red-500 bg-opacity-20 text-red-400' : 'bg-green-500 bg-opacity-20 text-green-400'
                    }`}
                  >
                    {log.type === 1 ? 'Down' : 'Up'}
                  </span>
                  <span className="text-slate-400">
                    {new Date(log.datetime * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}


        {/* Monitor Details Modal */}
        {selectedMonitor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedMonitor.friendly_name}</h2>
                  <p className="text-slate-400">{selectedMonitor.url}</p>
                </div>
                <button
                  onClick={() => setSelectedMonitor(null)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <p className="text-xl font-bold">{getStatusText(selectedMonitor.status)}</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">Uptime Ratio</p>
                  <p className="text-xl font-bold">{selectedMonitor.custom_uptime_ratio || 'N/A'}%</p>
                </div>
              </div>

              {selectedMonitor.logs && selectedMonitor.logs.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3">Recent Logs</h3>
                  <div className="space-y-2">
                    {selectedMonitor.logs.slice(0, 10).map((log, idx) => (
                      <div key={idx} className="bg-slate-900 p-3 rounded-lg text-sm">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              log.type === 1
                                ? 'bg-red-500 bg-opacity-20 text-red-400'
                                : 'bg-green-500 bg-opacity-20 text-green-400'
                            }`}
                          >
                            {log.type === 1 ? 'Down' : 'Up'}
                          </span>
                          <span className="text-slate-400">
                            {new Date(log.datetime * 1000).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
