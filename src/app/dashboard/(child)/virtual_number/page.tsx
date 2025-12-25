'use client'
import React, { ReactElement, useState } from 'react';
import { 
  LuPhone, 
//   LuGlobe, 
  LuMessageSquare, 
  LuSettings, 
  LuShoppingCart,
  LuSearch,
//   LuFilter,
//   LuClock,
  LuPhoneCall,
//   LuMail,
  LuCopy,
  LuTrash2,
  LuRefreshCw,
//   LuCircleCheck,
  LuCircleAlert
} from 'react-icons/lu';

type Country = {
    code: string;
    name: string;
    dialCode: string;
    pricePerMonth: number;
    available: number;
};

type VirtualNumber = {
  id: string;
  number: string;
  country: string;
  type: 'sms' | 'voice' | 'both';
  status: 'active' | 'expired' | 'pending';
  expiresAt: string;
  purchasedAt: string;
};

type Message = {
  id: string;
  numberId: string;
  from: string;
  content: string;
  timestamp: string;
  type: 'sms' | 'call';
  duration?: string;
};

// Flag component
const Flag = ({ countryCode }: { countryCode: string }) => {
  const flags: Record<string, ReactElement> = {
    US: (
      <svg className="w-10 h-10 rounded" viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#B22234"/>
        <path d="M0,3.75h60M0,7.5h60M0,11.25h60M0,15h60M0,18.75h60M0,22.5h60M0,26.25h60" stroke="#fff" strokeWidth="2.3"/>
        <rect width="24" height="15" fill="#3C3B6E"/>
        <g fill="#fff">
          <circle cx="3" cy="2" r="0.8"/><circle cx="7" cy="2" r="0.8"/><circle cx="11" cy="2" r="0.8"/>
          <circle cx="15" cy="2" r="0.8"/><circle cx="19" cy="2" r="0.8"/><circle cx="23" cy="2" r="0.8"/>
          <circle cx="5" cy="4" r="0.8"/><circle cx="9" cy="4" r="0.8"/><circle cx="13" cy="4" r="0.8"/>
          <circle cx="17" cy="4" r="0.8"/><circle cx="21" cy="4" r="0.8"/>
          <circle cx="3" cy="6" r="0.8"/><circle cx="7" cy="6" r="0.8"/><circle cx="11" cy="6" r="0.8"/>
          <circle cx="15" cy="6" r="0.8"/><circle cx="19" cy="6" r="0.8"/><circle cx="23" cy="6" r="0.8"/>
          <circle cx="5" cy="8" r="0.8"/><circle cx="9" cy="8" r="0.8"/><circle cx="13" cy="8" r="0.8"/>
          <circle cx="17" cy="8" r="0.8"/><circle cx="21" cy="8" r="0.8"/>
          <circle cx="3" cy="10" r="0.8"/><circle cx="7" cy="10" r="0.8"/><circle cx="11" cy="10" r="0.8"/>
          <circle cx="15" cy="10" r="0.8"/><circle cx="19" cy="10" r="0.8"/><circle cx="23" cy="10" r="0.8"/>
          <circle cx="5" cy="12" r="0.8"/><circle cx="9" cy="12" r="0.8"/><circle cx="13" cy="12" r="0.8"/>
          <circle cx="17" cy="12" r="0.8"/><circle cx="21" cy="12" r="0.8"/>
        </g>
      </svg>
    ),
    GB: (
      <svg className="w-10 h-10 rounded" viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
      </svg>
    ),
    CA: (
      <svg className="w-10 h-10 rounded" viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#fff"/>
        <rect width="15" height="30" fill="#FF0000"/>
        <rect x="45" width="15" height="30" fill="#FF0000"/>
        <path d="M30,8 L32,13 L37,12 L33,16 L35,21 L30,18 L25,21 L27,16 L23,12 L28,13 Z" fill="#FF0000"/>
      </svg>
    ),
    NG: (
      <svg className="w-10 h-10 rounded" viewBox="0 0 60 30">
        <rect width="20" height="30" fill="#008751"/>
        <rect x="20" width="20" height="30" fill="#fff"/>
        <rect x="40" width="20" height="30" fill="#008751"/>
      </svg>
    ),
    DE: (
      <svg className="w-10 h-10 rounded" viewBox="0 0 60 30">
        <rect width="60" height="10" fill="#000"/>
        <rect y="10" width="60" height="10" fill="#D00"/>
        <rect y="20" width="60" height="10" fill="#FFCE00"/>
      </svg>
    ),
    FR: (
      <svg className="w-10 h-10 rounded" viewBox="0 0 60 30">
        <rect width="20" height="30" fill="#002395"/>
        <rect x="20" width="20" height="30" fill="#fff"/>
        <rect x="40" width="20" height="30" fill="#ED2939"/>
      </svg>
    ),
  };

  return flags[countryCode] || (
    <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
      {countryCode}
    </div>
  );
};

