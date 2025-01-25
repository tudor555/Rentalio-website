import express from "express";
import { get, identity, merge } from "lodash";
import { getUserById, getUserBySessionToken } from "../models/users";
import { getListingById } from "../models/listings";

export const isAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const currentUserRole = get(req, "identity.role") as string;

    if (currentUserRole.toString() !== "admin") {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["USER-AUTH"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const checkRoleChange = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return next();
    }

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allowedRoles = ["owner", "visitor", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    // Allow admins to change roles freely
    if (user.role === "admin") {
      return next();
    }

    // Allow upgrading from "visitor" to "owner"
    if (user.role === "visitor" && role === "owner") {
      return next();
    }

    return res.status(403).json({ message: "Role change not allowed" });
  } catch (error) {
    console.error("Error in role change middleware:", error);
    return res.status(400);
  }
};

// Ensure the user can edit the listing (owner or admin)
export const canEditListing = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    const currentUserRole = get(req, "identity.role") as string;

    if (!id) {
      return res.status(400).json({ message: "Listing ID is required" });
    }

    const listing = await getListingById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if the user is the owner or admin
    const isOwner =
      currentUserRole === "owner" &&
      String(listing.ownerId) === String(currentUserId);
    const isAdmin = currentUserRole === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You cannot edit this listing" });
    }

    // Pass the request to the next middleware/controller
    return next();
  } catch (error) {
    console.error(error);
    return res.status(400);
  }
};
