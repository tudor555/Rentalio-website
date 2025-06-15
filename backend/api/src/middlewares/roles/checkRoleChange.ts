import express from "express";
import { getUserById } from "../../models/users";

export const checkRoleChange: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return next();
    }

    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const allowedRoles = ["owner", "visitor", "admin"];

    if (!allowedRoles.includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    // Allow admins to change roles freely
    if (user.role === "admin") {
      return next();
    }

    // Allow upgrading from "visitor" to "owner"
    if (user.role === "visitor" && role === "owner") {
      return next();
    }

    res.status(403).json({ message: "Role change not allowed" });
    return;
  } catch (error) {
    console.error("Error in role change middleware:", error);
    res.status(400).json({ message: "Role validation failed" });
    return;
  }
};