const countries: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1', pricePerMonth: 5.99, available: 245 },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', pricePerMonth: 4.99, available: 189 },
  { code: 'CA', name: 'Canada', dialCode: '+1', pricePerMonth: 5.49, available: 156 },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', pricePerMonth: 3.99, available: 312 },
  { code: 'DE', name: 'Germany', dialCode: '+49', pricePerMonth: 6.49, available: 98 },
  { code: 'FR', name: 'France', dialCode: '+33', pricePerMonth: 6.99, available: 76 },
];

const mockNumbers: VirtualNumber[] = [
  {
    id: '1',
    number: '+1 (555) 123-4567',
    country: 'US',
    type: 'both',
    status: 'active',
    expiresAt: '2025-03-15',
    purchasedAt: '2024-12-01'
  },
  {
    id: '2',
    number: '+234 812 345 6789',
    country: 'NG',
    type: 'sms',
    status: 'active',
    expiresAt: '2025-02-20',
    purchasedAt: '2024-11-20'
  },
  {
    id: '3',
    number: '+44 20 7123 4567',
    country: 'GB',
    type: 'both',
    status: 'expired',
    expiresAt: '2024-12-20',
    purchasedAt: '2024-11-01'
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    numberId: '1',
    from: '+1 (555) 987-6543',
    content: 'Your verification code is 123456',
    timestamp: '2024-12-25 14:30',
    type: 'sms'
  },
  {
    id: '2',
    numberId: '1',
    from: '+1 (555) 888-9999',
    content: 'Incoming call',
    timestamp: '2024-12-25 12:15',
    type: 'call',
    duration: '3:45'
  },
  {
    id: '3',
    numberId: '2',
    from: '+234 801 234 5678',
    content: 'Welcome to our service!',
    timestamp: '2024-12-24 18:20',
    type: 'sms'
  },
  {
    id: '4',
    numberId: '1',
    from: '+1 (555) 777-8888',
    content: 'Your package has been delivered',
    timestamp: '2024-12-24 09:10',
    type: 'sms'
  },
];

