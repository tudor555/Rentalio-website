import { ObjectId } from "mongodb";
import { connectToMongoDB } from "../config/dbConfig";

const seedReviews = async () => {
  const client = await connectToMongoDB();
  const db = client.db(process.env.DATABASE_NAME);

  const reviews = [
    {
      listingId: new ObjectId(), // replace with actual listing _id
      userId: new ObjectId(),    // replace with actual user _id
      rating: 5,
      comment: "Amazing place, would definitely stay again!",
      status: "approved",
      createdAt: new Date(),
    },
    {
      listingId: new ObjectId(),
      userId: new ObjectId(),
      rating: 3,
      comment: "It was okay, but the amenities could be better.",
      status: "approved",
      createdAt: new Date(),
    },
  ];

  try {
    const collection = db.collection("reviews");
    const existingCount = await collection.countDocuments();
    if (existingCount === 0) {
      await collection.insertMany(reviews);
      console.log("Reviews seeded successfully!");
    } else {
      console.log("Reviews collection already has data. Skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding reviews:", error);
  } finally {
    await client.close();
  }
};

seedReviews();
