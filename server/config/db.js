import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI is missing; add it to server/.env.");
    }

    const connection = await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB database "${connection.connection.name}".`);
    return connection;
};

export default connectDB;
