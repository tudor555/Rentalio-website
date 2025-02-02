import express from "express";
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservationById,
  deleteReservationById,
  ReservationModel,
} from "../models/reservations";
import { getListingById } from "../models/listings";

export const getAllReservations = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const reviews = await getReservations();

    console.log(`Succesfully get all reservations.`);
    return res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getReservation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const review = await getReservationById(id);

    console.log(`Succesfully get reservation.`);
    return res.status(200).json(review);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const addReservation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      listingId,
      userId,
      startDate,
      endDate,
      totalAmount,
      ownerAmount,
      siteFee,
    } = req.body;

    if (
      !listingId ||
      !userId ||
      !startDate ||
      !endDate ||
      !totalAmount ||
      !ownerAmount
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const startData = new Date(startDate);
    const endData = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to avoid time mismatches

    if (isNaN(startData.getTime()) || isNaN(endData.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Ensure the dates are in the future
    if (startData < today || endData < today) {
      return res.status(400).json({ message: "Dates cannot be in the past" });
    }

    if (startData >= endData) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date" });
    }

    const listing = await getListingById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing does not exist" });
    }

    // Check if the listing is already reserved for the given dates
    const overlappingReservations = await ReservationModel.find({
      listingId,
      $or: [
        { startDate: { $lt: endData }, endDate: { $gt: startData } }, // Overlapping dates
      ],
    });

    if (overlappingReservations.length > 0) {
      return res
        .status(400)
        .json({ message: "Listing is already reserved for these dates" });
    }

    // Create reservation
    const newReservation = await createReservation({
      listingId,
      userId,
      ownerId: listing.ownerId,
      startDate: startData,
      endDate: endData,
      ownerAmount,
      siteFee,
      totalAmount,
    });

    console.log(`Reservation created successfully.`);
    return res.status(200).json(newReservation);
  } catch (error) {
    console.error(`Error creating reservation:`, error);
    return res.sendStatus(400);
  }
};

export const updateReservation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Reservation ID is required" });
    }

    const reservationId = await getReservationById(id);

    if (!reservationId) {
      return res.status(400).json({ message: "Resevation ID does not exist" });
    }

    // Fields that cannot be updated
    const restrictedFields: string[] = [
      "userId",
      "ownerId",
      "totalAmount",
      "ownerAmount",
      "siteFee",
      "createdAt",
    ];

    // Remove restricted fields from updateData
    restrictedFields.forEach((field) => delete updateData[field]);

    const allowedStatuses: string[] = ["pending", "confirmed", "cancelled"];
    if (updateData.status && !allowedStatuses.includes(updateData.status)) {
      return res.status(400).json({
        message: `Invalid status value. Allowed values: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    // Validate if the provided dates are correct
    if (updateData.startDate || updateData.endDate) {
      const startDate = updateData.startDate
        ? new Date(updateData.startDate)
        : null;
      const endDate = updateData.endDate ? new Date(updateData.endDate) : null;

      if (startDate && endDate && startDate >= endDate) {
        return res
          .status(400)
          .json({ message: "End date must be after start date." });
      }
    }

    const updatedReservation = await updateReservationById(id, updateData);

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    console.log(`Reservation ${id} updated successfully.`);
    return res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    return res.sendStatus(400);
  }
};

export const deleteReservation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteReservationById(id);

    console.log("Succesfully delete reservation by id.");
    return res.json(deletedUser);
  } catch (error) {
    console.log(`Error deleting reservation:`, error);
    return res.sendStatus(400);
  }
};
