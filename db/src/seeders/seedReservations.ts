import { ObjectId } from "mongodb";
import { connectToMongoDB } from "../config/dbConfig";

const seedReservations = async () => {
  const client = await connectToMongoDB();
  const db = client.db(process.env.DATABASE_NAME);

  const now = new Date();
  const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

  const reservations = [
    {
      listingId: new ObjectId(), // replace with real listing ID
      userId: new ObjectId(),    // user making the reservation
      ownerId: new ObjectId(),   // owner of the listing
      status: "confirmed",
      startDate: now,
      endDate: twoDaysLater,
      ownerAmount: 200,
      siteFee: 30,
      totalAmount: 230,
      createdAt: now,
    },
    {
      listingId: new ObjectId(),
      userId: new ObjectId(),
      ownerId: new ObjectId(),
      status: "pending",
      startDate: twoDaysLater,
      endDate: fiveDaysLater,
      ownerAmount: 350,
      siteFee: 50,
      totalAmount: 400,
      createdAt: now,
    },
  ];

  try {
    const collection = db.collection("reservations");
    const existingCount = await collection.countDocuments();
    if (existingCount === 0) {
      await collection.insertMany(reservations);
      console.log("Reservations seeded successfully!");
    } else {
      console.log("Reservations collection already has data. Skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding reservations:", error);
  } finally {
    await client.close();
  }
};

seedReservations();
