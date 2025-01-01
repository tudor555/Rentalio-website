import express from "express";

import { login, register } from "../controllers/authentication";

export default (router: express.Router) => {
  router.post("/auth/register", async (req, res, next) => {
    try {
      await register(req, res);
    } catch (error) {
      next(error); // Pass the error to Express's error handler
    }
  });
  router.post("/auth/login", async (req, res, next) => {
    try {
      await login(req, res);
    } catch (error) {
      next(error); // Pass the error to Express's error handler
    }
  });
};
