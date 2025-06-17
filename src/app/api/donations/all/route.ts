import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Donation } from '@/models/Donation';

export async function DELETE() {
  try {
    await connectToDatabase();
    const result = await Donation.deleteMany({});
    return NextResponse.json({ count: result.deletedCount });
  } catch (error) {
    console.error('Error deleting all donations:', error);
    return NextResponse.json(
      { error: 'Failed to delete all donations' },
      { status: 500 }
    );
  }
} 