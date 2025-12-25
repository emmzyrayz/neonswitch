'use client'
import { useState } from 'react';
import clsx from 'clsx';
import { 
  FaCoins, 
  FaKey, 
  FaPhone, 
  FaTiktok, 
  FaUser, 
  FaWallet,
  FaFileInvoiceDollar,
  FaUsers,
  FaCode,
} from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';
import { IconType } from 'react-icons';
import Link from 'next/link';

// Type Definitions
interface PersonalDetails {
  name: string;
  phone: string;
  coinBalance: number;
  tokenBalance: number;
}

interface PlatformDetail {
  icon: IconType;
  label: string;
  value: string;
}

interface Transaction {
  id: number;
  category: string;
  description: string;
  time: string;
  date: string;
  amount: number;
  currency: string;
}

interface Shortcut {
  id: number;
  icon: IconType;
  label: string;
  description: string;
  color: string;
  url: string;
}

interface UserData {
  personal: PersonalDetails;
  platform: PlatformDetail[];
  transactions: Transaction[];
  shortcuts: Shortcut[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface TransactionCardProps {
  transaction: Transaction;
  onClick: () => void;
}

// Mock data - replace with actual API calls
const userData: UserData = {
  personal: {
    name: "Nnamdi Emmanuel Dike",
    phone: "+234 8141311661",
    coinBalance: 25000.00,
    tokenBalance: 300
  },
  platform: [
    { icon: FaPhone, label: "Virtual Number", value: "+1-237757387998" },
    { icon: FaTiktok, label: "TikTok", value: "@sapademic_tech" }
  ],
  transactions: [
    {
      id: 1,
      category: "VTU Services",
      description: "Bought MTN airtime",
      time: "12:34PM",
      date: "16/05/25",
      amount: 5,
      currency: "£"
    },
    {
      id: 2,
      category: "VTU Services",
      description: "Bought power token from ABAPOWER",
      time: "08:12AM",
      date: "05/11/25",
      amount: 500,
      currency: "£"
    },
    {
      id: 3,
      category: "Virtual Number Service",
      description: "Subscribed to an US Number (+1 123456***)",
      time: "03:34PM",
      date: "11/05/25",
      amount: 50,
      currency: "£"
    }
  ],
  shortcuts: [
    { 
      id: 1, 
      icon: FaPhone, 
      label: "Virtual Number", 
      description: "Make/receive calls & messages",
      color: "bg-blue-500/20 hover:bg-blue-500/30",
      url: '/dashboard/virtual_number'
    },
    { 
      id: 2, 
      icon: FaFileInvoiceDollar, 
      label: "Bills", 
      description: "Pay utility bills",
      color: "bg-purple-500/20 hover:bg-purple-500/30",
      url: '/dashboard/neonpay#bills'
    },
    { 
      id: 3, 
      icon: FaWallet, 
      label: "Airtime/Data", 
      description: "Buy airtime & data",
      color: "bg-green-500/20 hover:bg-green-500/30",
      url: '/dashboard/neonpay#vtu'
    },
    { 
      id: 4, 
      icon: FaUsers, 
      label: "Neon Access", 
      description: "Manage social profiles",
      color: "bg-pink-500/20 hover:bg-pink-500/30",
      url: '/dashboard/neonaccess'
    },
    { 
      id: 5, 
      icon: FaCode, 
      label: "API", 
      description: "Developer access",
      color: "bg-orange-500/20 hover:bg-orange-500/30",
      url: '/dashboard/api'
    },
    { 
      id: 6, 
      icon: FaWallet, 
      label: "NeonPay", 
      description: "Developer access",
      color: "bg-orange-500/20 hover:bg-orange-500/30",
      url: '/dashboard/neonpay#wallet'
    }
  ]
};

// Modal Component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className={clsx('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'p-4', 'bg-black/60', 'backdrop-blur-sm')}
      onClick={onClose}
    >
      <div 
        className={clsx('relative', 'w-full', 'max-w-2xl', 'max-h-[80vh]', 'bg-gray-900', 'rounded-2xl', 'shadow-2xl', 'overflow-hidden')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={clsx('sticky', 'top-0', 'z-10', 'flex', 'items-center', 'justify-between', 'p-4', 'bg-gray-800/90', 'backdrop-blur-sm', 'border-b', 'border-white/10')}>
          <h2 className={clsx('text-lg', 'font-semibold', 'text-white')}>{title}</h2>
          <button
            onClick={onClose}
            className={clsx('p-2', 'hover:bg-white/10', 'rounded-lg', 'transition-colors')}
          >
            <FaTimes className="text-white" />
          </button>
        </div>
        <div className={clsx('p-4', 'overflow-y-auto', 'max-h-[calc(80vh-80px)]')}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Transaction Card Component
const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onClick }) => (
  <div 
    className={clsx(
      'cursor-pointer flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-2',
      'bg-white/10 hover:bg-white/15 transition-colors',
      'p-3 rounded-lg'
    )}
    onClick={onClick}
  >
    <div className="flex-1">
      <div className={clsx('font-medium', 'text-white')}>{transaction.category}</div>
      <div className={clsx('text-[11px]', 'text-gray-400', 'mt-1')}>{transaction.description}</div>
    </div>
    <div className={clsx('flex', 'flex-row', 'sm:flex-col', 'items-end', 'gap-2', 'sm:gap-1')}>
      <div className={clsx('flex', 'flex-row', 'gap-1', 'text-[12px]', 'text-gray-400')}>
        <span>{transaction.time}</span>
        <span>{transaction.date}</span>
      </div>
      <div className={clsx('flex', 'flex-row', 'gap-1', 'text-green-400', 'font-bold')}>
        <span>{transaction.currency}</span>
        <span>{transaction.amount}</span>
      </div>
    </div>
  </div>
);

export const UserContent: React.FC = () => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleTransactionClick = (transaction: Transaction): void => {
    setSelectedTransaction(transaction);
    setIsHistoryModalOpen(true);
  };

