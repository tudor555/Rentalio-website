import express from "express";

import {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/users";
import { isAuthenticated, isOwner, isAdmin } from "../middlewares";

// TODO: Check and improve all this routes

export default (router: express.Router) => {
  // GET all users
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

  // GET user by id
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

  // TODO: for update and delete need to find a way that if isOwner or isAdmin to accept the request and not give error

  // UPDATE user by id (Admin or Owner)
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

      const adminResult = await new Promise<void>((resolve, reject) => {
        isAdmin(req, res, (err) => {
          if (err) {
            reject(err); // Stop if not admin
          } else {
            resolve(); // Continue if admin
          }
        });
      });

      await updateUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // DELETE user by id (Admin or Owner)
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

      const adminResult = await new Promise<void>((resolve, reject) => {
        isAdmin(req, res, (err) => {
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
};
