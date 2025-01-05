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

// Random salt generation and password hashing
const random = () => crypto.randomBytes(128).toString("base64");
const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

// Phone number encryption
const encryptPhoneNumber = (phone: string) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    crypto.scryptSync(SECRET, "salt", 32),
    Buffer.alloc(16, 0)
  );
  let encrypted = cipher.update(phone, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Phone number decryption maybe need on api at a moment
const decryptPhoneNumber = (encrypted: string) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    crypto.scryptSync(SECRET, "salt", 32),
    Buffer.alloc(16, 0) // Initialization Vector (IV) must match the one used during encryption
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
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
      console.log(`"${targetCollection}" collection created.`);

      // Create initial user
      const initialUsername = process.env.INITIAL_USER || "user";
      const password = process.env.INITIAL_PASSWORD || "123";
      const phone = process.env.INITIAL_PHONE || "+1234567890";
      const salt = random();
      const hashedPassword = authentication(salt, password);
      const encryptedPhone = encryptPhoneNumber(phone);

      // Insert inital user
      await db.collection(targetCollection).insertOne({
        username: initialUsername,
        email: "admin@example.com",
        role: "admin",
        phone: encryptedPhone,
        authentication: {
          password: hashedPassword,
          salt: salt,
          sessionToken: null,
        },
        profilePicture: null,
        createdAt: new Date(),
      });

      console.log(
        `Initial user "${initialUsername}" initialized in "${targetCollection}" collection.`
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
