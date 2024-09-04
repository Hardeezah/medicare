import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const dbConnect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log('Database is already connected');
    return mongoose.connection; // Return the existing connection
  }

  if (connectionState === 2) {
    console.log('Database connection is currently being established');
    return mongoose.connection; // Return the ongoing connection attempt
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'medicare',
      bufferCommands: true,
    });
    console.log('Database connected successfully');
    return mongoose.connection;
  } catch (error: any) {
    console.error('Error connecting to the database:', error.message);
    throw new Error(`Unable to connect to database: ${error.message}`);
  }
};

export default dbConnect;
