import express from "express";
import { getAllListings, getListing } from "../controllers/listings";

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

  router.post("/listings/add", async (req, res, next) => {
    try {
    } catch (error) {
      next(error); // Pass the error to Express's error handler
    }
  });

  // UPDATE user by id (Admin or Owner)
  router.patch("/listings/:id", async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  });

  // DELETE user by id (Admin or Owner)
  router.delete("/listingss/:id", async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  });
};
