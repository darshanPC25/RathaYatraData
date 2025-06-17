import mongoose, { Document } from 'mongoose';
import { Donation as DonationType} from '@/types';

// Extend the DonationType with Document properties
interface DonationDocument extends DonationType, Document {}

const donationSchema = new mongoose.Schema<DonationDocument>({
  bookletNumber: {
    type: Number,
    required: [true, 'Booklet number is required'],
    min: [1, 'Booklet number must be at least 1'],
    max: [10, 'Booklet number cannot exceed 10'],
    index: true
  },
  serialNumber: {
    type: Number,
    required: [true, 'Serial number is required'],
    min: [1, 'Serial number must be at least 1'],
    max: [500, 'Serial number cannot exceed 500'],
    index: true
  },
  block: {
    type: String,
    required: [true, 'Block is required'],
    enum: {
      values: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'],
      message: '{VALUE} is not a valid block'
    },
    index: true
  },
  floor: {
    type: Number,
    required: [true, 'Floor is required'],
    min: [1, 'Floor must be at least 1'],
    max: [11, 'Floor cannot exceed 11'],
    index: true
  },
  qtrNumber: {
    type: Number,
    required: [true, 'Quarter number is required'],
    min: [1, 'Quarter number must be at least 1'],
    max: [6, 'Quarter number cannot exceed 6'],
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
    validate: {
      validator: function(v: number) {
        return v > 0;
      },
      message: 'Amount must be greater than 0'
    }
  },
  paymentMode: {
    type: String,
    required: [true, 'Payment mode is required'],
    enum: {
      values: ['CASH', 'UPI'],
      message: '{VALUE} is not a valid payment mode'
    }
  }
}, {
  timestamps: true,
  collection: 'donations'
});

// Compound indexes for common queries
donationSchema.index({ block: 1, floor: 1, qtrNumber: 1 }, { 
  unique: true,
  background: true,
  name: 'unique_quarter'
});

donationSchema.index({ bookletNumber: 1, serialNumber: 1 }, { 
  unique: true,
  background: true,
  name: 'unique_serial'
});

// Index for sorting and filtering
donationSchema.index({ createdAt: -1 }, { background: true });

// Validate serial number based on booklet number
donationSchema.pre('save', function(this: DonationDocument, next) {
  const booklet = this.bookletNumber;
  const serial = this.serialNumber;
  const minSerial = (booklet - 1) * 50 + 1;
  const maxSerial = booklet * 50;

  if (serial < minSerial || serial > maxSerial) {
    next(new Error(`Serial number must be between ${minSerial} and ${maxSerial} for booklet ${booklet}`));
  }
  next();
});

// Check if model exists before creating a new one
export const Donation = mongoose.models.Donation || mongoose.model<DonationDocument>('Donation', donationSchema); 