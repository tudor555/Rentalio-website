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
      userId: new ObjectId(), // user making the reservation
      ownerId: new ObjectId(), // owner of the listing
      fullName: "Alice Seed",
      email: "alice@example.com",
      paymentMethod: "credit-card",
      priceType: "day",
      startDate: now,
      endDate: twoDaysLater,
      ownerAmount: 200,
      siteFee: 30,
      totalAmount: 230,
      status: "confirmed",
      createdAt: now,
    },
    {
      listingId: new ObjectId(),
      userId: new ObjectId(),
      ownerId: new ObjectId(),
      fullName: "Bob Seeder",
      email: "bob@example.com",
      paymentMethod: "paypal",
      priceType: "day",
      startDate: twoDaysLater,
      endDate: fiveDaysLater,
      ownerAmount: 350,
      siteFee: 50,
      totalAmount: 400,
      status: "pending",
      createdAt: now,
    },
    {
      listingId: new ObjectId(),
      userId: new ObjectId(),
      ownerId: new ObjectId(),
      fullName: "Charlie Hourly",
      email: "charlie@example.com",
      paymentMethod: "bank-transfer",
      priceType: "hour",
      numberOfHours: 4,
      startDate: now,
      ownerAmount: 160,
      siteFee: 20,
      totalAmount: 180,
      status: "confirmed",
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
      console.log(
        "Reservations collection already has data. Skipping seeding."
      );
    }
  } catch (error) {
    console.error("Error seeding reservations:", error);
  } finally {
    await client.close();
  }
};

seedReservations();
