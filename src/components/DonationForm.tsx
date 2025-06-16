'use client';

import { useState, useEffect } from 'react';
import { DonationFormData, Block, PaymentMode } from '@/types';
import toast from 'react-hot-toast';

const BLOCKS: Block[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];
const PAYMENT_MODES: PaymentMode[] = ['Cash', 'UPI', 'Bank Transfer'];

export default function DonationForm() {
  const [formData, setFormData] = useState<DonationFormData>({
    bookletNumber: '',
    serialNumber: '',
    block: 'A',
    floor: 1,
    quarterNumber: 1,
    amount: 0,
    paymentMode: 'Cash',
  });

  const [availableSerials, setAvailableSerials] = useState<number[]>([]);

  useEffect(() => {
    if (formData.bookletNumber) {
      const booklet = Number(formData.bookletNumber);
      const minSerial = (booklet - 1) * 50 + 1;
      const maxSerial = booklet * 50;
      const serials = Array.from({ length: 50 }, (_, i) => minSerial + i);
      setAvailableSerials(serials);
      if (!serials.includes(Number(formData.serialNumber))) {
        setFormData(prev => ({ ...prev, serialNumber: '' }));
      }
    }
  }, [formData.bookletNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      toast.success('Donation saved successfully!');
      setFormData({
        bookletNumber: '',
        serialNumber: '',
        block: 'A',
        floor: 1,
        quarterNumber: 1,
        amount: 0,
        paymentMode: 'Cash',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save donation');
      console.error('Error saving donation:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'floor' || name === 'quarterNumber' || name === 'amount' ? Number(value) : value,
    }));
  };

  const getMaxFloor = (block: Block) => {
    return block === 'B' || block === 'C' ? 9 : 11;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Donation Entry</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="bookletNumber" className="block text-sm font-medium text-gray-300">
              Booklet Number
            </label>
            <select
              id="bookletNumber"
              name="bookletNumber"
              value={formData.bookletNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-0 text-white shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Booklet</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-300">
              Serial Number
            </label>
            <select
              id="serialNumber"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-0 text-white shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Serial Number</option>
              {availableSerials.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="block" className="block text-sm font-medium text-gray-300">
              Block
            </label>
            <select
              id="block"
              name="block"
              value={formData.block}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-0 text-white shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            >
              {BLOCKS.map((block) => (
                <option key={block} value={block}>
                  {block}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="floor" className="block text-sm font-medium text-gray-300">
              Floor
            </label>
            <select
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-0 text-white shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            >
              {Array.from({ length: getMaxFloor(formData.block) }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quarterNumber" className="block text-sm font-medium text-gray-300">
              Quarter Number
            </label>
            <select
              id="quarterNumber"
              name="quarterNumber"
              value={formData.quarterNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-0 text-white shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            >
              {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-0 text-white shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-300">
              Payment Mode
            </label>
            <select
              id="paymentMode"
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-0 text-white shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            >
              {PAYMENT_MODES.map((mode) => (
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
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
          >
            Save Donation
          </button>
        </div>
      </form>
    </div>
  );
} 