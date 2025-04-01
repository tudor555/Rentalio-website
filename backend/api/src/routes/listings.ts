import express from "express";
import {
  getAllListings,
  getListing,
  addListing,
  updateListing,
  deleteListing,
  searchListings,
} from "../controllers/listings";
import {
  isAuthenticated,
  isOwnerOrAdmin,
  validateObjectId,
} from "../middlewares";

// TODO: Check methods for add improvements
// TODO: Add route that permit parameters for sortings listings by different parameters

export default (router: express.Router) => {
  // GET all listings
  router.get("/listings", async (req, res, next) => {
    try {
      await getAllListings(req, res);
    } catch (error) {
      next(error);
    }
  });

  // GET listings with certain parameters
  // TODO: Finish implement and check with multiple types of requests
  router.get("/listings/search", async (req, res, next) => {
    try {
      await searchListings(req, res);
    } catch (error) {
      next(error);
    }
  });

  // GET listing by id
  router.get(
    "/listings/:id",
    validateObjectId("id"),
    async (req, res, next) => {
      try {
        await getListing(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // CREATE listing
  router.post(
    "/listings/add",
    isAuthenticated,
    isOwnerOrAdmin,
    async (req, res, next) => {
      try {
        await addListing(req, res);
      } catch (error) {
        next(error); // Pass the error to Express's error handler
      }
    }
  );

  // UPDATE listing by id (Admin or Owner)
  router.patch(
    "/listings/:id",
    validateObjectId("id"),
    isAuthenticated,
    isOwnerOrAdmin,
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
    validateObjectId("id"),
    isAuthenticated,
    isOwnerOrAdmin,
    async (req, res, next) => {
      try {
        await deleteListing(req, res);
      } catch (error) {
        next(error);
      }
    }
  );
};
