import express from "express";
import {
  getAllListings,
  getListing,
  addListing,
  updateListing,
  deleteListing,
} from "../controllers/listings";
import { canEditListing, isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  // GET all listings
  router.get("/listings", async (req, res, next) => {
    try {
      await getAllListings(req, res);
    } catch (error) {
      next(error);
    }
  });

  // GET listing by id
  router.get("/listings/:id", async (req, res, next) => {
    try {
      await getListing(req, res);
    } catch (error) {
      next(error);
    }
  });

  // CREATE listing
  router.post("/listings/add", isAuthenticated, async (req, res, next) => {
    try {
      await addListing(req, res);
    } catch (error) {
      next(error); // Pass the error to Express's error handler
    }
  });

  // UPDATE listing by id (Admin or Owner)
  router.patch(
    "/listings/:id",
    isAuthenticated,
    canEditListing,
    async (req, res, next) => {
      try {
        await updateListing(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // DELETE listing by id (Admin or Owner)
  router.delete(
    "/listings/:id",
    isAuthenticated,
    canEditListing,
    async (req, res, next) => {
      try {
        await deleteListing(req, res);
      } catch (error) {
        next(error);
      }
    }
  );
};
