import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../../env/db_env/db.env");
dotenv.config({ path: envPath });

const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(uri);

export const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
