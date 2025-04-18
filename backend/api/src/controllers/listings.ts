import express from "express";
import {
  getListings,
  getListingById,
  createListing,
  deleteListingById,
  updateListingById,
} from "../models/listings";
import { getUserById } from "../models/users";

export const getAllListings = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const listings = await getListings();

    console.log(`Succesfully get all listings.`);
    return res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getListing = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const listing = await getListingById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    console.log(`Successfully retrieved listing with ID: ${id}`);
    return res.status(200).json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Method for filter listings based on different criteria
export const searchListings = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      category,
      city,
      country,
      title,
      ownerId,
      amenities,
      priceMin,
      priceMax,
      from,
      to,
      sort,
      limit
    } = req.query;

    const filter: any = {};

    if (category) filter.category = category;
    if (city) filter["location.city"] = city;
    if (country) filter["location.country"] = country;
    if (title) filter.title = { $regex: title as string, $options: "i" };
    if (ownerId) filter.ownerId = ownerId;

    if (priceMin || priceMax) {
      filter.basePrice = {};
      if (priceMin) filter.basePrice.$gte = Number(priceMin);
      if (priceMax) filter.basePrice.$lte = Number(priceMax);
    }

    if (amenities) {
      const amenitiesArray = (amenities as string).split(",");
      filter.amenities = { $all: amenitiesArray };
    }

    if (from || to) {
      filter["availability.from"] = { $lte: new Date(from as string) };
      filter["availability.to"] = { $gte: new Date(to as string) };
    }

    const sortOptions: Record<string, any> = {
      price_asc: { basePrice: 1 },
      price_desc: { basePrice: -1 },
      createdAt_desc: { createdAt: -1 },
      createdAt_asc: { createdAt: 1 },
      title_asc: { title: 1 },
      title_desc: { title: -1 },
    };

    const sortQuery = sortOptions[sort as string] || {};

    const limitNumber = limit ? parseInt(limit as string, 10) : undefined;

    const listings = await getListings({ filter, sort: sortQuery, limit: limitNumber });

    console.log("Filtered listings search performed");
    return res.status(200).json(listings);
  } catch (error) {
    console.error("Error searching listings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addListing = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      title,
      description,
      category,
      basePrice,
      images,
      location,
      amenities,
      ownerId,
      availability,
      tags,
    } = req.body;

    if (
      !title ||
      !category ||
      !basePrice ||
      !location?.country ||
      !location?.city ||
      !location?.address ||
      !ownerId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const allowedCategories = [
      "apartment",
      "playground",
      "football_field",
      "tennis_field",
      "office",
      "other",
    ];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const user = await getUserById(ownerId);
    if (!user) {
      return res.status(403).json({ error: "Owner does not exist" });
    }

    const newListing = {
      title,
      description,
      category,
      basePrice,
      images: images || [],
      location,
      amenities: amenities || [],
      ownerId,
      availability: availability || {},
      tags: tags || [],
    };

    const listing = await createListing(newListing);

    console.log("Successfully created listing.");
    return res.status(201).json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateListing = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Fetch the listing
    const listing = await getListingById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Validate fields before applying updates
    if (updates.category) {
      const allowedCategories = [
        "apartment",
        "playground",
        "football_field",
        "tennis_field",
        "office",
        "other",
      ];

      if (!allowedCategories.includes(updates.category)) {
        return res.status(400).json({ message: "Invalid category" });
      }
    }

    if (updates.basePrice && updates.basePrice <= 0) {
      return res
        .status(400)
        .json({ message: "Base price must be greater than zero" });
    }

    // Prevent updates to restricted fields
    if (updates.ownerId || updates.createdAt) {
      return res.status(400).json({ error: "Cannot update restricted fields" });
    }

    const updatedListing = await updateListingById(id, updates);

    console.log(`Successfully updated listing with ID: ${id}`);
    return res.status(200).json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteListing = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedListing = await deleteListingById(id);

    console.log(`Successfully deleted listing with ID: ${id}`);
    return res.status(200).json(deletedListing);
  } catch (error) {
    console.error("Error deleting listing:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
