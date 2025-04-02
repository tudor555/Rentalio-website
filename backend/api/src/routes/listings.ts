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
  // Example usage of /listings/search with query parameters:
  // - ?city=Oradea
  // - ?category=apartment&country=Romania
  // - ?title=cozy&priceMin=100&priceMax=500
  // - ?amenities=wifi,kitchen,parking
  // - ?from=2025-05-01&to=2025-05-10
  // - ?sort=price_asc (options: price_asc, price_desc, createdAt_asc, createdAt_desc, title_asc, title_desc)
  // All query parameters are optional and can be combined
  // Returns filtered and sorted listings based on query
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
