import express from "express";
import {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  updatePassword,
} from "../controllers/users";
import {
  isAuthenticated,
  isOwner,
  isOwnerOrAdmin,
  checkRoleChange,
} from "../middlewares";

export default (router: express.Router) => {
  // GET all users
  router.get("/users", isAuthenticated, async (req, res, next) => {
    try {
      await getAllUsers(req, res);
    } catch (error) {
      next(error);
    }
  });

  // GET user by id
  router.get("/users/:id", isAuthenticated, async (req, res, next) => {
    try {
      await getUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // UPDATE user by id (Admin or Owner)
  router.patch(
    "/users/:id",
    isAuthenticated,
    isOwnerOrAdmin,
    checkRoleChange,
    async (req, res, next) => {
      try {
        await updateUser(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // UPDATE password user (Owner only)
  router.patch(
    "/users/:id/password",
    isAuthenticated,
    isOwner,
    async (req, res, next) => {
      try {
        await updatePassword(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // DELETE user by id (Admin or Owner)
  router.delete(
    "/users/:id",
    isAuthenticated,
    isOwnerOrAdmin,
    async (req, res, next) => {
      try {
        await deleteUser(req, res);
      } catch (error) {
        next(error);
      }
    }
  );
};
