'use client'
import { useState, useEffect } from 'react';
import { LuCreditCard, LuSmartphone, LuFileText, LuSend, LuCoins } from 'react-icons/lu';

type NeonPayView = 'wallet' | 'vtu' | 'bills' | 'transfers' | 'tokens';
type NetworkProvider = 'mtn' | 'glo' | 'airtel' | '9mobile';
type ServiceType = 'airtime' | 'data';

interface DataPlan {
  id: string;
  name: string;
  price: number;
}

const dataPlans: Record<NetworkProvider, DataPlan[]> = {
  mtn: [
    { id: 'mtn_1gb', name: '1GB - 30 Days', price: 300 },
    { id: 'mtn_2gb', name: '2GB - 30 Days', price: 600 },
    { id: 'mtn_5gb', name: '5GB - 30 Days', price: 1500 },
    { id: 'mtn_10gb', name: '10GB - 30 Days', price: 3000 },
  ],
  glo: [
    { id: 'glo_1gb', name: '1GB - 30 Days', price: 250 },
    { id: 'glo_2gb', name: '2GB - 30 Days', price: 500 },
    { id: 'glo_5gb', name: '5GB - 30 Days', price: 1250 },
    { id: 'glo_10gb', name: '10GB - 30 Days', price: 2500 },
  ],
  airtel: [
    { id: 'airtel_1gb', name: '1GB - 30 Days', price: 300 },
    { id: 'airtel_2gb', name: '2GB - 30 Days', price: 600 },
    { id: 'airtel_5gb', name: '5GB - 30 Days', price: 1500 },
    { id: 'airtel_10gb', name: '10GB - 30 Days', price: 3000 },
  ],
  '9mobile': [
    { id: '9mobile_1gb', name: '1GB - 30 Days', price: 280 },
    { id: '9mobile_2gb', name: '2GB - 30 Days', price: 560 },
    { id: '9mobile_5gb', name: '5GB - 30 Days', price: 1400 },
    { id: '9mobile_10gb', name: '10GB - 30 Days', price: 2800 },
  ],
};

