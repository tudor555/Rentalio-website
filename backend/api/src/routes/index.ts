import express from "express";
import authentication from "./authentication";
import users from "./users";
import listings from "./listings";
import reviews from "./reviews";
import reservations from "./reservations";
import flights from "./flights";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  listings(router);
  reviews(router);
  reservations(router);
  flights(router);

  return router;
};
