import express from "express";
import {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  updatePassword,
  searchUsers,
} from "../controllers/users";
import {
  isAuthenticated,
  isOwner,
  isOwnerOrAdmin,
  checkRoleChange,
  validateObjectId,
  isAdmin,
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

  // GET users with certain parameters
  // Example usage of /users/search with query parameters:
  // - ?username=string
  // - ?email=string
  // - ?role=string
  // - ?pageSize=number
  // - ?page=number
  // - ?sort=price_asc (options: createdAt_asc, createdAt_desc, username_asc, username_desc)
  // All query parameters are optional and can be combined
  // Returns filtered and sorted users based on query
  router.get(
    "/users/search",
    isAuthenticated,
    isAdmin,
    async (req, res, next) => {
      try {
        await searchUsers(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // GET user by id
  router.get(
    "/users/:id",
    validateObjectId("id"),
    isAuthenticated,
    async (req, res, next) => {
      try {
        await getUser(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // UPDATE user by id (Admin or Owner)
  router.patch(
    "/users/:id",
    validateObjectId("id"),
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

  // UPDATE user role by id
  router.patch(
    "/users/role-change/:id",
    validateObjectId("id"),
    isAuthenticated,
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
    validateObjectId("id"),
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
    validateObjectId("id"),
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
