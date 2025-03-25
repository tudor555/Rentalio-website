import express from "express";
import {
  getAllReviews,
  getReview,
  addReview,
  deleteReview,
  updateReview,
} from "../controllers/reviews";
import { isAuthenticated, isOwnerOrAdmin, canEditStatusField } from "../middlewares";

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
  router.post("/reviews/add", isAuthenticated, async (req, res, next) => {
    try {
      await addReview(req, res);
    } catch (error) {
      next(error);
    }
  });

  // PATCH update reviews
  router.patch(
    "/reviews/:id",
    isAuthenticated,
    isOwnerOrAdmin,
    canEditStatusField,
    async (req, res, next) => {
      try {
        await updateReview(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // DELETE reviews by id
  router.delete(
    "/reviews/:id",
    isAuthenticated,
    isOwnerOrAdmin,
    async (req, res, next) => {
      try {
        await deleteReview(req, res);
      } catch (error) {
        next(error);
      }
    }
  );
};
