import express from "express";
import { get } from "lodash";

export const isOwnerOrAdmin: express.RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const role = get(req, "identity.role") as string | undefined;

  if (!role) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (role === "admin" || role === "owner") {
    next();
    return;
  }

  res
    .status(403)
    .json({ message: "Access denied: requires owner or admin role" });
};
