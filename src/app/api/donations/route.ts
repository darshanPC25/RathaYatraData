import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Donation } from '@/models/Donation';
import { Donation as DonationType } from '@/types';

// Helper function to format error response
const errorResponse = (message: string, status: number = 500) => {
  return NextResponse.json({ error: message }, { status });
};

// Helper function to format success response
const successResponse = (data: any, status: number = 200) => {
  return NextResponse.json(data, { status });
};

export async function GET() {
  try {
    await connectToDatabase();
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    
    return successResponse(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return errorResponse('Failed to fetch donations');
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data: DonationType = await request.json();

    // Validate required fields
    const requiredFields = ['bookletNumber', 'serialNumber', 'block', 'floor', 'qtrNumber', 'amount', 'paymentMode'];
    const missingFields = requiredFields.filter(field => !data[field as keyof DonationType]);
    
    if (missingFields.length > 0) {
      return errorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    // Validate booklet number
    if (data.bookletNumber < 1 || data.bookletNumber > 10) {
      return errorResponse('Booklet number must be between 1 and 10', 400);
    }

    // Validate serial number range
    const expectedStartSerial = (data.bookletNumber - 1) * 50 + 1;
    const expectedEndSerial = data.bookletNumber * 50;

    if (data.serialNumber < expectedStartSerial || data.serialNumber > expectedEndSerial) {
      return errorResponse(
        `Serial number must be between ${expectedStartSerial} and ${expectedEndSerial} for booklet ${data.bookletNumber}`,
        400
      );
    }

    // Check for existing donation with same quarter
    const existingQuarter = await Donation.findOne({
      block: data.block,
      floor: data.floor,
      qtrNumber: data.qtrNumber
    }).lean();

    if (existingQuarter) {
      return errorResponse(
        `A donation already exists for Block ${data.block}, Floor ${data.floor}, Quarter ${data.qtrNumber}`,
        400
      );
    }

    // Check for existing donation with same serial
    const existingSerial = await Donation.findOne({
      bookletNumber: data.bookletNumber,
      serialNumber: data.serialNumber
    }).lean();

    if (existingSerial) {
      return errorResponse(
        `A donation already exists for Booklet ${data.bookletNumber}, Serial ${data.serialNumber}`,
        400
      );
    }

    // Create the donation
    const donation = await Donation.create(data);
    return successResponse(donation, 201);
  } catch (error: any) {
    console.error('Error creating donation:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const keyValue = error.keyValue;
      if (keyValue.block && keyValue.floor && keyValue.qtrNumber) {
        return errorResponse(
          `A donation already exists for Block ${keyValue.block}, Floor ${keyValue.floor}, Quarter ${keyValue.qtrNumber}`,
          400
        );
      }
      if (keyValue.bookletNumber && keyValue.serialNumber) {
        return errorResponse(
          `A donation already exists for Booklet ${keyValue.bookletNumber}, Serial ${keyValue.serialNumber}`,
          400
        );
      }
    }

    return errorResponse('Failed to create donation');
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serialNumber = searchParams.get('serialNumber');

    if (!serialNumber) {
      return errorResponse('Serial number is required', 400);
    }

    await connectToDatabase();
    const result = await Donation.deleteOne({ serialNumber: Number(serialNumber) });

    if (result.deletedCount === 0) {
      return errorResponse('Donation not found', 404);
    }

    return successResponse({ 
      message: 'Donation deleted successfully',
      deleted: true 
    });
  } catch (error) {
    console.error('Error deleting donation:', error);
    return errorResponse('Failed to delete donation');
  }
} 