import express from "express";
import { get } from "lodash";
import { getUserById } from "../../models/users";

export const checkRoleChange: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const requestedRole = req.body.role;

    if (!requestedRole) {
      return next();
    }

    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const currentRole = user.role;
    const allowedRoles = ["owner", "visitor", "admin"];

    if (!allowedRoles.includes(requestedRole)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const requesterRole = get(req, "identity.role");

    // Allow admins to change roles freely
    if (requesterRole === "admin") {
      return next();
    }

    // Allow upgrading from "visitor" to "owner"
    if (currentRole === "visitor" && requestedRole === "owner") {
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
