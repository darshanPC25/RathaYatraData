import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Donation } from '@/models/Donation';

const TOTAL_BOOKLETS = 20;

// Helper function to get serial number range for a booklet
const getSerialRange = (bookletNumber: number) => {
  const start = (bookletNumber - 1) * 50 + 1;
  const end = bookletNumber * 50;
  return { start, end };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookletNumber = Number(searchParams.get('bookletNumber'));

    if (!bookletNumber || bookletNumber < 1 || bookletNumber > TOTAL_BOOKLETS) {
      return NextResponse.json(
        { error: `Invalid booklet number. Must be between 1 and ${TOTAL_BOOKLETS}` },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get the valid range for this booklet
    const { start, end } = getSerialRange(bookletNumber);

    // Get used serial numbers for this booklet
    const usedSerials = await Donation.find({
      bookletNumber,
      serialNumber: { $gte: start, $lte: end }
    }).select('serialNumber');

    const usedSerialNumbers = usedSerials.map(d => d.serialNumber);
    
    // Generate all possible serial numbers for this booklet
    const allSerials = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );

    // Filter out used serial numbers
    const availableSerials = allSerials.filter(s => !usedSerialNumbers.includes(s));

    return NextResponse.json({ 
      availableSerials,
      range: { start, end },
      total: end - start + 1,
      available: availableSerials.length
    });
  } catch (error) {
    console.error('Error fetching available serials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available serials' },
      { status: 500 }
    );
  }
} 