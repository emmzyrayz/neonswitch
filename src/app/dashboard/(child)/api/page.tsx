'use client'
import React, { useState, ReactElement } from 'react';
import { 
  LuCode, 
  LuKey, 
  LuBook, 
  LuChartBar,
  LuCopy,
  LuCheck,
  LuEye,
  LuEyeOff,
  LuRefreshCw,
  LuTrash2,
  LuPlus,
  LuActivity,
  LuClock,
  LuCircleAlert,
  LuShield,
  LuZap
} from 'react-icons/lu';

type ApiKey = {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'revoked';
  permissions: string[];
};

type ApiLog = {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: number;
  timestamp: string;
  duration: string;
  ip: string;
};

type ApiEndpoint = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: string[];
};

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sk_live_4fK9mN2pQ8rT3vW7xY1zB5cD6eF',
    created: '2024-11-01',
    lastUsed: '2024-12-25 14:30',
    status: 'active',
    permissions: ['read', 'write']
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'sk_test_1aB2cD3eF4gH5iJ6kL7mN8oP9qR',
    created: '2024-12-10',
    lastUsed: '2024-12-24 09:15',
    status: 'active',
    permissions: ['read']
  },
  {
    id: '3',
    name: 'Old Backend Key',
    key: 'sk_live_9zY8xW7vU6tS5rQ4pO3nM2lK1jH',
    created: '2024-10-15',
    lastUsed: '2024-11-20 16:45',
    status: 'revoked',
    permissions: ['read', 'write']
  },
];

const mockApiLogs: ApiLog[] = [
  {
    id: '1',
    endpoint: '/api/v1/payments/create',
    method: 'POST',
    status: 200,
    timestamp: '2024-12-25 14:30:15',
    duration: '245ms',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    endpoint: '/api/v1/user/profile',
    method: 'GET',
    status: 200,
    timestamp: '2024-12-25 14:28:42',
    duration: '89ms',
    ip: '192.168.1.100'
  },
  {
    id: '3',
    endpoint: '/api/v1/wallet/balance',
    method: 'GET',
    status: 200,
    timestamp: '2024-12-25 14:25:30',
    duration: '156ms',
    ip: '192.168.1.100'
  },
  {
    id: '4',
    endpoint: '/api/v1/transfer/send',
    method: 'POST',
    status: 401,
    timestamp: '2024-12-25 14:20:10',
    duration: '12ms',
    ip: '192.168.1.101'
  },
  {
    id: '5',
    endpoint: '/api/v1/transactions',
    method: 'GET',
    status: 500,
    timestamp: '2024-12-25 14:15:05',
    duration: '2340ms',
    ip: '192.168.1.100'
  },
];

const apiEndpoints: Record<string, ApiEndpoint[]> = {
  Authentication: [
    { method: 'POST', path: '/api/v1/auth/login', description: 'Authenticate user and get access token' },
    { method: 'POST', path: '/api/v1/auth/register', description: 'Register new user account' },
    { method: 'POST', path: '/api/v1/auth/refresh', description: 'Refresh access token' },
  ],
  Payments: [
    { method: 'POST', path: '/api/v1/payments/create', description: 'Create a new payment', parameters: ['amount', 'currency', 'method'] },
    { method: 'GET', path: '/api/v1/payments/{id}', description: 'Get payment details' },
    { method: 'GET', path: '/api/v1/payments/list', description: 'List all payments' },
  ],
  Wallet: [
    { method: 'GET', path: '/api/v1/wallet/balance', description: 'Get wallet balance' },
    { method: 'POST', path: '/api/v1/wallet/fund', description: 'Add funds to wallet', parameters: ['amount'] },
    { method: 'GET', path: '/api/v1/wallet/transactions', description: 'Get wallet transaction history' },
  ],
  Virtual_Numbers: [
    { method: 'GET', path: '/api/v1/numbers/available', description: 'List available virtual numbers' },
    { method: 'POST', path: '/api/v1/numbers/purchase', description: 'Purchase a virtual number', parameters: ['country', 'type'] },
    { method: 'GET', path: '/api/v1/numbers/my-numbers', description: 'Get user\'s virtual numbers' },
  ],
};

