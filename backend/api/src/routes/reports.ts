import express from "express";
import {
  isAuthenticated,
  isAdmin,
  isOwnerOrAdmin,
  validateObjectId,
} from "../middlewares";

export default (router: express.Router) => {
  // GET reports Key Performance Status
  router.get(
    "/reports/kpis",
    isAuthenticated,
    isAdmin,
    async (req, res, next) => {
      try {
      } catch (error) {
        next(error);
      }
    }
  );

  // GET reports revenue per month
  router.get(
    "/reports/revenue/monthly",
    isAuthenticated,
    isAdmin,
    async (req, res, next) => {
      try {
      } catch (error) {
        next(error);
      }
    }
  );

  // GET reports top perfoming rentals
  router.get(
    "/reports/top-rentals",
    isAuthenticated,
    isAdmin,
    async (req, res, next) => {
      try {
      } catch (error) {
        next(error);
      }
    }
  );

  // GET reports reservations status
  router.get(
    "/reports/reservations/status",
    isAuthenticated,
    isAdmin,
    async (req, res, next) => {
      try {
      } catch (error) {
        next(error);
      }
    }
  );
};
