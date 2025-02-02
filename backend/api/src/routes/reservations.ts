import express from "express";
import {
  getAllReservations,
  getReservation,
  addReservation,
  updateReservation,
  deleteReservation,
} from "../controllers/reservations";
import { isAuthenticated } from "../middlewares";
import { update } from "lodash";

export default (router: express.Router) => {
  // GET all reservations
  router.get("/reservations", async (req, res, next) => {
    try {
      await getAllReservations(req, res);
    } catch (error) {
      next(error);
    }
  });

  // GET reservation by id
  router.get("/reservations/:id", async (req, res, next) => {
    try {
      await getReservation(req, res);
    } catch (error) {
      next(error);
    }
  });

  // POST create reservation
  // TODO: Finish implement, only authenticated user can create reservation
  router.post("/reservations/add", async (req, res, next) => {
    try {
      // await isAuthenticated(req, res, next);
      await addReservation(req, res);
    } catch (error) {
      next(error);
    }
  });

  // PATCH update reviews
  // TODO: Finish implement, need to be authenticated, only owner and admin can edit reservation
  // Also only admin can edit the status field
  router.patch("/reservations/:id", async (req, res, next) => {
    try {
      // await isAuthenticated(req, res, next);
      await updateReservation(req, res);
    } catch (error) {
      next(error);
    }
  });

  // DELETE reviews by id
  // TODO: Finish implement, only admin can delete the reservation
  // Middleware checking
  // User will be notified that the reservation was canceled
  router.delete("/reservations/:id", async (req, res, next) => {
    try {
      // await isAuthenticated(req, res, next);
      await deleteReservation(req, res);
    } catch (error) {
      next(error);
    }
  });
};
