import express from "express";
import {
  getAllReservations,
  getReservation,
  getReservationsByUser,
  getReservationsStats,
  searchReservations,
  addReservation,
  updateReservation,
  deleteReservation,
} from "../controllers/reservations";
import {
  isAuthenticated,
  isAdmin,
  isOwnerOrAdmin,
  validateObjectId,
} from "../middlewares";

export default (router: express.Router) => {
  // GET all reservations
  router.get("/reservations", async (req, res, next) => {
    try {
      await getAllReservations(req, res);
    } catch (error) {
      next(error);
    }
  });

  // GET reservations with certain parameters
  // Example usage of /reservations/search with query parameters:
  // - ?searchTerm=string
  // - ?fullName=string
  // - ?email=string
  // - ?status=string
  // - ?dateFrom=ISODate
  // - ?dateTo=ISODate
  // - ?pageSize=number
  // - ?page=number
  // - ?sort=startate_asc (options: createdAt_asc, createdAt_desc, startDate_asc, startDate_desc)
  // All query parameters are optional and can be combined
  // Returns filtered and sorted reservations based on query
  router.get(
    "/reservations/search",
    isAuthenticated,
    isAdmin,
    async (req, res, next) => {
      try {
        await searchReservations(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // GET reservations stats
  // Optional query params:
  // - searchTerm: string   (matches fullName OR email, case-insensitive)
  // - status:     string   ('confirmed' | 'pending' | 'canceled')
  router.get(
    "/reservations/stats",
    isAuthenticated,
    isAdmin,
    async (req, res, next) => {
      try {
        await getReservationsStats(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // GET reservation by id
  router.get(
    "/reservations/:id",
    validateObjectId("id"),
    async (req, res, next) => {
      try {
        await getReservation(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // GET all reservations for a user
  router.get(
    "/reservations/user/:userId",
    validateObjectId("userId"),
    isAuthenticated,
    async (req, res, next) => {
      try {
        await getReservationsByUser(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

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
    validateObjectId("id"),
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
    validateObjectId("id"),
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
