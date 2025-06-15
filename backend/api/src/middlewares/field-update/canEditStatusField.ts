import express from "express";
import { get } from "lodash";

// For routes where only admin can edit status field
export const canEditStatusField: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const currentUserRole = get(req, "identity.role") as string;
    const { status } = req.body;

    // If no status change requested, skip
    if (!status) {
      return next();
    }

    // Only admins can modify the status field
    if (currentUserRole !== "admin") {
      res
        .status(403)
        .json({ message: "Only admin can edit the status field." });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in canEditReviewStatus middleware:", error);
    res.status(400).json({ message: "Status check failed" });
    return;
  }
};
