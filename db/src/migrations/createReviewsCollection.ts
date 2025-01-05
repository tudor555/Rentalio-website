import path from "path";
import dotenv from "dotenv";
import { connectToMongoDB } from "../config/dbConfig";

// Load environment variables
const envPath = path.resolve(__dirname, "../../../env/db_env/db.env");
dotenv.config({ path: envPath });

const dbName = process.env.DATABASE_NAME || "default_database";
const initialCollection = "initial_data";
const targetCollection = "reviews";

const manageReviewsCollection = async () => {
  const client = await connectToMongoDB();

  try {
    const db = client.db(dbName);

    // Check and delete initial_data collection if it exists
    const collections = await db
      .listCollections({ name: initialCollection })
      .toArray();

    if (collections.length > 0) {
      console.log(`"${initialCollection}" collection exists. Deleting...`);
      await db.collection(initialCollection).drop();
      console.log(`"${initialCollection}" collection dropped.`);
    }

    // Check if the reviews collection already exists
    const reviewsCollectionExist = await db
      .listCollections({ name: targetCollection })
      .toArray();

    if (collections.length > 0) {
      console.log(`"${targetCollection}" collection already exists.`);
    } else {
      // Create the reviews collection
      console.log(`Creating "${targetCollection}" collection...`);
      await db.createCollection(targetCollection);
      console.log(`"${targetCollection}" collection created successfully.`);
    }
  } catch (error) {
    console.error("Error during collection creation:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
};

manageReviewsCollection();
