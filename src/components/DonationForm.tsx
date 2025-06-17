'use client';

import { useState, useEffect } from 'react';
import { Donation, Block } from '@/types';
import toast from 'react-hot-toast';
import { useDonation } from '@/context/DonationContext';
// import { useRouter } from 'next/navigation';

const BLOCKS: Block[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];
const PAYMENT_MODES = ['CASH','UPI'] as const;
const TOTAL_BOOKLETS = 20;

// Helper function to get serial number range for a booklet
const getSerialRange = (bookletNumber: number) => {
  const start = (bookletNumber - 1) * 50 + 1;
  const end = bookletNumber * 50;
  return { start, end };
};

export default function DonationForm() {
  const { refreshTotal } = useDonation();
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [availableSerials, setAvailableSerials] = useState<number[]>([]);
  const [serialRange, setSerialRange] = useState({ start: 1, end: 50 });
  const [formData, setFormData] = useState<Partial<Donation>>({
    bookletNumber: 1,
    serialNumber: 1,
    block: 'A',
    floor: 1,
    qtrNumber: 1,
    amount: 0,
    paymentMode: 'CASH'
  });

  // Fetch available serial numbers when booklet number changes
  useEffect(() => {
    const fetchAvailableSerials = async () => {
      try {
        const response = await fetch(`/api/donations/available-serials?bookletNumber=${formData.bookletNumber}`);
        if (!response.ok) throw new Error('Failed to fetch available serials');
        const data = await response.json();
        
        setAvailableSerials(data.availableSerials);
        setSerialRange(data.range);
        
        // Reset serial number if current selection is not in available range
        if (formData.serialNumber && !data.availableSerials.includes(formData.serialNumber)) {
          setFormData(prev => ({
            ...prev,
            serialNumber: data.availableSerials[0] || data.range.start
          }));
        }
      } catch (error) {
        console.error('Error fetching available serials:', error);
        toast.error('Failed to fetch available serial numbers');
      }
    };

    if (formData.bookletNumber) {
      fetchAvailableSerials();
    }
  }, [formData.bookletNumber, formData.serialNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate serial number range
    const { start, end } = getSerialRange(formData.bookletNumber!);
    if (formData.serialNumber! < start || formData.serialNumber! > end) {
      toast.error(`Serial number must be between ${start} and ${end} for booklet ${formData.bookletNumber}`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create donation');
      }

      toast.success('Donation created successfully!');
      setFormData({
        bookletNumber: 1,
        serialNumber: 1,
        block: 'A',
        floor: 1,
        qtrNumber: 1,
        amount: 0,
        paymentMode: 'CASH'
      });
      await refreshTotal();
      window.location.reload(); // Full page refresh after donation
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  // Calculate max floor based on block
  const getMaxFloor = (block: Block) => {
    return block === 'B' || block === 'C' ? 9 : 11;
  };

  // const resetForm = () => {
  //   setFormData({
  //     bookletNumber: 1,
  //     serialNumber: 1,
  //     block: 'A',
  //     floor: 1,
  //     qtrNumber: 1,
  //     amount: 0,
  //     paymentMode: 'CASH'
  //   });
  // };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white">Enter Donation Details</h2>
            <p className="mt-1 text-indigo-100">Fill in the details below to record a new donation</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Booklet and Serial Section */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Booklet Information</h3>
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
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {Array.from({ length: TOTAL_BOOKLETS }, (_, i) => {
                      const { start, end } = getSerialRange(i + 1);
                      return (
                        <option key={i + 1} value={i + 1}>
                          Booklet {i + 1} ({start}-{end})
                        </option>
                      );
                    })}
                    {/* <option value="21">+ Add New Booklet</option> */}
                  </select>
                </div>

                <div>
                  <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-300">
                    Serial Number ({serialRange.start}-{serialRange.end})
                  </label>
                  <select
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {availableSerials.map(serial => (
                      <option key={serial} value={serial}>
                        Serial {serial}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-400">
                    Available serials: {availableSerials.length} of {serialRange.end - serialRange.start + 1}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Location Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {BLOCKS.map((block) => (
                      <option key={block} value={block}>
                        Block {block}
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
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {Array.from({ length: getMaxFloor(formData.block as Block) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Floor {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="qtrNumber" className="block text-sm font-medium text-gray-300">
                    Quarter Number
                  </label>
                  <select
                    id="qtrNumber"
                    name="qtrNumber"
                    value={formData.qtrNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        Quarter {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
                    Amount (₹)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      min="0"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      className="block w-full pl-7 rounded-md border-gray-600 bg-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
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
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {PAYMENT_MODES.map(mode => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-6 text-base font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Donation'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 