import { ObjectId } from "mongodb";
import { connectToMongoDB } from "../config/dbConfig";

const seedListings = async () => {
  const client = await connectToMongoDB();
  const db = client.db(process.env.DATABASE_NAME);

  const listings = [
    {
      title: "Modern Apartment in the City Center",
      description: "A stylish apartment close to all amenities.",
      category: "apartment",
      basePrice: 120,
      priceType: "day",
      images: [],
      location: {
        country: "Romania",
        city: "Oradea",
        address: "123 University Street",
        coordinates: { lat: 40.7128, lng: -74.006 },
      },
      amenities: ["wifi", "air conditioning", "kitchen"],
      ownerId: new ObjectId(), // Replace with a real user _id if needed
      availability: {
        from: new Date(),
        to: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        minStay: 2,
        maxStay: 30,
      },
      status: "active",
      tags: ["central", "family-friendly"],
    },
    {
      title: "Cozy Tennis Field with Lighting",
      description: "Ideal for day or night matches.",
      category: "tennis_field",
      basePrice: 60,
      priceType: "day",
      images: [],
      location: {
        country: "Spain",
        city: "Barcelona",
        address: "456 Sports Lane",
        coordinates: { lat: 41.3851, lng: 2.1734 },
      },
      amenities: ["night lighting", "locker rooms"],
      ownerId: new ObjectId(),
      availability: {
        from: new Date(),
        to: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        minStay: 1,
        maxStay: 14,
      },
      status: "active",
      tags: ["sports", "outdoor"],
    },
  ];

  try {
    const collection = db.collection("listings");
    const existingCount = await collection.countDocuments();
    if (existingCount === 0) {
      await collection.insertMany(listings);
      console.log("Listings seeded successfully!");
    } else {
      console.log("Listings collection already has data. Skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding listings:", error);
  } finally {
    await client.close();
  }
};

seedListings();
