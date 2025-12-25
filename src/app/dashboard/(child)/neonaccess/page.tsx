'use client'
import { useState, useEffect } from 'react';
import { LuShoppingBag, LuShield, LuUsers, LuStar, LuSearch, LuFilter, LuEye, LuShoppingCart } from 'react-icons/lu';
import clsx from 'clsx';

type NeonAccessView = 'social' | 'marketplace' | 'escrow';
type Platform = 'instagram' | 'twitter' | 'tiktok' | 'facebook' | 'youtube' | 'linkedin';
type Category = 'gaming' | 'streaming' | 'marketplace' | 'social';

interface SocialAccount {
  id: string;
  platform: Platform;
  username: string;
  followers: number;
  price: number;
  verified: boolean;
  description: string;
  engagement: string;
  seller: string;
  rating: number;
}

interface EscrowTransaction {
  id: string;
  item: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'disputed';
  buyer: string;
  seller: string;
  date: string;
}

const mockAccounts: SocialAccount[] = [
  {
    id: '1',
    platform: 'instagram',
    username: '@lifestyle_daily',
    followers: 125000,
    price: 450000,
    verified: true,
    description: 'Lifestyle niche account with high engagement rate',
    engagement: '8.5%',
    seller: 'ProSeller',
    rating: 4.8
  },
  {
    id: '2',
    platform: 'twitter',
    username: '@tech_news_hub',
    followers: 89000,
    price: 280000,
    verified: false,
    description: 'Tech news and updates account with active community',
    engagement: '6.2%',
    seller: 'TechMaster',
    rating: 4.5
  },
  {
    id: '3',
    platform: 'tiktok',
    username: '@comedy_clips',
    followers: 450000,
    price: 850000,
    verified: true,
    description: 'Comedy content creator account with viral potential',
    engagement: '12.3%',
    seller: 'ContentKing',
    rating: 4.9
  },
  {
    id: '4',
    platform: 'youtube',
    username: 'Gaming Pro Channel',
    followers: 75000,
    price: 950000,
    verified: true,
    description: 'Gaming channel with monetization enabled',
    engagement: '5.8%',
    seller: 'GamerElite',
    rating: 4.7
  },
  {
    id: '5',
    platform: 'facebook',
    username: 'Local Business Hub',
    followers: 35000,
    price: 180000,
    verified: false,
    description: 'Business page with local audience engagement',
    engagement: '4.2%',
    seller: 'BizGuru',
    rating: 4.3
  },
  {
    id: '6',
    platform: 'linkedin',
    username: 'Professional Network',
    followers: 25000,
    price: 320000,
    verified: true,
    description: 'B2B focused professional network page',
    engagement: '7.1%',
    seller: 'B2BExpert',
    rating: 4.6
  }
];

const mockEscrowTransactions: EscrowTransaction[] = [
  {
    id: 'ESC001',
    item: '@lifestyle_daily Instagram Account',
    amount: 450000,
    status: 'in_progress',
    buyer: 'You',
    seller: 'ProSeller',
    date: '2 hours ago'
  },
  {
    id: 'ESC002',
    item: '@tech_blog Twitter Account',
    amount: 180000,
    status: 'completed',
    buyer: 'You',
    seller: 'TechMaster',
    date: '3 days ago'
  },
  {
    id: 'ESC003',
    item: 'Gaming Channel YouTube',
    amount: 650000,
    status: 'pending',
    buyer: 'BuyerXYZ',
    seller: 'You',
    date: '1 day ago'
  }
];

