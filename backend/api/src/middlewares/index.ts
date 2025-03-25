import express from "express";
import { get, identity, merge } from "lodash";
import { getUserById, getUserBySessionToken } from "../models/users";
import { getListingById } from "../models/listings";

// TODO: Check methods for add improvements and separate to different files
// Little refactoring of file

export const isAuthenticated: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const sessionToken = req.cookies["USER-AUTH"];

    if (!sessionToken) {
      res.status(403).json({ message: "Not authenticated" });
      return;
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      res.status(403).json({ message: "Invalid session" });
      return;
    }

    merge(req, { identity: existingUser });

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Auth check failed" });
    return;
  }
};

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

// Ensure the user can edit the listing (owner or admin)
export const canEditListing: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    const currentUserRole = get(req, "identity.role") as string;

    if (!id) {
      res.status(400).json({ message: "Listing ID is required" });
      return;
    }

    const listing = await getListingById(id);

    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    // Check if the user is the owner or admin
    const isOwner =
      currentUserRole === "owner" &&
      String(listing.ownerId) === String(currentUserId);
    const isAdmin = currentUserRole === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "Unauthorized to edit listing" });
      return;
    }

    // Pass the request to the next middleware/controller
    return next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Permission check failed" });
    return;
  }
};

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
      res.status(403).json({ message: "Only admin can edit the status field." });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in canEditReviewStatus middleware:", error);
    res.status(400).json({ message: "Status check failed" });
    return;
  }
};