  return (
    <>
      <div className={clsx(
        'flex flex-col gap-5 relative',
        'w-full p-4 sm:p-5 my-5',
        'bg-white/10 rounded-2xl',
        'text-gray-300 text-[14px]',
        'font-sora'
      )}>
        {/* Personal Details Section */}
        <div className={clsx(
          'personal-details',
          'flex flex-col sm:flex-row w-full gap-4',
          'items-start sm:items-center justify-between'
        )}>
          <div className={clsx('flex', 'flex-col', 'gap-2', 'flex-1')}>
            <div className={clsx('flex', 'flex-row', 'gap-2', 'items-center', 'text-white', 'font-medium')}>
              <FaUser className="text-blue-400" />
              <span>{userData.personal.name}</span>
            </div>
            <div className={clsx('flex', 'flex-row', 'gap-2', 'items-center', 'text-gray-400')}>
              <FaPhone className="text-green-400" />
              <span>{userData.personal.phone}</span>
            </div>
          </div>
          <div className={clsx('flex', 'flex-row', 'sm:flex-col', 'gap-4', 'sm:gap-2')}>
            <div className={clsx('flex', 'flex-row', 'gap-2', 'items-center', 'bg-amber-500/20', 'px-3', 'py-2', 'rounded-lg')}>
              <FaCoins className="text-amber-400" />
              <span className={clsx('font-bold', 'text-white')}>{userData.personal.coinBalance.toLocaleString()}</span>
            </div>
            <div className={clsx('flex', 'flex-row', 'gap-2', 'items-center', 'bg-purple-500/20', 'px-3', 'py-2', 'rounded-lg')}>
              <FaKey className="text-purple-400" />
              <span className={clsx('font-bold', 'text-white')}>{userData.personal.tokenBalance}</span>
            </div>
          </div>
        </div>

        {/* Platform Details Section */}
        <div className={clsx(
          'platform-detail',
          'flex flex-wrap w-full gap-3',
          'p-3 bg-white/5 rounded-lg'
        )}>
          {userData.platform.map((item: PlatformDetail, index: number) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className={clsx('flex', 'flex-row', 'gap-2', 'items-center', 'px-3', 'py-2', 'bg-white/10', 'rounded-lg')}
              >
                <Icon className="text-cyan-400" />
                <div className={clsx('flex', 'flex-col')}>
                  <span className={clsx('text-[10px]', 'text-gray-500')}>{item.label}</span>
                  <span className={clsx('text-white', 'font-medium')}>{item.value}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transaction History Section */}
        <div className={clsx(
          'history bg-white/5 p-3 rounded-lg gap-2',
          'flex flex-col overflow-hidden'
        )}>
          <div 
            className={clsx(
              'cursor-pointer flex flex-row w-full items-center justify-between',
              'bg-white/10 hover:bg-white/15 transition-colors',
              'p-3 rounded-lg'
            )}
            onClick={() => setIsHistoryModalOpen(true)}
          >
            <span className={clsx('font-semibold', 'text-white')}>Transaction History</span>
            <span className={clsx('text-blue-400', 'text-[12px]', 'hover:underline')}>View All...</span>
          </div>
          
          {userData.transactions.slice(0, 3).map((transaction: Transaction) => (
            <TransactionCard 
              key={transaction.id}
              transaction={transaction}
              onClick={() => handleTransactionClick(transaction)}
            />
          ))}
        </div>

        {/* Shortcut Buttons Section */}
        <div className={clsx(
          'shortcut-btns',
          'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'
        )}>
          {userData.shortcuts.map((shortcut: Shortcut) => {
            const Icon = shortcut.icon;
            return (
              <Link
              href={shortcut.url}
                key={shortcut.id}
                className={clsx(
                  'flex flex-col items-center justify-center gap-2',
                  'p-4 rounded-xl transition-all',
                  'border border-white/10 hover:border-white/20',
                  shortcut.color
                )}
              >
                <Icon className={clsx('text-2xl', 'text-white')} />
                <div className="text-center">
                  <div className={clsx('text-[12px]', 'font-semibold', 'text-white')}>{shortcut.label}</div>
                  <div className={clsx('text-[10px]', 'text-gray-400', 'mt-1')}>{shortcut.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Transaction History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedTransaction(null);
        }}
        title={selectedTransaction ? "Transaction Details" : "All Transactions"}
      >
        {selectedTransaction ? (
          <div className={clsx('space-y-4', 'text-gray-300')}>
            <div className={clsx('p-4', 'bg-white/5', 'rounded-lg', 'space-y-3')}>
              <div>
                <span className={clsx('text-gray-500', 'text-sm')}>Category</span>
                <p className={clsx('text-white', 'font-medium')}>{selectedTransaction.category}</p>
              </div>
              <div>
                <span className={clsx('text-gray-500', 'text-sm')}>Description</span>
                <p className="text-white">{selectedTransaction.description}</p>
              </div>
              <div className={clsx('flex', 'justify-between', 'items-center', 'pt-2', 'border-t', 'border-white/10')}>
                <div>
                  <span className={clsx('text-gray-500', 'text-sm')}>Date & Time</span>
                  <p className="text-white">{selectedTransaction.date} at {selectedTransaction.time}</p>
                </div>
                <div className="text-right">
                  <span className={clsx('text-gray-500', 'text-sm')}>Amount</span>
                  <p className={clsx('text-green-400', 'font-bold', 'text-xl')}>
                    {selectedTransaction.currency}{selectedTransaction.amount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {userData.transactions.map((transaction: Transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onClick={() => setSelectedTransaction(transaction)}
              />
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};