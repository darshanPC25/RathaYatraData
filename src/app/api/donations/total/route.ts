import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Donation } from '@/models/Donation';

export async function GET() {
  try {
    await connectToDatabase();
    const result = await Donation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const total = result[0]?.total || 0;
    return NextResponse.json({ total });
  } catch (error) {
    console.error('Error fetching total:', error);
    return NextResponse.json(
      { error: 'Failed to fetch total' },
      { status: 500 }
    );
  }
} 