function WalletView({ balance }: { balance: number }) {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState('');

  const handleAddFunds = () => {
    if (!amount || parseFloat(amount) < 100) {
      alert('Please enter a valid amount (minimum ₦100)');
      return;
    }
    alert(`Adding ₦${amount} to wallet`);
    setAmount('');
    setShowAddFunds(false);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <LuCreditCard className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold">Wallet</h1>
      </div>

      <div className="bg-linear-to-br from-green-500 to-green-700 rounded-lg p-6 mb-6 max-w-md">
        <p className="text-sm opacity-80 mb-2">Available Balance</p>
        <p className="text-3xl font-bold">₦{balance.toLocaleString()}</p>
      </div>

      {!showAddFunds ? (
        <button
          onClick={() => setShowAddFunds(true)}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition"
        >
          Add Funds
        </button>
      ) : (
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-500 focus:outline-none"
              min="100"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddFunds}
              className="flex-1 bg-green-500 hover:bg-green-600 p-3 rounded-lg font-semibold transition"
            >
              Proceed to Payment
            </button>
            <button
              onClick={() => setShowAddFunds(false)}
              className="px-6 bg-white/10 hover:bg-white/20 p-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-3 max-w-md">
          {[
            { desc: 'MTN Airtime Purchase', amount: -500, date: '2 hours ago' },
            { desc: 'Wallet Funding', amount: 5000, date: 'Yesterday' },
            { desc: 'Electricity Bill', amount: -2500, date: '2 days ago' },
          ].map((tx, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">{tx.desc}</p>
                <p className="text-sm text-gray-400">{tx.date}</p>
              </div>
              <p className={tx.amount > 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VTUView({ balance }: { balance: number }) {
  const [serviceType, setServiceType] = useState<ServiceType>('airtime');
  const [network, setNetwork] = useState<NetworkProvider>('mtn');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [dataPlan, setDataPlan] = useState('');

  const handlePurchase = () => {
    if (!phone || phone.length !== 11) {
      alert('Please enter a valid 11-digit phone number');
      return;
    }

    const total = serviceType === 'airtime' ? parseFloat(amount) : 
      dataPlans[network].find(p => p.id === dataPlan)?.price || 0;
    
    if (!total) {
      alert('Please select a valid amount or data plan');
      return;
    }

    if (total > balance) {
      alert('Insufficient balance!');
      return;
    }

    alert(`Purchasing ${serviceType} for ${phone}: ₦${total}`);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <LuSmartphone className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold">Airtime & Data</h1>
      </div>

      <p className="mb-6 text-gray-400">
        Wallet Balance: <span className="text-green-400 font-semibold">₦{balance.toLocaleString()}</span>
      </p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setServiceType('airtime')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            serviceType === 'airtime' ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          Airtime
        </button>
        <button
          onClick={() => setServiceType('data')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            serviceType === 'data' ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          Data
        </button>
      </div>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-2">Network Provider</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value as NetworkProvider)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none"
          >
            <option value="mtn">MTN</option>
            <option value="glo">Glo</option>
            <option value="airtel">Airtel</option>
            <option value="9mobile">9mobile</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08012345678"
            maxLength={11}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {serviceType === 'airtime' ? (
          <div>
            <label className="block text-sm mb-2">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none"
              min="50"
              max="50000"
            />
            <div className="flex gap-2 mt-2">
              {[100, 200, 500, 1000].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded transition text-sm"
                >
                  ₦{val}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm mb-2">Data Plan</label>
            <select
              value={dataPlan}
              onChange={(e) => setDataPlan(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a plan</option>
              {dataPlans[network].map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ₦{plan.price}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handlePurchase}
          className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-semibold transition"
        >
          Purchase {serviceType === 'airtime' ? `₦${amount || 0}` : 'Data'}
        </button>
      </div>
    </div>
  );
}

function BillsView({ balance }: { balance: number }) {
  const [billType, setBillType] = useState<'electricity' | 'cable' | 'internet'>('electricity');
  const [provider, setProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');

  const providers = {
    electricity: ['IKEDC', 'EKEDC', 'AEDC', 'PHED', 'BEDC'],
    cable: ['DSTV', 'GOTV', 'Startime', 'Showmax'],
    internet: ['Smile', 'Spectranet', 'Swift', 'Airtel'],
  };

  const handlePayBill = () => {
    if (!provider || !accountNumber || !amount) {
      alert('Please fill all fields');
      return;
    }

    if (parseFloat(amount) > balance) {
      alert('Insufficient balance!');
      return;
    }

    alert(`Paying ₦${amount} for ${billType} - ${provider}`);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <LuFileText className="w-6 h-6 text-purple-400" />
        <h1 className="text-2xl font-bold">Bills Payment</h1>
      </div>

      <p className="text-gray-400 mb-6">
        Wallet Balance: <span className="text-green-400 font-semibold">₦{balance.toLocaleString()}</span>
      </p>

      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setBillType('electricity')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            billType === 'electricity' ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          Electricity
        </button>
        <button
          onClick={() => setBillType('cable')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            billType === 'cable' ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          Cable TV
        </button>
        <button
          onClick={() => setBillType('internet')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            billType === 'internet' ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          Internet
        </button>
      </div>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-2">Service Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
          >
            <option value="">Select provider</option>
            {providers[billType].map((p) => (
              <option className='text-muted' key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">
            {billType === 'electricity' ? 'Meter Number' : 
             billType === 'cable' ? 'Smart Card Number' : 'Account Number'}
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder={`Enter your ${billType === 'electricity' ? 'meter' : 'account'} number`}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Amount (₦)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none"
            min="500"
          />
        </div>

        <button
          onClick={handlePayBill}
          className="w-full bg-purple-500 hover:bg-purple-600 p-3 rounded-lg font-semibold transition"
        >
          Pay ₦{amount || 0}
        </button>
      </div>
    </div>
  );
}

function TransfersView({ balance }: { balance: number }) {
  const [transferType, setTransferType] = useState<'bank' | 'wallet'>('bank');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [walletId, setWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');

  const handleTransfer = () => {
    if (transferType === 'bank' && (!bankCode || !accountNumber)) {
      alert('Please select bank and enter account number');
      return;
    }

    if (transferType === 'wallet' && !walletId) {
      alert('Please enter wallet ID or email');
      return;
    }

    if (!amount) {
      alert('Please enter amount');
      return;
    }

    if (parseFloat(amount) > balance) {
      alert('Insufficient balance!');
      return;
    }

    alert(`Transferring ₦${amount}`);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <LuSend className="w-6 h-6 text-yellow-400" />
        <h1 className="text-2xl font-bold">Transfers</h1>
      </div>

      <p className="text-gray-400 mb-6">
        Wallet Balance: <span className="text-green-400 font-semibold">₦{balance.toLocaleString()}</span>
      </p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTransferType('bank')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            transferType === 'bank' ? 'bg-yellow-500 text-black' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          Bank Transfer
        </button>
        <button
          onClick={() => setTransferType('wallet')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            transferType === 'wallet' ? 'bg-yellow-500 text-black' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          Wallet Transfer
        </button>
      </div>

      <div className="space-y-4 max-w-md">
        {transferType === 'bank' ? (
          <>
            <div>
              <label className="block text-sm mb-2">Bank</label>
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-yellow-500 focus:outline-none"
              >
                <option value="">Select bank</option>
                <option value="058">GTBank</option>
                <option value="044">Access Bank</option>
                <option value="057">Zenith Bank</option>
                <option value="033">UBA</option>
                <option value="032">Union Bank</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter 10-digit account number"
                maxLength={10}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-yellow-500 focus:outline-none"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm mb-2">Wallet ID or Email</label>
            <input
              type="text"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              placeholder="Enter wallet ID or email"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-yellow-500 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-sm mb-2">Amount (₦)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-yellow-500 focus:outline-none"
            min="100"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Narration (Optional)</label>
          <input
            type="text"
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            placeholder="What's this for?"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-yellow-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleTransfer}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-lg font-semibold transition"
        >
          Transfer ₦{amount || 0}
        </button>
      </div>
    </div>
  );
}

function TokensView({ balance }: { balance: number }) {
  const [tokenType, setTokenType] = useState('electricity');
  const [provider, setProvider] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handleBuyToken = () => {
    if (!provider || !meterNumber || !amount) {
      alert('Please fill all fields');
      return;
    }

    if (parseFloat(amount) > balance) {
      alert('Insufficient balance!');
      return;
    }

    alert(`Purchasing ${tokenType} token for ₦${amount}`);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <LuCoins className="w-6 h-6 text-orange-400" />
        <h1 className="text-2xl font-bold">Token Purchase</h1>
      </div>

      <p className="text-gray-400 mb-6">
        Wallet Balance: <span className="text-green-400 font-semibold">₦{balance.toLocaleString()}</span>
      </p>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-2">Token Type</label>
          <select
            value={tokenType}
            onChange={(e) => setTokenType(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none"
          >
            <option value="electricity">Electricity Token</option>
            <option value="betting">Betting Voucher</option>
            <option value="gift">Gift Card</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Service Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none"
          >
            <option value="">Select provider</option>
            {tokenType === 'electricity' && (
              <>
                <option value="ikedc">IKEDC</option>
                <option value="ekedc">EKEDC</option>
                <option value="aedc">AEDC</option>
                <option value="phed">PHED</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Meter Number</label>
          <input
            type="text"
            value={meterNumber}
            onChange={(e) => setMeterNumber(e.target.value)}
            placeholder="Enter meter number"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Amount (₦)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none"
            min="1000"
          />
          <div className="flex gap-2 mt-2">
            {[1000, 2000, 5000, 10000].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded transition text-sm"
              >
                ₦{val}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleBuyToken}
          className="w-full bg-orange-500 hover:bg-orange-600 p-3 rounded-lg font-semibold transition"
        >
          Buy Token
        </button>
      </div>
    </div>
  );
}

export default function NeonPayDashboardPage() {
  const [view, setView] = useState<NeonPayView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as NeonPayView;
      if (['wallet', 'vtu', 'bills', 'transfers', 'tokens'].includes(hash)) {
        return hash;
      }
    }
    return 'wallet';
  });
  
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NeonPayView;
      if (['wallet', 'vtu', 'bills', 'transfers', 'tokens'].includes(hash)) {
        setView(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    async function fetchWallet() {
      await new Promise(resolve => setTimeout(resolve, 500));
      const balance = 25000;
      setWalletBalance(balance);
      setLoading(false);
    }
    fetchWallet();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading NeonPay...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto p-8 bg-muted/30 rounded-2xl">
        {view === 'wallet' && <WalletView balance={walletBalance!} />}
        {view === 'vtu' && <VTUView balance={walletBalance!} />}
        {view === 'bills' && <BillsView balance={walletBalance!} />}
        {view === 'transfers' && <TransfersView balance={walletBalance!} />}
        {view === 'tokens' && <TokensView balance={walletBalance!} />}
      </div>
    </div>
  );
}