import express from "express";

import { getAllUsers, deleteUser, updateUser } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  // Read all user from DB
  router.get("/users", async (req, res, next) => {
    try {
      // await isAuthenticated(req, res, next);
      await getAllUsers(req, res);
    } catch (error) {
      next(error);
    }
  });

  // TODO: Implement get user by id

  // Delete user by id
  router.delete("/users/:id", async (req, res, next) => {
    try {
      // await isAuthenticated(req, res, next);
      // await isOwner(req, res, next);
      await deleteUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update user by id
  router.patch("/users/:id", async (req, res, next) => {
    try {
      // await isAuthenticated(req, res, next);
      // await isOwner(req, res, next);
      await updateUser(req, res);
    } catch (error) {
      next(error);
    }
  });
};
