export type Block = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
export type PaymentMode = 'UPI' | 'Cash' | 'Bank Transfer';

export interface Donation {
  bookletNumber: number;
  serialNumber: number;
  block: Block;
  floor: number;
  quarterNumber: number;
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
  quarterNumber: number;
  amount: number;
  paymentMode: PaymentMode;
}

export interface BookletDonations {
  bookletNumber: number;
  totalAmount: number;
  donations: (Donation | null)[];
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