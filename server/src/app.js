
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);   
        console.log("✅ Connected to MongoDB");
        console.log("Database name:", mongoose.connection.db?.databaseName);
        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Connection failed:", error);
        process.exit(1);
    }
}

testConnection();
