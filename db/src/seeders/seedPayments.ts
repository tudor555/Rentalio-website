import { ObjectId } from "mongodb";
import { connectToMongoDB } from "../config/dbConfig";

const seedPayments = async () => {
  const client = await connectToMongoDB();
  const db = client.db(process.env.DATABASE_NAME);

  const payments = [
    {
      reservationId: new ObjectId(), // replace with real reservation _id
      userId: new ObjectId(), // replace with real user _id
      ownerAmount: 100,
      siteFee: 20,
      totalAmount: 120,
      paymentMethod: "credit_card",
      status: "paid",
      transactionId: "txn_abc123",
      isRefunded: false,
      createdAt: new Date(),
    },
    {
      reservationId: new ObjectId(),
      userId: new ObjectId(),
      ownerAmount: 80,
      siteFee: 15,
      totalAmount: 95,
      paymentMethod: "paypal",
      status: "pending",
      transactionId: "txn_xyz789",
      isRefunded: false,
      createdAt: new Date(),
    },
  ];

  try {
    const collection = db.collection("payments");
    const existingCount = await collection.countDocuments();
    if (existingCount === 0) {
      await collection.insertMany(payments);
      console.log("Payments seeded successfully!");
    } else {
      console.log("Payments collection already has data. Skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding payments:", error);
  } finally {
    await client.close();
  }
};

seedPayments();
