import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
}

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
    if(cached.conn) {
        return cached.conn;
    }

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI)
            .then(() => mongoose.connection)
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB");
    }

    return cached.conn;
}