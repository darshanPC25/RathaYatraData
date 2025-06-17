'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDonation } from '@/context/DonationContext';

export default function Navbar() {
  const pathname = usePathname();
  const { totalAmount, refreshTotal } = useDonation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isTotalOpen, setIsTotalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshTotal();
    } finally {
      setIsRefreshing(false);
    }
  };

  const menuItems = [
    { name: 'Enter Donation', path: '/' },
    { name: 'Booklet Wise', path: '/booklet-wise' },
    { name: 'Block Wise', path: '/block-wise' },
    { name: 'Delete Entries', path: '/delete-entries' },
  ];

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">Donation System</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Navigation Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="text-sm font-medium">Menu</span>
                <svg
                  className={`h-5 w-5 transition-transform ${isNavOpen ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isNavOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`${
                        pathname === item.path
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      } block px-4 py-2 text-sm`}
                      onClick={() => setIsNavOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Total Amount Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTotalOpen(!isTotalOpen)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="text-sm font-medium">Total: </span>
                <span className="text-lg font-bold">{formatAmount(totalAmount)}</span>
                <svg
                  className={`h-5 w-5 transition-transform ${isTotalOpen ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isTotalOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Donation Summary</h3>
                    <button
                      onClick={handleRefresh}
                      className={`p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isRefreshing ? 'animate-spin' : ''
                      }`}
                      title="Refresh total"
                    >
                      <svg
                        className="h-5 w-5 text-gray-500 hover:text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Donations:</span>
                      <span className="text-lg font-bold text-indigo-600">{formatAmount(totalAmount)}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-gray-50 rounded-b-md">
                    <div className="text-xs text-gray-500">
                      This amount represents the sum of all donations in the system.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 