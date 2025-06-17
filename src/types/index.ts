export type Block = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'J' | 'K' | 'L';
export type PaymentMode = 'CASH' | 'UPI';

export interface Donation {
  bookletNumber: number;
  serialNumber: number;
  block: Block;
  floor: number;
  qtrNumber: number;
  amount: number;
  paymentMode: PaymentMode;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DonationFormData {
  bookletNumber: string | number;
  serialNumber: string | number;
  block: Block;
  floor: number;
  qtrNumber: number;
  amount: number;
  paymentMode: PaymentMode;
}

export interface BookletDonations {
  bookletNumber: number;
  donations: (Donation | null)[];
  totalAmount: number;
}

export interface BlockDonations {
  block: Block;
  floors: {
    [key: number]: {
      [key: number]: Donation | null;
    };
  };
}

export interface BookletSummary {
  bookletNumber: number;
  totalAmount: number;
  entries: Donation[];
}

export interface BlockSummary {
  block: string;
  entries: Donation[];
} 