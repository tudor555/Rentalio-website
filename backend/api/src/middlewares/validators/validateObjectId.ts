import express from "express";
import mongoose from "mongoose";

// TODO: finish implement this
export const validateObjectId= (paramName: string): express.RequestHandler => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: `Invalid ${paramName} format` });
      return;
    }

    next();
  };
