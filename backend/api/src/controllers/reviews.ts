import express from "express";
import {
  getReviews,
  getReviewById,
  createReview,
  updateReviewById,
  deleteReviewById,
} from "../models/reviews";
import { getUserById } from "../models/users";
import { getListingById } from "../models/listings";

export const getAllReviews = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const reviews = await getReviews();

    console.log(`Succesfully get all reviews.`);
    return res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getReview = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const review = await getReviewById(id);

    console.log(`Succesfully get review.`);
    return res.status(200).json(review);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const addReview = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { listingId, userId, rating, comment } = req.body;

    if (!listingId || !userId || rating === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if listing and user exist
    const [existingListing, existingUser] = await Promise.all([
      getListingById(listingId),
      getUserById(userId),
    ]);

    if (!existingListing || !existingUser) {
      return res.status(400).json({
        message: !existingListing
          ? "Listing does not exist"
          : "User does not exist",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const newReview = await createReview({
      listingId,
      userId,
      rating,
      comment,
    });

    console.log(`Review created successfully.`);
    return res.status(200).json(newReview);
  } catch (error) {
    console.error(`Error creating review:`, error);
    return res.sendStatus(400);
  }
};

export const updateReview = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { rating, comment, status } = req.body;

    // Check if the review exists
    const existingReview = await getReviewById(id);

    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    const updateFields: Record<string, any> = {};

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }
      updateFields.rating = rating;
    }

    if (comment !== undefined) {
      updateFields.comment = comment;
    }

    const allowedStatuses = ["pending", "approved", "rejected"];
    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Allowed values: ${allowedStatuses.join(
            ", "
          )}`,
        });
      }
      updateFields.status = status;
    }

    const updatedReview = await updateReviewById(id, updateFields);

    console.log(`Review updated successfully.`);
    return res.status(200).json(updatedReview);
  } catch (error) {
    console.error(`Error updating review:`, error);
    return res.sendStatus(400);
  }
};

export const deleteReview = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteReviewById(id);

    console.log("Succesfully delete review by id.");
    return res.json(deletedUser);
  } catch (error) {
    console.log(`Error deleting review:`, error);
    return res.sendStatus(400);
  }
};
