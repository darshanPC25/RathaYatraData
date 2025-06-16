'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DeleteEntries() {
  const [serialNumber, setSerialNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteBySerial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialNumber) {
      toast.error('Please enter a serial number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/donations?serialNumber=${serialNumber}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete donation');
      }

      toast.success('Donation deleted successfully');
      setSerialNumber('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete donation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error('Please enter the password');
      return;
    }

    if (password !== 'admin123') {
      toast.error('Invalid password');
      return;
    }

    if (!window.confirm('Are you sure you want to delete all donations? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/donations?password=${password}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete all donations');
      }

      const result = await response.json();
      toast.success(`Successfully deleted ${result.count} donations`);
      setPassword('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete all donations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Delete Entries</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delete by Serial Number */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Delete by Serial Number
            </h2>
            <form onSubmit={handleDeleteBySerial} className="space-y-4">
              <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-300">
                  Serial Number
                </label>
                <input
                  type="number"
                  id="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-0 text-white shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter serial number"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete Donation'}
              </button>
            </form>
          </div>

          {/* Delete All Entries */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Delete All Entries
            </h2>
            <form onSubmit={handleDeleteAll} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-0 text-white shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter admin password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete All Entries'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 