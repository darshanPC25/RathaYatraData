'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DeleteEntries() {
  const [serialNumber, setSerialNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteAll, setShowDeleteAll] = useState(false);

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
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete donation');
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
    if (password !== 'admin123') {
      toast.error('Invalid password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/donations/all', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete all donations');
      }

      toast.success('All donations deleted successfully');
      setPassword('');
      setShowDeleteAll(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete all donations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-700">
            <h2 className="text-xl font-semibold text-white">Delete Entries</h2>
          </div>

          <div className="p-6 space-y-8">
            {/* Delete by Serial Number */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Delete by Serial Number</h3>
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
                    required
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Deleting...' : 'Delete Donation'}
                </button>
              </form>
            </div>

            {/* Delete All Entries */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Delete All Entries</h3>
              {!showDeleteAll ? (
                <button
                  onClick={() => setShowDeleteAll(true)}
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Show Delete All Option
                </button>
              ) : (
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
                      required
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Deleting...' : 'Delete All'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteAll(false);
                        setPassword('');
                      }}
                      className="inline-flex justify-center rounded-md border border-gray-600 bg-gray-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 