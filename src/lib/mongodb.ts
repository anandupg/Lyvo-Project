import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db('lyvo-plus');
}

export async function createUserInMongo(userData: {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  email_confirmed_at?: string;
  created_at: string;
  updated_at: string;
}) {
  try {
    const db = await getDb();
    const collection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await collection.findOne({ id: userData.id });
    
    if (existingUser) {
      // Update existing user
      await collection.updateOne(
        { id: userData.id },
        { 
          $set: {
            ...userData,
            updated_at: new Date().toISOString()
          }
        }
      );
    } else {
      // Create new user
      await collection.insertOne({
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating/updating user in MongoDB:', error);
    return { success: false, error };
  }
}

export async function getUserFromMongo(userId: string) {
  try {
    const db = await getDb();
    const collection = db.collection('users');
    
    const user = await collection.findOne({ id: userId });
    return { success: true, user };
  } catch (error) {
    console.error('Error getting user from MongoDB:', error);
    return { success: false, error };
  }
}

export async function updateUserInMongo(userId: string, updateData: any) {
  try {
    const db = await getDb();
    const collection = db.collection('users');
    
    await collection.updateOne(
      { id: userId },
      { 
        $set: {
          ...updateData,
          updated_at: new Date().toISOString()
        }
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user in MongoDB:', error);
    return { success: false, error };
  }
} 