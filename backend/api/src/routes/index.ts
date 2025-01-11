import express from "express";
import authentication from "./authentication";
import users from "./users";
import listings from "./listings";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  listings(router);

  return router;
};
