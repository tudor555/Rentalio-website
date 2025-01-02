import path from "path";
import dotenv from "dotenv";
import { connectToMongoDB } from "../config/dbConfig";
import crypto from "crypto";

// Load environment variables
const envPath = path.resolve(__dirname, "../../../env/db_env/db.env");
dotenv.config({ path: envPath });

const dbName = process.env.DATABASE_NAME || "default_database";
const targetCollection = "users";
const initialCollection = "initial_data";
const SECRET = process.env.SECRET || "default_secret";

// Authentication and random salt generation
const random = () => crypto.randomBytes(128).toString("base64");
const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

const manageUsersCollection = async () => {
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

    // Check if the users collection exists
    const userCollectionExists = await db
      .listCollections({ name: targetCollection })
      .toArray();

    if (userCollectionExists.length > 0) {
      console.log(`"${targetCollection}" collection already exists.`);
    } else {
      // Create the users collection
      console.log(`Creating "${targetCollection}" collection...`);
      await db.createCollection(targetCollection);

      // Create initial admin user with consistent hashing logic
      const initialUsername = process.env.INITIAL_USER || "user";
      const password = process.env.INITIAL_PASSWORD || "123";
      const salt = random();
      const hashedPassword = authentication(salt, password);

      // Insert initial admin user
      await db.collection(targetCollection).insertOne({
        username: initialUsername,
        email: "admin@example.com",
        role: "admin",
        createdAt: new Date(),
        authentication: {
          password: hashedPassword,
          salt: salt,
          sessionToken: null,
        },
      });

      console.log(
        `"${targetCollection}" collection created and "${initialUsername}" user initialized.`
      );
    }
  } catch (error) {
    console.error("Error during collection management:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
};

manageUsersCollection();
