import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donation from '@/models/Donation';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['bookletNumber', 'serialNumber', 'block', 'floor', 'quarterNumber', 'amount', 'paymentMode'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check for duplicate serial number
    const existingSerial = await Donation.findOne({ serialNumber: body.serialNumber });
    if (existingSerial) {
      return NextResponse.json(
        { message: 'Serial number already exists' },
        { status: 400 }
      );
    }

    // Check for duplicate block + floor + quarter combination
    const existingLocation = await Donation.findOne({
      block: body.block,
      floor: body.floor,
      quarterNumber: body.quarterNumber,
    });
    if (existingLocation) {
      return NextResponse.json(
        { message: 'This location already has a donation' },
        { status: 400 }
      );
    }

    const donation = await Donation.create(body);
    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { message: 'Error creating donation. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const donations = await Donation.find().sort({ createdAt: -1 });
    return NextResponse.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { message: 'Error fetching donations. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const serialNumber = searchParams.get('serialNumber');
    const password = searchParams.get('password');

    if (serialNumber) {
      // Delete single donation
      const result = await Donation.deleteOne({ serialNumber: Number(serialNumber) });
      if (result.deletedCount === 0) {
        return NextResponse.json(
          { message: 'Donation not found with the provided serial number' },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: 'Donation deleted successfully' });
    } 
    
    if (password) {
      // Delete all donations
      if (password !== 'admin123') {
        return NextResponse.json(
          { message: 'Invalid password' },
          { status: 401 }
        );
      }
      const result = await Donation.deleteMany({});
      return NextResponse.json({ 
        message: 'All donations deleted successfully',
        count: result.deletedCount 
      });
    }

    return NextResponse.json(
      { message: 'Either serial number or password is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error deleting donation(s):', error);
    return NextResponse.json(
      { message: 'Error deleting donation(s). Please try again.' },
      { status: 500 }
    );
  }
} 