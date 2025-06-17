'use client';

import { useState, useEffect } from 'react';
import { Donation } from '@/types';
import { Block } from '@/types';
import toast from 'react-hot-toast';

interface Quarter {
  qtrNumber: number;
  donation: DonationWithId | null;
}

interface Floor {
  floorNumber: number;
  quarters: Quarter[];
}

interface BlockDonation {
  block: Block;
  floors: Floor[];
}

interface DonationWithId extends Donation {
  _id: string;
}

export default function BlockWise() {
  const [blockDonations, setBlockDonations] = useState<BlockDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<DonationWithId | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('/api/donations');
        if (!response.ok) {
          throw new Error('Failed to fetch donations');
        }
        const donations: DonationWithId[] = await response.json();

        // Group donations by block, floor, and quarter
        const blockMap = new Map<Block, BlockDonation>();
        
        // Initialize blocks
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'].forEach(block => {
          const maxFloors = block === 'B' || block === 'C' ? 9 : 11;
          const floors: Floor[] = Array.from({ length: maxFloors }, (_, i) => ({
            floorNumber: i + 1,
            quarters: Array.from({ length: 6 }, (_, j) => ({
              qtrNumber: j + 1,
              donation: null
            }))
          }));
          
          blockMap.set(block as Block, {
            block: block as Block,
            floors
          });
        });

        // Fill in donations
        donations.forEach(donation => {
          const blockData = blockMap.get(donation.block);
          if (blockData) {
            const floor = blockData.floors.find(f => f.floorNumber === donation.floor);
            if (floor) {
              const quarter = floor.quarters.find(q => q.qtrNumber === donation.qtrNumber);
              if (quarter) {
                quarter.donation = donation;
              }
            }
          }
        });

        setBlockDonations(Array.from(blockMap.values()));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to fetch donations');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const selectedBlockData = selectedBlock 
    ? blockDonations.find(b => b.block === selectedBlock)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Block-wise Donations</h1>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-6 h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Block-wise Donations</h1>
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Block-wise Donations</h1>
        
        {/* Block Selection */}
        <div className="mb-8">
          <label htmlFor="block" className="block text-sm font-medium text-gray-300 mb-2">
            Select Block
          </label>
          <select
            id="block"
            value={selectedBlock || ''}
            onChange={(e) => setSelectedBlock(e.target.value as Block)}
            className="block w-full max-w-xs rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a block</option>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'].map((block) => (
              <option key={block} value={block}>
                Block {block}
              </option>
            ))}
          </select>
        </div>

        {/* Block Details */}
        {selectedBlockData && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Block {selectedBlockData.block}</h2>
            <div className="space-y-6">
              {selectedBlockData.floors.map((floorData) => (
                <div key={floorData.floorNumber} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Floor {floorData.floorNumber}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {floorData.quarters.map((quarter) => (
                      <button
                        key={quarter.qtrNumber}
                        onClick={() => quarter.donation && setSelectedDonation(quarter.donation)}
                        className={`p-4 rounded-lg text-left transition-colors ${
                          quarter.donation
                            ? 'bg-green-900/50 hover:bg-green-900/70'
                            : 'bg-gray-600/50 hover:bg-gray-600/70'
                        }`}
                      >
                        <div className="text-sm font-medium text-white">
                          Quarter {quarter.qtrNumber}
                        </div>
                        {quarter.donation && (
                          <div className="text-xs text-gray-300 mt-1">
                            <div>Booklet: {quarter.donation.bookletNumber}</div>
                            <div>Serial: {quarter.donation.serialNumber}</div>
                            <div>Amount: ₹{quarter.donation.amount}</div>
                            <div>Mode: {quarter.donation.paymentMode}</div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donation Details Modal */}
        {selectedDonation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">Donation Details</h3>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-300">Location</p>
                  <p className="text-white">
                    Block {selectedDonation.block}, Floor {selectedDonation.floor}, Quarter {selectedDonation.qtrNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Booklet Details</p>
                  <p className="text-white">
                    Booklet {selectedDonation.bookletNumber}, Serial {selectedDonation.serialNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Amount</p>
                  <p className="text-white">₹{selectedDonation.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Payment Mode</p>
                  <p className="text-white">{selectedDonation.paymentMode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Date</p>
                  <p className="text-white">
                    {new Date(selectedDonation.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 