function SocialServicesView() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);

  const platforms: { value: Platform | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All Platforms', color: 'bg-gray-600' },
    { value: 'instagram', label: 'Instagram', color: 'bg-pink-600' },
    { value: 'twitter', label: 'Twitter', color: 'bg-blue-500' },
    { value: 'tiktok', label: 'TikTok', color: 'bg-black' },
    { value: 'youtube', label: 'YouTube', color: 'bg-red-600' },
    { value: 'facebook', label: 'Facebook', color: 'bg-blue-700' },
    { value: 'linkedin', label: 'LinkedIn', color: 'bg-blue-800' }
  ];

  const filteredAccounts = mockAccounts.filter(account => {
    const matchesPlatform = selectedPlatform === 'all' || account.platform === selectedPlatform;
    const matchesSearch = account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (priceRange === 'low') matchesPrice = account.price < 200000;
    if (priceRange === 'mid') matchesPrice = account.price >= 200000 && account.price < 500000;
    if (priceRange === 'high') matchesPrice = account.price >= 500000;

    return matchesPlatform && matchesSearch && matchesPrice;
  });

  const handleBuyAccount = (account: SocialAccount) => {
    alert(`Initiating purchase for ${account.username} - ₦${account.price.toLocaleString()}\nYou will be redirected to escrow payment.`);
  };

  if (selectedAccount) {
    return (
      <div className='w-screen h-screen flex flex-col items-center '>
        <button
          onClick={() => setSelectedAccount(null)}
          className={clsx('mb-4', 'text-blue-400', 'hover:text-blue-300', 'flex w-full', 'items-center', 'gap-2')}
        >
          ← Back to listings
        </button>

        <div className={clsx('flex flex-col w-full  bg-white/5', 'rounded-lg', 'p-6', 'max-w-2xl')}>
          <div className={clsx('flex', 'items-start', 'justify-between', 'mb-4')}>
            <div>
              <h2 className={clsx('text-2xl', 'font-bold', 'mb-2')}>{selectedAccount.username}</h2>
              <div className={clsx('flex', 'items-center', 'gap-3', 'text-sm', 'text-gray-400')}>
                <span className="capitalize">{selectedAccount.platform}</span>
                {selectedAccount.verified && (
                  <span className={clsx('bg-blue-500/20', 'text-blue-400', 'px-2', 'py-1', 'rounded')}>✓ Verified</span>
                )}
                <span className={clsx('flex', 'items-center', 'gap-1')}>
                  <LuStar className={clsx('w-4', 'h-4', 'text-yellow-400', 'fill-yellow-400')} />
                  {selectedAccount.rating}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className={clsx('text-3xl', 'font-bold', 'text-green-400')}>₦{selectedAccount.price.toLocaleString()}</p>
            </div>
          </div>

          <div className={clsx('space-y-4', 'mb-6')}>
            <div>
              <h3 className={clsx('font-semibold', 'mb-2')}>Account Details</h3>
              <div className={clsx('grid', 'grid-cols-2', 'gap-4', 'text-sm')}>
                <div className={clsx('bg-white/5', 'p-3', 'rounded')}>
                  <p className="text-gray-400">Followers</p>
                  <p className={clsx('font-semibold', 'text-lg')}>{selectedAccount.followers.toLocaleString()}</p>
                </div>
                <div className={clsx('bg-white/5', 'p-3', 'rounded')}>
                  <p className="text-gray-400">Engagement Rate</p>
                  <p className={clsx('font-semibold', 'text-lg')}>{selectedAccount.engagement}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className={clsx('font-semibold', 'mb-2')}>Description</h3>
              <p className="text-gray-300">{selectedAccount.description}</p>
            </div>

            <div>
              <h3 className={clsx('font-semibold', 'mb-2')}>Seller Information</h3>
              <div className={clsx('flex', 'items-center', 'gap-3')}>
                <div className={clsx('w-10', 'h-10', 'bg-linear-to-br', 'from-blue-500', 'to-purple-600', 'rounded-full', 'flex', 'items-center', 'justify-center')}>
                  {selectedAccount.seller[0]}
                </div>
                <div>
                  <p className="font-medium">{selectedAccount.seller}</p>
                  <p className={clsx('text-sm', 'text-gray-400')}>Trusted Seller</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleBuyAccount(selectedAccount)}
            className={clsx('w-full', 'bg-green-500', 'hover:bg-green-600', 'py-3', 'rounded-lg', 'font-semibold', 'transition', 'flex', 'items-center', 'justify-center', 'gap-2')}
          >
            <LuShoppingCart className={clsx('w-5', 'h-5')} />
            Buy with Escrow Protection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={clsx('flex', 'items-center', 'gap-2', 'mb-6')}>
        <LuUsers className={clsx('w-6', 'h-6', 'text-pink-400')} />
        <h1 className={clsx('text-2xl', 'font-bold')}>Social Media Accounts</h1>
      </div>

      <div className={clsx('mb-6', 'space-y-4')}>
        <div className={clsx('flex', 'gap-3', 'items-center')}>
          <div className={clsx('flex-1', 'relative')}>
            <LuSearch className={clsx('absolute', 'left-3', 'top-1/2', '-translate-y-1/2', 'w-5', 'h-5', 'text-gray-400')} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accounts..."
              className={clsx('w-full', 'pl-10', 'pr-4', 'py-3', 'rounded-lg', 'bg-white/10', 'border', 'border-white/20', 'focus:border-pink-500', 'focus:outline-none')}
            />
          </div>
          <button className={clsx('p-3', 'bg-white/10', 'hover:bg-white/20', 'rounded-lg', 'transition')}>
            <LuFilter className={clsx('w-5', 'h-5')} />
          </button>
        </div>

        <div className={clsx('flex', 'gap-2', 'flex-wrap')}>
          {platforms.map(platform => (
            <button
              key={platform.value}
              onClick={() => setSelectedPlatform(platform.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedPlatform === platform.value
                  ? `${platform.color} text-white`
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {platform.label}
            </button>
          ))}
        </div>

        <div className={clsx('flex', 'gap-2')}>
          {[
            { value: 'all', label: 'All Prices' },
            { value: 'low', label: 'Under ₦200k' },
            { value: 'mid', label: '₦200k - ₦500k' },
            { value: 'high', label: 'Above ₦500k' }
          ].map(range => (
            <button
              key={range.value}
              onClick={() => setPriceRange(range.value as 'all' | 'low' | 'mid' | 'high')}
              className={`px-3 py-1 rounded text-sm transition ${
                priceRange === range.value
                  ? 'bg-pink-500'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4')}>
        {filteredAccounts.map(account => (
          <div
            key={account.id}
            className={clsx('bg-white/5', 'rounded-lg', 'p-4', 'hover:bg-white/10', 'transition', 'cursor-pointer')}
            onClick={() => setSelectedAccount(account)}
          >
            <div className={clsx('flex', 'items-start', 'justify-between', 'mb-3')}>
              <div>
                <h3 className={clsx('font-semibold', 'mb-1')}>{account.username}</h3>
                <p className={clsx('text-sm', 'text-gray-400', 'capitalize')}>{account.platform}</p>
              </div>
              {account.verified && (
                <span className={clsx('text-blue-400', 'text-xs', 'bg-blue-500/20', 'px-2', 'py-1', 'rounded')}>✓</span>
              )}
            </div>

            <div className={clsx('space-y-2', 'mb-3')}>
              <div className={clsx('flex', 'justify-between', 'text-sm')}>
                <span className="text-gray-400">Followers</span>
                <span className="font-medium">{account.followers.toLocaleString()}</span>
              </div>
              <div className={clsx('flex', 'justify-between', 'text-sm')}>
                <span className="text-gray-400">Engagement</span>
                <span className={clsx('font-medium', 'text-green-400')}>{account.engagement}</span>
              </div>
              <div className={clsx('flex', 'justify-between', 'text-sm')}>
                <span className="text-gray-400">Seller Rating</span>
                <span className={clsx('flex', 'items-center', 'gap-1')}>
                  <LuStar className={clsx('w-3', 'h-3', 'text-yellow-400', 'fill-yellow-400')} />
                  {account.rating}
                </span>
              </div>
            </div>

            <div className={clsx('flex', 'items-center', 'justify-between', 'pt-3', 'border-t', 'border-white/10')}>
              <span className={clsx('text-lg', 'font-bold', 'text-green-400')}>₦{account.price.toLocaleString()}</span>
              <button className={clsx('text-sm', 'text-blue-400', 'hover:text-blue-300', 'flex', 'items-center', 'gap-1')}>
                <LuEye className={clsx('w-4', 'h-4')} />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <div className={clsx('text-center', 'py-12', 'text-gray-400')}>
          <p>No accounts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

function MarketplaceView() {
  const [category, setCategory] = useState<Category | 'all'>('all');

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📦' },
    { value: 'gaming', label: 'Gaming Accounts', icon: '🎮' },
    { value: 'streaming', label: 'Streaming', icon: '📺' },
    { value: 'marketplace', label: 'Marketplace', icon: '🛍️' },
    { value: 'social', label: 'Social Media', icon: '💬' }
  ];

  return (
    <div>
      <div className={clsx('flex', 'items-center', 'gap-2', 'mb-6')}>
        <LuShoppingBag className={clsx('w-6', 'h-6', 'text-purple-400')} />
        <h1 className={clsx('text-2xl', 'font-bold')}>Marketplace</h1>
      </div>

      <div className="mb-6">
        <div className={clsx('flex', 'gap-3', 'mb-6', 'flex-wrap')}>
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value as Category | 'all')}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                category === cat.value
                  ? 'bg-purple-500'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className={clsx('bg-linear-to-r', 'from-purple-500/20', 'to-pink-500/20', 'rounded-lg', 'p-6', 'mb-6')}>
          <h2 className={clsx('text-xl', 'font-bold', 'mb-2')}>List Your Account</h2>
          <p className={clsx('text-gray-300', 'mb-4')}>
            Sell your social media accounts, gaming profiles, or digital assets securely with our escrow protection.
          </p>
          <button className={clsx('bg-purple-500', 'hover:bg-purple-600', 'px-6', 'py-2', 'rounded-lg', 'font-semibold', 'transition')}>
            Create Listing
          </button>
        </div>
      </div>

      <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
        <div className={clsx('bg-white/5', 'rounded-lg', 'p-6')}>
          <div className={clsx('flex', 'items-center', 'gap-3', 'mb-4')}>
            <div className={clsx('w-12', 'h-12', 'bg-linear-to-br', 'from-red-500', 'to-orange-500', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'text-2xl')}>
              🎮
            </div>
            <div>
              <h3 className="font-bold">Steam Account - Level 50</h3>
              <p className={clsx('text-sm', 'text-gray-400')}>200+ games included</p>
            </div>
          </div>
          <div className={clsx('flex', 'items-center', 'justify-between')}>
            <span className={clsx('text-2xl', 'font-bold', 'text-green-400')}>₦85,000</span>
            <button className={clsx('bg-purple-500', 'hover:bg-purple-600', 'px-4', 'py-2', 'rounded-lg', 'text-sm', 'font-semibold', 'transition')}>
              View Details
            </button>
          </div>
        </div>

        <div className={clsx('bg-white/5', 'rounded-lg', 'p-6')}>
          <div className={clsx('flex', 'items-center', 'gap-3', 'mb-4')}>
            <div className={clsx('w-12', 'h-12', 'bg-linear-to-br', 'from-green-500', 'to-emerald-500', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'text-2xl')}>
              🛒
            </div>
            <div>
              <h3 className="font-bold">Amazon Seller Account</h3>
              <p className={clsx('text-sm', 'text-gray-400')}>Established ratings</p>
            </div>
          </div>
          <div className={clsx('flex', 'items-center', 'justify-between')}>
            <span className={clsx('text-2xl', 'font-bold', 'text-green-400')}>₦450,000</span>
            <button className={clsx('bg-purple-500', 'hover:bg-purple-600', 'px-4', 'py-2', 'rounded-lg', 'text-sm', 'font-semibold', 'transition')}>
              View Details
            </button>
          </div>
        </div>

        <div className={clsx('bg-white/5', 'rounded-lg', 'p-6')}>
          <div className={clsx('flex', 'items-center', 'gap-3', 'mb-4')}>
            <div className={clsx('w-12', 'h-12', 'bg-linear-to-br', 'from-purple-500', 'to-pink-500', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'text-2xl')}>
              📺
            </div>
            <div>
              <h3 className="font-bold">Twitch Partner Account</h3>
              <p className={clsx('text-sm', 'text-gray-400')}>12k followers, monetized</p>
            </div>
          </div>
          <div className={clsx('flex', 'items-center', 'justify-between')}>
            <span className={clsx('text-2xl', 'font-bold', 'text-green-400')}>₦650,000</span>
            <button className={clsx('bg-purple-500', 'hover:bg-purple-600', 'px-4', 'py-2', 'rounded-lg', 'text-sm', 'font-semibold', 'transition')}>
              View Details
            </button>
          </div>
        </div>

        <div className={clsx('bg-white/5', 'rounded-lg', 'p-6')}>
          <div className={clsx('flex', 'items-center', 'gap-3', 'mb-4')}>
            <div className={clsx('w-12', 'h-12', 'bg-linear-to-br', 'from-blue-500', 'to-cyan-500', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'text-2xl')}>
              💼
            </div>
            <div>
              <h3 className="font-bold">eBay Power Seller</h3>
              <p className={clsx('text-sm', 'text-gray-400')}>5 year history, 100% rating</p>
            </div>
          </div>
          <div className={clsx('flex', 'items-center', 'justify-between')}>
            <span className={clsx('text-2xl', 'font-bold', 'text-green-400')}>₦380,000</span>
            <button className={clsx('bg-purple-500', 'hover:bg-purple-600', 'px-4', 'py-2', 'rounded-lg', 'text-sm', 'font-semibold', 'transition')}>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EscrowView() {
  const [activeTab, setActiveTab] = useState<'my_purchases' | 'my_sales' | 'new_escrow'>('my_purchases');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'in_progress': return 'text-blue-400 bg-blue-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'disputed': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div>
      <div className={clsx('flex', 'items-center', 'gap-2', 'mb-6')}>
        <LuShield className={clsx('w-6', 'h-6', 'text-green-400')} />
        <h1 className={clsx('text-2xl', 'font-bold')}>Escrow Service</h1>
      </div>

      <div className={clsx('bg-linear-to-r', 'from-green-500/20', 'to-emerald-500/20', 'rounded-lg', 'p-6', 'mb-6')}>
        <h2 className={clsx('text-xl', 'font-bold', 'mb-2')}>🔒 Secure Transactions</h2>
        <p className={clsx('text-gray-300', 'mb-4')}>
          Our escrow service protects both buyers and sellers. Funds are held securely until both parties confirm the transaction is complete.
        </p>
        <div className={clsx('grid', 'grid-cols-3', 'gap-4', 'text-sm')}>
          <div className="text-center">
            <div className={clsx('text-2xl', 'mb-1')}>💰</div>
            <p className="font-semibold">Safe Payments</p>
          </div>
          <div className="text-center">
            <div className={clsx('text-2xl', 'mb-1')}>✅</div>
            <p className="font-semibold">Verified Transfer</p>
          </div>
          <div className="text-center">
            <div className={clsx('text-2xl', 'mb-1')}>🛡️</div>
            <p className="font-semibold">Dispute Resolution</p>
          </div>
        </div>
      </div>

      <div className={clsx('flex', 'gap-3', 'mb-6')}>
        <button
          onClick={() => setActiveTab('my_purchases')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'my_purchases' ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          My Purchases
        </button>
        <button
          onClick={() => setActiveTab('my_sales')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'my_sales' ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          My Sales
        </button>
        <button
          onClick={() => setActiveTab('new_escrow')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'new_escrow' ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          New Escrow
        </button>
      </div>

      {activeTab === 'new_escrow' ? (
        <div className={clsx('max-w-2xl', 'bg-white/5', 'rounded-lg', 'p-6')}>
          <h2 className={clsx('text-xl', 'font-bold', 'mb-4')}>Create New Escrow Transaction</h2>
          <div className="space-y-4">
            <div>
              <label className={clsx('block', 'text-sm', 'mb-2')}>Transaction Type</label>
              <select className={clsx('w-full', 'p-3', 'rounded-lg', 'bg-white/10', 'border', 'border-white/20', 'focus:border-green-500', 'focus:outline-none')}>
                <option value="">Select type</option>
                <option value="account">Account Purchase</option>
                <option value="service">Service Payment</option>
                <option value="digital">Digital Asset</option>
              </select>
            </div>

            <div>
              <label className={clsx('block', 'text-sm', 'mb-2')}>Item Description</label>
              <input
                type="text"
                placeholder="What are you buying/selling?"
                className={clsx('w-full', 'p-3', 'rounded-lg', 'bg-white/10', 'border', 'border-white/20', 'focus:border-green-500', 'focus:outline-none')}
              />
            </div>

            <div>
              <label className={clsx('block', 'text-sm', 'mb-2')}>Amount (₦)</label>
              <input
                type="number"
                placeholder="Enter amount"
                className={clsx('w-full', 'p-3', 'rounded-lg', 'bg-white/10', 'border', 'border-white/20', 'focus:border-green-500', 'focus:outline-none')}
                min="1000"
              />
            </div>

            <div>
              <label className={clsx('block', 'text-sm', 'mb-2')}>Other Party Email/Username</label>
              <input
                type="text"
                placeholder="Enter buyer/seller contact"
                className={clsx('w-full', 'p-3', 'rounded-lg', 'bg-white/10', 'border', 'border-white/20', 'focus:border-green-500', 'focus:outline-none')}
              />
            </div>

            <div>
              <label className={clsx('block', 'text-sm', 'mb-2')}>Terms & Conditions</label>
              <textarea
                placeholder="Describe the terms of this transaction..."
                rows={4}
                className={clsx('w-full', 'p-3', 'rounded-lg', 'bg-white/10', 'border', 'border-white/20', 'focus:border-green-500', 'focus:outline-none')}
              />
            </div>

            <button className={clsx('w-full', 'bg-green-500', 'hover:bg-green-600', 'py-3', 'rounded-lg', 'font-semibold', 'transition')}>
              Create Escrow Transaction
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {mockEscrowTransactions
            .filter(tx => activeTab === 'my_purchases' ? tx.buyer === 'You' : tx.seller === 'You')
            .map(transaction => (
              <div key={transaction.id} className={clsx('bg-white/5', 'rounded-lg', 'p-5')}>
                <div className={clsx('flex', 'items-start', 'justify-between', 'mb-3')}>
                  <div className="flex-1">
                    <div className={clsx('flex', 'items-center', 'gap-3', 'mb-2')}>
                      <h3 className="font-bold">{transaction.item}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className={clsx('text-sm', 'text-gray-400', 'space-y-1')}>
                      <p>Transaction ID: {transaction.id}</p>
                      <p>
                        {activeTab === 'my_purchases' ? 'Seller' : 'Buyer'}: {' '}
                        {activeTab === 'my_purchases' ? transaction.seller : transaction.buyer}
                      </p>
                      <p>{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={clsx('text-2xl', 'font-bold', 'text-green-400')}>₦{transaction.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className={clsx('flex', 'gap-3', 'pt-3', 'border-t', 'border-white/10')}>
                  {transaction.status === 'in_progress' && (
                    <>
                      <button className={clsx('flex-1', 'bg-green-500', 'hover:bg-green-600', 'py-2', 'rounded-lg', 'text-sm', 'font-semibold', 'transition')}>
                        Confirm Receipt
                      </button>
                      <button className={clsx('px-4', 'bg-red-500/20', 'hover:bg-red-500/30', 'text-red-400', 'py-2', 'rounded-lg', 'text-sm', 'font-semibold', 'transition')}>
                        Dispute
                      </button>
                    </>
                  )}
                  {transaction.status === 'pending' && (
                    <button className={clsx('flex-1', 'bg-blue-500', 'hover:bg-blue-600', 'py-2', 'rounded-lg', 'text-sm', 'font-semibold', 'transition')}>
                      View Details
                    </button>
                  )}
                  {transaction.status === 'completed' && (
                    <button className={clsx('flex-1', 'bg-white/10', 'hover:bg-white/20', 'py-2', 'rounded-lg', 'text-sm', 'font-semibold', 'transition')}>
                      View Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default function NeonAccessPage() {
  const [view, setView] = useState<NeonAccessView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as NeonAccessView;
      if (['social', 'marketplace', 'escrow'].includes(hash)) {
        return hash;
      }
    }
    return 'social';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NeonAccessView;
      if (['social', 'marketplace', 'escrow'].includes(hash)) {
        setView(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className={clsx('min-h-screen w-screen', 'bg-gray-900', 'text-white', 'p-6')}>
      <div className={clsx('max-w-7xl', 'mx-auto')}>
        {view === 'social' && <SocialServicesView />}
        {view === 'marketplace' && <MarketplaceView />}
        {view === 'escrow' && <EscrowView />}
      </div>
    </div>
  );
}