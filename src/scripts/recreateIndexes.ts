import { connectToDatabase } from '@/lib/mongodb';
import { Donation } from '@/models/Donation';

async function recreateIndexes() {
  try {
    await connectToDatabase();
    
    // Drop all indexes
    await Donation.collection.dropIndexes();
    console.log('Dropped all indexes');
    
    // Create new indexes
    await Donation.createIndexes();
    console.log('Created new indexes');
    
    process.exit(0);
  } catch (error) {
    console.error('Error recreating indexes:', error);
    process.exit(1);
  }
}

recreateIndexes(); 