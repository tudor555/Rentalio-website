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
    const users = await getListings();

    console.log(`Succesfully get all listings.`);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getListing = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const listing = await getListingById(id);

    console.log(`Succesfully get listing.`);
    return res.status(200).json(listing);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
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
      return res
        .status(403)
        .json({ message: "Unauthorized: User does not exist" });
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

    console.log(`Succesfully add listing.`);
    return res.status(200).json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    return res.sendStatus(400);
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

    // Prevent updates to restricted fields like `ownerId`
    if (updates.ownerId) {
      return res
        .status(400)
        .json({ message: "Updating ownerId is not allowed" });
    }

    // Prevent updating immutable fields like `createdAt`
    if (updates.createdAt) {
      return res
        .status(400)
        .json({ message: "Updating createdAt is not allowed" });
    }

    const updatedListing = await updateListingById(id, updates);

    console.log(`Succesfully updated the listing.`);
    return res.status(200).json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    return res.status(400);
  }
};

export const deleteListing = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteListingById(id);

    console.log("Succesfully delete listing by id.");
    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
