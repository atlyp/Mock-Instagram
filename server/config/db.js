import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error(
      "MONGO_URI is missing. Please add it in your Render Environment settings.",
    );
  }

  const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      tls: process.env.NODE_ENV === "production" || mongoUri.startsWith("mongodb+srv://"),
  });
  console.log(`Connected to MongoDB database "${connection.connection.name}".`);
  return connection;
};

export default connectDB;
