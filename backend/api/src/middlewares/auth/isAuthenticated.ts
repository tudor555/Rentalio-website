import express from "express";
import { merge } from "lodash";
import { getUserBySessionToken } from "../../models/users";

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
