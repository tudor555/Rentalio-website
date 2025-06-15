import express from "express";
import { get } from "lodash";

export const isOwnerOrAdmin: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const currentUserId = get(req, "identity._id") as string;
    const currentUserRole = get(req, "identity.role") as string;
    const targetId = req.params.id;

    const isOwner = currentUserId === targetId;
    const isAdmin = currentUserRole === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Access denied: Not owner or admin" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in isOwnerOrAdmin middleware:", error);
    res.status(400).json({ message: "Access check failed" });
  }
};
