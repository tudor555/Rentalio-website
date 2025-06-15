import express from "express";
import { get } from "lodash";

export const isAdmin: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const currentUserRole = get(req, "identity.role") as string;

    if (currentUserRole.toString() !== "admin") {
      res.status(403).json({ message: "Admins only" });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Admin check failed" });
    return;
  }
};
