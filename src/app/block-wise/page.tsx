'use client';

import { useState, useEffect } from 'react';
import { Donation, Block, BlockDonations } from '@/types';
import toast from 'react-hot-toast';

const BLOCKS: Block[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];

export default function BlockWise() {
  const [blockDonations, setBlockDonations] = useState<BlockDonations[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block>('A');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
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

      // Group donations by block
      const groupedDonations: BlockDonations[] = BLOCKS.map(block => ({
        block,
        floors: Array.from({ length: 11 }, (_, i) => ({
          floor: i + 1,
          quarters: Array.from({ length: 6 }, (_, j) => ({
            quarterNumber: j + 1,
            donation: null
          }))
        }))
      }));

      // Fill in the donations
      data.forEach(donation => {
        const blockIndex = BLOCKS.indexOf(donation.block);
        if (blockIndex !== -1) {
          const floorIndex = donation.floor - 1;
          const quarterIndex = donation.quarterNumber - 1;
          groupedDonations[blockIndex].floors[floorIndex].quarters[quarterIndex].donation = donation;
        }
      });

      setBlockDonations(groupedDonations);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to fetch donations');
    } finally {
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

  const selectedBlockData = blockDonations.find(b => b.block === selectedBlock);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Block Wise Donations</h1>

        <div className="mb-6">
          <label htmlFor="block-select" className="block text-sm font-medium text-gray-300 mb-2">
            Select Block
          </label>
          <select
            id="block-select"
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value as Block)}
            className="block w-full max-w-xs rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {BLOCKS.map((block) => (
              <option key={block} value={block}>
                Block {block}
              </option>
            ))}
          </select>
        </div>

        {selectedBlockData && (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-700">
              <h2 className="text-xl font-semibold text-white">Block {selectedBlockData.block}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {selectedBlockData.floors.map((floorData) => (
                  <div key={floorData.floor} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Floor {floorData.floor}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {floorData.quarters.map((quarter) => (
                        <button
                          key={quarter.quarterNumber}
                          onClick={() => quarter.donation && setSelectedDonation(quarter.donation)}
                          className={`p-4 rounded-lg text-left transition-colors ${
                            quarter.donation
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-gray-600 hover:bg-gray-500'
                          }`}
                        >
                          <div className="text-sm font-medium text-white">
                            Quarter {quarter.quarterNumber}
                          </div>
                          {quarter.donation && (
                            <div className="mt-2 text-sm text-white">
                              <div>Amount: ₹{quarter.donation.amount.toLocaleString()}</div>
                              <div>Payment: {quarter.donation.paymentMode}</div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Donation Details Modal */}
        {selectedDonation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 bg-gray-700 rounded-t-lg">
                <h3 className="text-lg font-semibold text-white">Donation Details</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-300">Booklet Number</p>
                  <p className="text-white">{selectedDonation.bookletNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Serial Number</p>
                  <p className="text-white">{selectedDonation.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Location</p>
                  <p className="text-white">
                    Block {selectedDonation.block}, Floor {selectedDonation.floor}, Quarter {selectedDonation.quarterNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Amount</p>
                  <p className="text-white">₹{selectedDonation.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Payment Mode</p>
                  <p className="text-white">{selectedDonation.paymentMode}</p>
                </div>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="w-full mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 