// Purchase Numbers Component
const PurchaseView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'sms' | 'voice' | 'both'>('all');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Purchase Virtual Number</h2>
          <p className="text-gray-400 mt-1">Get a virtual phone number from any country</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'sms', 'voice', 'both'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {type === 'all' ? 'All Types' : type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCountries.map(country => (
          <div
            key={country.code}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => setSelectedCountry(country)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
              <Flag countryCode={country.code} />
                <div>
                  <h3 className="text-lg font-semibold text-white">{country.name}</h3>
                  <p className="text-sm text-gray-400">{country.code}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Available:</span>
              <span className="text-green-400 font-semibold">{country.available} numbers</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Price:</span>
              <span className="text-white font-bold">${country.pricePerMonth}/month</span>
            </div>

            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Purchase Number
            </button>
          </div>
        ))}
      </div>

      {selectedCountry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Confirm Purchase</h3>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
              <Flag countryCode={selectedCountry.code} />
                <div>
                  <p className="text-white font-semibold">{selectedCountry.name}</p>
                  <p className="text-gray-400 text-sm">Virtual Phone Number</p>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Fee:</span>
                  <span className="text-white">${selectedCountry.pricePerMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Setup Fee:</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-blue-400 font-bold">${selectedCountry.pricePerMonth}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedCountry(null)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Number purchased successfully!');
                  setSelectedCountry(null);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// My Numbers Component
const MyNumbersView = () => {
  const [numbers] = useState(mockNumbers);
  const [selectedNumber, setSelectedNumber] = useState<VirtualNumber | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'expired': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sms': return <LuMessageSquare className="w-5 h-5" />;
      case 'voice': return <LuPhoneCall className="w-5 h-5" />;
      case 'both': return <LuPhone className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Virtual Numbers</h2>
          <p className="text-gray-400 mt-1">Manage your active virtual phone numbers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {numbers.map(number => (
          <div
            key={number.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {getTypeIcon(number.type)}
                <span className={`text-sm font-medium ${getStatusColor(number.status)}`}>
                  {number.status.toUpperCase()}
                </span>
              </div>
              <Flag countryCode={number.country} />
            </div>

            <div className="mb-4">
              <p className="text-xl font-bold text-white mb-1">{number.number}</p>
              <p className="text-gray-400 text-sm">
                {countries.find(c => c.code === number.country)?.name}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Type:</span>
                <span className="text-white capitalize">{number.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Expires:</span>
                <span className="text-white">{number.expiresAt}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedNumber(number)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Manage
              </button>
              {number.status === 'active' && (
                <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  <LuRefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedNumber && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Manage Number</h3>
              <button
                onClick={() => setSelectedNumber(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-2xl font-bold text-white mb-2">{selectedNumber.number}</p>
                <p className="text-gray-400">{countries.find(c => c.code === selectedNumber.country)?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  <LuCopy className="w-4 h-4" />
                  Copy Number
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <LuRefreshCw className="w-4 h-4" />
                  Renew
                </button>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                <LuTrash2 className="w-4 h-4" />
                Delete Number
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Messages Component
const MessagesView = () => {
  const [messages] = useState(mockMessages);
  const [selectedNumber, setSelectedNumber] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'sms' | 'call'>('all');

  const filteredMessages = messages.filter(msg => {
    const numberMatch = selectedNumber === 'all' || msg.numberId === selectedNumber;
    const typeMatch = selectedType === 'all' || msg.type === selectedType;
    return numberMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Messages & Calls</h2>
          <p className="text-gray-400 mt-1">View your SMS and call history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Filter by Number</label>
          <select
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Numbers</option>
            {mockNumbers.map(num => (
              <option key={num.id} value={num.id}>{num.number}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Filter by Type</label>
          <div className="flex gap-2">
            {(['all', 'sms', 'call'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {type === 'all' ? 'All' : type === 'sms' ? 'SMS' : 'Calls'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredMessages.map(msg => (
          <div
            key={msg.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {msg.type === 'sms' ? (
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <LuMessageSquare className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="p-2 bg-green-600 rounded-lg">
                    <LuPhoneCall className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold">{msg.from}</p>
                  <p className="text-gray-400 text-sm">
                    To: {mockNumbers.find(n => n.id === msg.numberId)?.number}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">{msg.timestamp}</p>
                {msg.duration && (
                  <p className="text-green-400 text-sm font-semibold">{msg.duration}</p>
                )}
              </div>
            </div>

            {msg.type === 'sms' && (
              <div className="bg-gray-900 rounded-lg p-3">
                <p className="text-white">{msg.content}</p>
              </div>
            )}

            {msg.type === 'call' && (
              <div className="flex items-center gap-2 text-gray-400">
                <LuPhoneCall className="w-4 h-4" />
                <span>{msg.content}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <LuCircleAlert className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No messages found</p>
        </div>
      )}
    </div>
  );
};

// Settings Component
const SettingsView = () => {
  const [autoRenew, setAutoRenew] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [smsForwarding, setSmsForwarding] = useState(false);
  const [callForwarding, setCallForwarding] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-gray-400 mt-1">Manage your virtual number preferences</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-Renew Numbers</p>
                <p className="text-gray-400 text-sm">Automatically renew numbers before expiry</p>
              </div>
              <button
                onClick={() => setAutoRenew(!autoRenew)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  autoRenew ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  autoRenew ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notifications</p>
                <p className="text-gray-400 text-sm">Receive alerts for new messages and calls</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Forwarding Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">SMS Forwarding</p>
                <p className="text-gray-400 text-sm">Forward SMS to your email</p>
              </div>
              <button
                onClick={() => setSmsForwarding(!smsForwarding)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  smsForwarding ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  smsForwarding ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {smsForwarding && (
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Call Forwarding</p>
                <p className="text-gray-400 text-sm">Forward calls to your phone number</p>
              </div>
              <button
                onClick={() => setCallForwarding(!callForwarding)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  callForwarding ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  callForwarding ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {callForwarding && (
              <input
                type="tel"
                placeholder="Enter phone number"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            )}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Active Numbers:</span>
              <span className="text-white font-semibold">2</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Total Messages:</span>
              <span className="text-white font-semibold">4</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Member Since:</span>
              <span className="text-white font-semibold">Nov 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function VirtualNumberPage() {
  const [activeView, setActiveView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      return hash || 'purchase';
    }
    return 'purchase';
  });

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const navItems = [
    { id: 'purchase', label: 'Purchase Numbers', icon: LuShoppingCart },
    { id: 'numbers', label: 'My Numbers', icon: LuPhone },
    { id: 'messages', label: 'Messages & Calls', icon: LuMessageSquare },
    { id: 'settings', label: 'Settings', icon: LuSettings },
  ];

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-lg">
              <LuPhone className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Virtual Numbers</h1>
              <p className="text-gray-400">Get virtual phone numbers worldwide</p>
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
          {activeView === 'purchase' && <PurchaseView />}
          {activeView === 'numbers' && <MyNumbersView />}
          {activeView === 'messages' && <MessagesView />}
          {activeView === 'settings' && <SettingsView />}
        </div>
      </div>
    </div>
  );
}