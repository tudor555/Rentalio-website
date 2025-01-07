import express from "express";

import {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  // Read all users from DB
  router.get("/users", async (req, res, next) => {
    try {
      const authResult = await new Promise<void>((resolve, reject) => {
        isAuthenticated(req, res, (err) => {
          if (err) {
            reject(err); // Stop if not authenticated
          } else {
            resolve(); // Continue if authenticated
          }
        });
      });

      await getAllUsers(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.get("/users/:id", async (req, res, next) => {
    try {
      const authResult = await new Promise<void>((resolve, reject) => {
        isAuthenticated(req, res, (err) => {
          if (err) {
            reject(err); // Stop if not authenticated
          } else {
            resolve(); // Continue if authenticated
          }
        });
      });

      await getUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete user by id
  router.delete("/users/:id", async (req, res, next) => {
    try {
      const authResult = await new Promise<void>((resolve, reject) => {
        isAuthenticated(req, res, (err) => {
          if (err) {
            reject(err); // Stop if not authenticated
          } else {
            resolve(); // Continue if authenticated
          }
        });
      });

      const ownerResult = await new Promise<void>((resolve, reject) => {
        isOwner(req, res, (err) => {
          if (err) {
            reject(err); // Stop if not owner
          } else {
            resolve(); // Continue if owner
          }
        });
      });

      await deleteUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update user by id
  router.patch("/users/:id", async (req, res, next) => {
    try {
      const authResult = await new Promise<void>((resolve, reject) => {
        isAuthenticated(req, res, (err) => {
          if (err) {
            reject(err); // Stop if not authenticated
          } else {
            resolve(); // Continue if authenticated
          }
        });
      });

      const ownerResult = await new Promise<void>((resolve, reject) => {
        isOwner(req, res, (err) => {
          if (err) {
            reject(err); // Stop if not owner
          } else {
            resolve(); // Continue if owner
          }
        });
      });

      await updateUser(req, res);
    } catch (error) {
      next(error);
    }
  });
};
