import express from "express";

import { getAllUsers, deleteUser, updateUser } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", async (req, res, next) => {
    try {
      await isAuthenticated(req, res, next);
      await getAllUsers(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/users/:id", async (req, res, next) => {
    try {
      await isAuthenticated(req, res, next);
      await isOwner(req, res, next);
      await deleteUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.patch("/users/:id", async (req, res, next) => {
    try {
      await isAuthenticated(req, res, next);
      await isOwner(req, res, next);
      await updateUser(req, res);
    } catch (error) {
      next(error);
    }
  });
};
