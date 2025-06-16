import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  bookletNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  serialNumber: {
    type: Number,
    required: true,
    unique: true
  },
  block: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  },
  floor: {
    type: Number,
    required: true,
    min: 1,
    max: 11
  },
  quarterNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMode: {
    type: String,
    required: true,
    enum: ['UPI', 'Cash', 'Bank Transfer']
  }
}, {
  timestamps: true,
  collection: 'Donation'
});

// Compound index to prevent duplicate block + floor + quarter combinations
donationSchema.index({ block: 1, floor: 1, quarterNumber: 1 }, { unique: true });

// Validate serial number based on booklet number
donationSchema.pre('save', function(next) {
  const booklet = this.bookletNumber;
  const serial = this.serialNumber;
  const minSerial = (booklet - 1) * 50 + 1;
  const maxSerial = booklet * 50;

  if (serial < minSerial || serial > maxSerial) {
    next(new Error(`Serial number must be between ${minSerial} and ${maxSerial} for booklet ${booklet}`));
  }
  next();
});

export default mongoose.models.Donation || mongoose.model('Donation', donationSchema); 