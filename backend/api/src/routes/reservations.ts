import express from "express";
import {
  getAllReservations,
  getReservation,
  addReservation,
  updateReservation,
  deleteReservation,
} from "../controllers/reservations";
import { isAuthenticated, isAdmin, isOwnerOrAdmin } from "../middlewares";

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
  router.post("/reservations/add", isAuthenticated, async (req, res, next) => {
    try {
      await addReservation(req, res);
    } catch (error) {
      next(error);
    }
  });

  // PATCH update reviews
  router.patch(
    "/reservations/:id",
    isAuthenticated,
    isOwnerOrAdmin,
    async (req, res, next) => {
      try {
        await updateReservation(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // DELETE reviews by id
  router.delete(
    "/reservations/:id",
    isAuthenticated,
    isAdmin,
    async (req, res, next) => {
      try {
        // await isAuthenticated(req, res, next);
        await deleteReservation(req, res);
      } catch (error) {
        next(error);
      }
    }
  );
};
