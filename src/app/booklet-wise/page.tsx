'use client';

import { useState, useEffect } from 'react';
import { Donation, BookletDonations } from '@/types';

export default function BookletWise() {
  const [bookletDonations, setBookletDonations] = useState<BookletDonations[]>([]);
  const [selectedBooklet, setSelectedBooklet] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/donations');
      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }
      const data: Donation[] = await response.json();

      // Group donations by booklet number
      const groupedDonations: BookletDonations[] = Array.from({ length: 10 }, (_, i) => {
        const bookletNumber = i + 1;
        const startSerial = (bookletNumber - 1) * 50 + 1;
        // const endSerial = bookletNumber * 50;
        
        // Create array of 50 slots for each booklet
        const slots = Array(50).fill(null);
        
        // Fill in donations for this booklet
        data.forEach(donation => {
          if (donation.bookletNumber === bookletNumber) {
            const index = donation.serialNumber - startSerial;
            if (index >= 0 && index < 50) {
              slots[index] = donation;
            }
          }
        });

        // Calculate total amount for this booklet
        const totalAmount = slots.reduce((sum, donation) => 
          sum + (donation ? donation.amount : 0), 0
        );

        return {
          bookletNumber,
          donations: slots,
          totalAmount
        };
      });

      setBookletDonations(groupedDonations);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading donations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const selectedBookletData = bookletDonations.find(b => b.bookletNumber === selectedBooklet);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Booklet Wise Donations</h1>
        
        <div className="mb-6">
          <label htmlFor="booklet-select" className="block text-sm font-medium text-gray-300 mb-2">
            Select Booklet
          </label>
          <select
            id="booklet-select"
            value={selectedBooklet}
            onChange={(e) => setSelectedBooklet(Number(e.target.value))}
            className="block w-full max-w-xs rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {bookletDonations.map((booklet) => (
              <option key={booklet.bookletNumber} value={booklet.bookletNumber}>
                Booklet {booklet.bookletNumber}
              </option>
            ))}
          </select>
        </div>

        {selectedBookletData && (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-700">
              <h2 className="text-xl font-semibold text-white">
                Booklet {selectedBookletData.bookletNumber}
              </h2>
              <p className="text-gray-300">
                Total Amount: ₹{selectedBookletData.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedBookletData.donations.map((donation, index) => {
                  const serialNumber = (selectedBookletData.bookletNumber - 1) * 50 + index + 1;
                  return (
                    <div
                      key={serialNumber}
                      className={`p-4 rounded-lg ${
                        donation ? 'bg-gray-700' : 'bg-gray-800 border border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-300">
                            Serial {serialNumber}
                          </p>
                          {donation ? (
                            <>
                              <p className="text-sm text-gray-400">
                                Block {donation.block}, Floor {donation.floor}, Quarter {donation.quarterNumber}
                              </p>
                              <p className="text-sm text-gray-400">
                                Amount: ₹{donation.amount.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-400">
                                Payment: {donation.paymentMode}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">Empty</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 