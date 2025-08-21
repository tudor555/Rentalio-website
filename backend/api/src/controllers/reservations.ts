import express from "express";
import {
  getReservationsCount,
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
    const reservations = await getReservations({});

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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const total = await ReservationModel.countDocuments({ userId });

    const reservations = await ReservationModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!reservations || reservations.length === 0) {
      return res
        .status(404)
        .json({ message: "No reservations found for this user." });
    }

    console.log(`Successfully retrieved reservations for user: ${userId}`);
    return res.status(200).json({
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      results: reservations,
    });
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getReservationsStats = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { searchTerm, status } = req.query;

    // Build filter for aggregation
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    if (searchTerm && String(searchTerm).trim()) {
      const term = String(searchTerm).trim();
      filter.$or = [
        { fullName: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
      ];
    }

    // Group counts by status for the (possibly) filtered set
    const grouped = await ReservationModel.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Total for the filtered set
    const total = grouped.reduce((sum, g) => sum + g.count, 0);

    const stats = {
      total,
      confirmed: 0,
      pending: 0,
      canceled: 0,
    };

    for (const row of grouped) {
      if (row._id === "confirmed") stats.confirmed = row.count;
      if (row._id === "pending") stats.pending = row.count;
      if (row._id === "canceled") stats.canceled = row.count;
    }

    console.log(`Successfully get reservations stats.`);
    return res.status(200).json(stats);
  } catch (err) {
    console.error("Error getting reservations stats:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const searchReservations = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      searchTerm, // free text: fullName/email
      fullName,
      email,
      status, // "pending" | "confirmed" | "canceled"
      dateFrom, // ISO date string (filter by startDate >= dateFrom)
      dateTo, // ISO date string (filter by endDate <= dateTo)
      sort, // createdAt_desc|createdAt_asc|startDate_desc|startDate_asc
    } = req.query;

    const page = parseInt(req.query.page as string) || 1;
    const pageSize =
      parseInt(req.query.limit as string) ||
      parseInt(req.query.pageSize as string) ||
      10;
    const skip = (page - 1) * pageSize;

    const filter: any = {};

    // Status (strict)
    const allowedStatuses = ["pending", "confirmed", "canceled"];
    if (status && allowedStatuses.includes(String(status))) {
      filter.status = status;
    }

    // Field-specific search
    if (fullName) {
      filter.fullName = { $regex: String(fullName), $options: "i" };
    }
    if (email) {
      filter.email = { $regex: String(email), $options: "i" };
    }

    // Free text search across name/email
    if (searchTerm && !fullName && !email) {
      const needle = String(searchTerm);
      filter.$or = [
        { fullName: { $regex: needle, $options: "i" } },
        { email: { $regex: needle, $options: "i" } },
      ];
    }

    // Date window
    if (dateFrom) {
      filter.startDate = {
        ...(filter.startDate || {}),
        $gte: new Date(String(dateFrom)),
      };
    }
    if (dateTo) {
      // endDate can be null for hourly bookings
      filter.endDate = {
        ...(filter.endDate || {}),
        $lte: new Date(String(dateTo)),
      };
    }

    const sortOptions: Record<string, any> = {
      createdAt_desc: { createdAt: -1 },
      createdAt_asc: { createdAt: 1 },
      startDate_desc: { startDate: -1 },
      startDate_asc: { startDate: 1 },
    };
    const sortQuery = sortOptions[String(sort)] || { createdAt: -1 };

    const [reservations, total] = await Promise.all([
      getReservations({ filter, sort: sortQuery, skip, limit: pageSize }),
      getReservationsCount(filter),
    ]);

    console.log("Filtered reservations search performed");
    return res.status(200).json({
      data: reservations,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error searching reservations:", error);
    return res.status(500).json({ error: "Internal server error" });
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