// API Keys View
const ApiKeysView = () => {
  const [keys, setKeys] = useState(mockApiKeys);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">API Keys</h2>
          <p className="text-gray-400 mt-1">Manage your API access keys</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          Create New Key
        </button>
      </div>

      <div className="space-y-4">
        {keys.map(key => (
          <div
            key={key.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{key.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getStatusColor(key.status)}`}>
                    {key.status.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-400 text-sm">Created {key.created}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {key.status === 'active' && (
                  <>
                    <button
                      onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      {showKey === key.id ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(key.key, key.id)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      {copiedKey === key.id ? <LuCheck className="w-4 h-4 text-green-400" /> : <LuCopy className="w-4 h-4" />}
                    </button>
                  </>
                )}
                <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  <LuTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mb-4 font-mono text-sm">
              {showKey === key.id ? (
                <span className="text-white">{key.key}</span>
              ) : (
                <span className="text-gray-500">{'•'.repeat(40)}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Last Used:</span>
                <p className="text-white font-medium">{key.lastUsed}</p>
              </div>
              <div>
                <span className="text-gray-400">Permissions:</span>
                <p className="text-white font-medium">{key.permissions.join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Create API Key</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Key Name</label>
                <input
                  type="text"
                  placeholder="e.g., Production API Key"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Permissions</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <span className="text-white">Read</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-white">Write</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('API Key created successfully!');
                  setShowCreateModal(false);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Documentation View
const DocumentationView = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Authentication');

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-600';
      case 'POST': return 'bg-green-600';
      case 'PUT': return 'bg-yellow-600';
      case 'DELETE': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">API Documentation</h2>
        <p className="text-gray-400 mt-1">Complete API reference and endpoints</p>
      </div>

      <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LuShield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-blue-400 font-semibold mb-1">Base URL</h3>
            <code className="text-white">https://api.neondashboard.com/v1</code>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.keys(apiEndpoints).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {category.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {apiEndpoints[selectedCategory]?.map((endpoint, index) => (
          <div
            key={index}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className={`${getMethodColor(endpoint.method)} text-white text-xs font-bold px-3 py-1 rounded`}>
                {endpoint.method}
              </span>
              <code className="text-blue-400 text-sm font-mono flex-1">{endpoint.path}</code>
            </div>

            <p className="text-gray-300 mb-4">{endpoint.description}</p>

            {endpoint.parameters && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Parameters</h4>
                <div className="space-y-1">
                  {endpoint.parameters.map((param, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <code className="text-blue-400 text-sm">{param}</code>
                      <span className="text-gray-500 text-sm">string</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-700">
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View Example →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Usage & Logs View
const UsageView = () => {
  const [logs] = useState(mockApiLogs);
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 400 && status < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-blue-400';
      case 'POST': return 'text-green-400';
      case 'PUT': return 'text-yellow-400';
      case 'DELETE': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'success') return log.status >= 200 && log.status < 300;
    if (filter === 'error') return log.status >= 400;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">API Usage & Logs</h2>
          <p className="text-gray-400 mt-1">Monitor your API requests and activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <LuActivity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Requests</p>
              <p className="text-2xl font-bold text-white">12,458</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <LuZap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-white">98.5%</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <LuClock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Response</p>
              <p className="text-2xl font-bold text-white">156ms</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'success', 'error'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {type === 'all' ? 'All Requests' : type === 'success' ? 'Success' : 'Errors'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`${getMethodColor(log.method)} font-bold text-sm`}>
                  {log.method}
                </span>
                <code className="text-blue-400 text-sm">{log.endpoint}</code>
              </div>
              <span className={`${getStatusColor(log.status)} font-bold`}>
                {log.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-400">
                <span>{log.timestamp}</span>
                <span>•</span>
                <span>{log.duration}</span>
                <span>•</span>
                <span>{log.ip}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <LuCircleAlert className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No logs found</p>
        </div>
      )}
    </div>
  );
};

// Main Component
export default function ApiPage() {
  const [activeView, setActiveView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      return hash || 'keys';
    }
    return 'keys';
  });

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const navItems = [
    { id: 'keys', label: 'API Keys', icon: LuKey },
    { id: 'docs', label: 'Documentation', icon: LuBook },
    { id: 'usage', label: 'Usage & Logs', icon: LuChartBar },
  ];

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-lg">
              <LuCode className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">API Access</h1>
              <p className="text-gray-400">Integrate with our platform APIs</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {activeView === 'keys' && <ApiKeysView />}
          {activeView === 'docs' && <DocumentationView />}
          {activeView === 'usage' && <UsageView />}
        </div>
      </div>
    </div>
  );
}