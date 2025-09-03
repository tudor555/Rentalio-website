import express from "express";
import { UserModel } from "../models/users";
import { ListingModel } from "../models/listings";
import { ReservationModel } from "../models/reservations";

export const getKpis = async (req: express.Request, res: express.Response) => {
  try {
    const { startDate, endDate } = req.query;

    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    // Validate date inputs
    if (startDate) {
      fromDate = new Date(startDate as string);
      if (isNaN(fromDate.getTime())) {
        return res.status(400).json({ message: "Invalid startDate parameter" });
      }
    }

    if (endDate) {
      toDate = new Date(endDate as string);
      if (isNaN(toDate.getTime())) {
        return res.status(400).json({ message: "Invalid endDate parameter" });
      }
    }

    if (fromDate && toDate && fromDate > toDate) {
      return res
        .status(400)
        .json({ message: "startDate must be before or equal to endDate" });
    }

    // Build filter
    const dateFilter: any = {};
    if (fromDate || toDate) {
      dateFilter.createdAt = {};
      if (fromDate) dateFilter.createdAt.$gte = fromDate;
      if (toDate) dateFilter.createdAt.$lte = toDate;
    }

    // Run queries in parallel
    const [siteRevenue, reservationsCount, cancellationsCount, newUsersCount] =
      await Promise.all([
        // Total site revenue (sum of siteFee)
        ReservationModel.aggregate([
          { $match: dateFilter },
          { $group: { _id: null, total: { $sum: "$siteFee" } } },
        ]),

        // Total reservations
        ReservationModel.countDocuments(dateFilter),

        // Cancellations
        ReservationModel.countDocuments({ ...dateFilter, status: "cancelled" }),

        // New Users
        UserModel.countDocuments(dateFilter),
      ]);

    console.log(`Succesfully retrieved key performance indicators.`);
    return res.status(200).json({
      siteRevenue: siteRevenue[0]?.total || 0,
      reservations: reservationsCount,
      cancellations: cancellationsCount,
      newUsers: newUsersCount,
    });
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while fetching KPIs" });
  }
};

export const getMonthlyRevenue = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { startDate, endDate } = req.query;

    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    if (startDate) {
      fromDate = new Date(startDate as string);
      if (isNaN(fromDate.getTime())) {
        return res.status(400).json({ message: "Invalid startDate parameter" });
      }
    }

    if (endDate) {
      toDate = new Date(endDate as string);
      if (isNaN(toDate.getTime())) {
        return res.status(400).json({ message: "Invalid endDate parameter" });
      }
    }

    if (fromDate && toDate && fromDate > toDate) {
      return res
        .status(400)
        .json({ message: "startDate must be before or equal to endDate" });
    }

    const match: any = {};
    if (fromDate || toDate) {
      match.createdAt = {};
      if (fromDate) match.createdAt.$gte = fromDate;
      if (toDate) match.createdAt.$lte = toDate;
    }

    const results = await ReservationModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$siteFee" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log(`Succesfully retrieved monthly revenue of site.`);
    return res.status(200).json({
      data: results.map((r) => ({ month: r._id, revenue: r.revenue })),
    });
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while fetching revenue" });
  }
};

export const getTopRentals = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { startDate, endDate, limit = 5 } = req.query;

    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    if (startDate) {
      fromDate = new Date(startDate as string);
      if (isNaN(fromDate.getTime())) {
        return res.status(400).json({ message: "Invalid startDate parameter" });
      }
    }

    if (endDate) {
      toDate = new Date(endDate as string);
      if (isNaN(toDate.getTime())) {
        return res.status(400).json({ message: "Invalid endDate parameter" });
      }
    }

    if (fromDate && toDate && fromDate > toDate) {
      return res
        .status(400)
        .json({ message: "startDate must be before or equal to endDate" });
    }

    const match: any = {};
    if (fromDate || toDate) {
      match.createdAt = {};
      if (fromDate) match.createdAt.$gte = fromDate;
      if (toDate) match.createdAt.$lte = toDate;
    }

    const results = await ReservationModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$listingId",
          reservationCount: { $sum: 1 },
          totalRevenue: { $sum: "$siteFee" },
          ownerId: { $first: "$ownerId" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: Number(limit) },
    ]);

    // Enrich with rental + owner names
    const enriched = await Promise.all(
      results.map(async (r) => {
        const listing = await ListingModel.findById(r._id).select("title");
        const owner = await UserModel.findById(r.ownerId).select(
          "username email"
        );
        return {
          rentalId: r._id,
          rentalTitle: listing?.title || "Unknown",
          owner: owner?.username || "Unknown",
          reservations: r.reservationCount,
          siteRevenue: r.totalRevenue,
        };
      })
    );

    console.log(`Succesfully retrieved top performant rentals.`);
    return res.status(200).json({ data: enriched });
  } catch (error) {
    console.error("Error fetching top rentals:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while fetching top rentals" });
  }
};

export const getReservationsByStatus = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { startDate, endDate } = req.query;

    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    // Validate input dates
    if (startDate) {
      fromDate = new Date(startDate as string);
      if (isNaN(fromDate.getTime())) {
        return res.status(400).json({ message: "Invalid startDate parameter" });
      }
    }
    if (endDate) {
      toDate = new Date(endDate as string);
      if (isNaN(toDate.getTime())) {
        return res.status(400).json({ message: "Invalid endDate parameter" });
      }
    }
    if (fromDate && toDate && fromDate > toDate) {
      return res
        .status(400)
        .json({ message: "startDate must be before or equal to endDate" });
    }

    // Build filter
    const dateFilter: any = {};
    if (fromDate || toDate) {
      dateFilter.createdAt = {};
      if (fromDate) dateFilter.createdAt.$gte = fromDate;
      if (toDate) dateFilter.createdAt.$lte = toDate;
    }

    // Aggregate reservations grouped by status
    const results = await ReservationModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Convert results to structured object
    const response: Record<string, number> = {
      confirmed: 0,
      pending: 0,
      cancelled: 0,
    };
    results.forEach((r) => {
      response[r._id] = r.count;
    });

    console.log(`Succesfully retrieved reservations stats.`);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching reservations by status:", error);
    return res.status(500).json({
      message: "Internal server error while fetching reservations by status",
    });
  }
};
