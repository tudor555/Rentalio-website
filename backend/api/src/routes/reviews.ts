import express from "express";
import {
  getAllReviews,
  getReview,
  addReview,
  deleteReview,
  updateReview,
} from "../controllers/reviews";
import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  // GET all reviews
  router.get("/reviews", async (req, res, next) => {
    try {
      await getAllReviews(req, res);
    } catch (error) {
      next(error);
    }
  });

  // GET review by id
  router.get("/reviews/:id", async (req, res, next) => {
    try {
      await getReview(req, res);
    } catch (error) {
      next(error);
    }
  });

  // POST create reviews
  // TODO: Finish implement, only authenticated user can create review
  router.post("/reviews/add", async (req, res, next) => {
    try {
      // await isAuthenticated(req, res, next);
      await addReview(req, res);
    } catch (error) {
      next(error);
    }
  });

  // PATCH update reviews
  // TODO: Finish implement, need to be authenticated, only owner and admin can edit review
  // Also only admin can edit the status field
  router.patch("/reviews/:id", async (req, res, next) => {
    try {
      // await isAuthenticated(req, res, next);
      await updateReview(req, res);
    } catch (error) {
      next(error);
    }
  });

  // DELETE reviews by id
  // TODO: Finish implement, only owner of review and admin can delete the review
  router.delete("/reviews/:id", async (req, res, next) => {
    try {
      //   await isAuthenticated(req, res, next);
      await deleteReview(req, res);
    } catch (error) {
      next(error);
    }
  });
};
