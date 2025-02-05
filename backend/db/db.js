import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('Missing API Key: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

const connectToDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectToDb;