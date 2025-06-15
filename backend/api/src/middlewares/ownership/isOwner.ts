import express from "express";
import { get } from "lodash";

export const isOwner: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId || currentUserId.toString() !== id) {
      res.status(403).json({ message: "You are not the owner" });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Ownership check failed" });
    return;
  }
};
