'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DonationContextType {
  totalAmount: number;
  refreshTotal: () => Promise<void>;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: ReactNode }) {
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchTotal = async () => {
    try {
      const response = await fetch('/api/donations/total');
      if (!response.ok) throw new Error('Failed to fetch total');
      const data = await response.json();
      setTotalAmount(data.total);
    } catch (error) {
      console.error('Error fetching total:', error);
    }
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  return (
    <DonationContext.Provider value={{ totalAmount, refreshTotal: fetchTotal }}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
} 