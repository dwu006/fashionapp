import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config(); 

// const uri = process.env;
// console.log(uri);
const uri = "mongodb+srv://dwu28:Dwu123@cluster.iqqmw.mongodb.net/?retryWrites=true&w=majority&appName=cluster";


if (!uri) {
  throw new Error('Missing API Key: "MONGODB_URI"');
}

const db = async () => {
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

export default db;