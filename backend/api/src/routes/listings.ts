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

  // TODO: Implement routes for create, update, delete

  // CREATE listing
  router.post("/listings/add", async (req, res, next) => {
    try {
      // TODO: User need to be authenticated to can create a listing
      // await isAuthenticated(req, res, next);
      await addListing(req, res);
    } catch (error) {
      next(error); // Pass the error to Express's error handler
    }
  });

  // UPDATE listing by id (Admin or Owner)
  router.patch("/listings/:id", async (req, res, next) => {
    try {
      // TODO: check how to use these methods for ensure only authorized people can update the listing
      // await isAuthenticated(req, res, next), // Ensure user is logged in
      // await canEditListing(req, res, next), // Ensure user can edit the listing
      await updateListing(req, res);
    } catch (error) {
      next(error);
    }
  });

  // DELETE listing by id (Admin or Owner)
  router.delete("/listings/:id", async (req, res, next) => {
    try {
      // TODO: check how to use these methods for ensure only authorized people can delete the listing
      // await isAuthenticated(req, res, next), // Ensure user is logged in
      // await canEditListing(req, res, next), // Ensure user can edit the listing
      await deleteListing(req, res);
    } catch (error) {
      next(error);
    }
  });
};
