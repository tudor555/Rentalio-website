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
import { getUserById } from "../models/users";

export const getAllReservations = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const reservations = await getReservations();

    console.log(`Succesfully get all reservations.`);
    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getReservation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const reservation = await getReservationById(id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    console.log(`Successfully retrieved reservation with ID: ${id}`);
    return res.status(200).json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getReservationsByUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;

    const reservations = await ReservationModel.find({ userId });

    if (!reservations || reservations.length === 0) {
      return res
        .status(404)
        .json({ message: "No reservations found for this user." });
    }

    console.log(`Successfully retrieved reservations for user: ${userId}`);
    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    return res.status(500).json({ message: "Internal server error" });
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
      fullName,
      email,
      paymentMethod,
      priceType,
      numberOfHours,
      startDate,
      endDate,
      totalAmount,
      ownerAmount,
      siteFee,
    } = req.body;

    if (
      !listingId ||
      !userId ||
      !fullName ||
      !email ||
      !paymentMethod ||
      !priceType ||
      !startDate ||
      !totalAmount ||
      !ownerAmount ||
      !siteFee
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const listing = await getListingById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing does not exist" });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const allowedPaymentMethods = ["credit-card", "paypal", "bank-transfer"];
    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: `Invalid payment method. Allowed values: ${allowedPaymentMethods.join(
          ", "
        )}`,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startData = new Date(startDate);

    if (isNaN(startData.getTime())) {
      return res.status(400).json({ message: "Invalid start date format" });
    }

    if (startData < today) {
      return res
        .status(400)
        .json({ message: "Start date cannot be in the past" });
    }

    let endData = null;

    // Handle hourly vs other bookings
    if (priceType === "hour") {
      if (!numberOfHours || numberOfHours < 1 || numberOfHours > 24) {
        return res
          .status(400)
          .json({ message: "Invalid number of hours (must be 1-24)" });
      }
    } else {
      if (!endDate) {
        return res.status(400).json({
          message: "End date is required for non-hourly reservations",
        });
      }

      endData = new Date(endDate);
      if (isNaN(endData.getTime())) {
        return res.status(400).json({ message: "Invalid end date format" });
      }

      if (endData <= startData) {
        return res
          .status(400)
          .json({ message: "End date must be after start date" });
      }

      // Prevent double bookings
      const overlappingReservations = await ReservationModel.find({
        listingId,
        $or: [{ startDate: { $lt: endData }, endDate: { $gt: startData } }],
      });

      if (overlappingReservations.length > 0) {
        return res
          .status(400)
          .json({ message: "Listing is already reserved for these dates" });
      }
    }

    const newReservation = await createReservation({
      listingId,
      userId,
      ownerId: listing.ownerId,
      fullName,
      email,
      paymentMethod,
      priceType,
      numberOfHours: priceType === "hour" ? numberOfHours : undefined,
      startDate: startData,
      endDate: endData,
      ownerAmount,
      siteFee,
      totalAmount,
    });

    console.log(`Successfully created reservation for listing ${listingId}`);
    return res.status(201).json(newReservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    return res.status(500).json({ error: "Internal server error" });
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

    const existingReservation = await getReservationById(id);
    if (!existingReservation) {
      return res.status(404).json({ error: "Reservation not found" });
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

    console.log(`Successfully updated reservation with ID: ${id}`);
    return res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteReservation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedReservation = await deleteReservationById(id);

    console.log(`Successfully deleted reservation with ID: ${id}`);
    return res.status(200).json(deletedReservation);
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
