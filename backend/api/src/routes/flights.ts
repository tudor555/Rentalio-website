import express from "express";
import { getFlightsList } from "../controllers/flights";

export default (router: express.Router) => {
  // POST flights request to receive a list of flights
  router.post("/flights", async (req, res, next) => {
    try {
      await getFlightsList(req, res);
    } catch (error) {
      next(error);
    }
  });
};
