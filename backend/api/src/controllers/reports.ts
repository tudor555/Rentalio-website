import express from "express";
import { ReservationModel } from "../models/reservations";
import { UserModel } from "../models/users";

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
        ReservationModel.countDocuments({ ...dateFilter, status: "canceled" }),

        // New Users
        UserModel.countDocuments(dateFilter),
      ]);

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
