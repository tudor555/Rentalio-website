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
