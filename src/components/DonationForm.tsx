'use client';

import { useState, useEffect } from 'react';
import { Donation, Block, PaymentMode } from '@/types';
import toast from 'react-hot-toast';

const BLOCKS: Block[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];
const PAYMENT_MODES: PaymentMode[] = ['Cash', 'UPI', 'Bank Transfer'];

export default function DonationForm() {
  const [formData, setFormData] = useState<Partial<Donation>>({
    bookletNumber: 1,
    serialNumber: 1,
    block: 'A',
    floor: 1,
    quarterNumber: 1,
    amount: 0,
    paymentMode: 'Cash'
  });

  const [availableSerials, setAvailableSerials] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Calculate available serial numbers based on booklet number
    const startSerial = (formData.bookletNumber! - 1) * 50 + 1;
    const endSerial = formData.bookletNumber! * 50;
    const serials = Array.from(
      { length: endSerial - startSerial + 1 },
      (_, i) => startSerial + i
    );
    setAvailableSerials(serials);

    // Only reset serial number if it's not in the available range
    if (formData.serialNumber && !serials.includes(formData.serialNumber)) {
      setFormData(prev => ({ ...prev, serialNumber: startSerial }));
    }
  }, [formData.bookletNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save donation');
      }

      toast.success('Donation saved successfully');
      setFormData({
        bookletNumber: 1,
        serialNumber: 1,
        block: 'A',
        floor: 1,
        quarterNumber: 1,
        amount: 0,
        paymentMode: 'Cash'
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save donation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-700">
            <h2 className="text-xl font-semibold text-white">Enter Donation Details</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bookletNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Booklet Number
                </label>
                <select
                  id="bookletNumber"
                  name="bookletNumber"
                  value={formData.bookletNumber}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Serial Number
                </label>
                <select
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  {availableSerials.map(serial => (
                    <option key={serial} value={serial}>
                      {serial}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="block" className="block text-sm font-medium text-gray-300 mb-2">
                  Block
                </label>
                <select
                  id="block"
                  name="block"
                  value={formData.block}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  {BLOCKS.map(block => (
                    <option key={block} value={block}>
                      {block}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="floor" className="block text-sm font-medium text-gray-300 mb-2">
                  Floor
                </label>
                <select
                  id="floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quarterNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Quarter Number
                </label>
                <select
                  id="quarterNumber"
                  name="quarterNumber"
                  value={formData.quarterNumber}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  {Array.from({ length: 6 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Mode
                </label>
                <select
                  id="paymentMode"
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  {PAYMENT_MODES.map(mode => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Saving...' : 'Save Donation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 