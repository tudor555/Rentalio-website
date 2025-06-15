import path from "path";
import dotenv from "dotenv";
import { connectToMongoDB } from "../config/dbConfig";

// Load environment variables
const envPath = path.resolve(__dirname, "../../../env/db_env/db.env");
dotenv.config({ path: envPath });

// Database name from environment or default
const dbName = process.env.DATABASE_NAME || "default_database";

const createDatabaseIfNotExists = async () => {
  const client = await connectToMongoDB();

  try {
    // List existing databases
    const adminDb = client.db().admin();
    const dbList = await adminDb.listDatabases();
    const dbExists = dbList.databases.some((db) => db.name === dbName);

    if (dbExists) {
      console.log(`Database "${dbName}" already exists.`);
    } else {
      console.log(`Creating database "${dbName}"...`);

      // To force creation, perform a simple insert
      const db = client.db(dbName);
      await db.collection("initial_data").insertOne({
        createdAt: new Date(),
        note: "Initial entry to persist database",
      });

      console.log(`Database "${dbName}" has been created.`);
    }
  } catch (error) {
    console.error("Error during database creation:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
};

createDatabaseIfNotExists();
