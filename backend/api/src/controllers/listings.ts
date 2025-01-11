import express from "express";
import { getListingById, getListings } from "../models/listings";

export const getAllListings = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getListings();

    console.log(`Succesfully get all listings.`);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getListing = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const listing = await getListingById(id);

    console.log(`Succesfully get listing.`);
    return res.status(200).json(listing);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  // TODO: Implement operation for create, update, delete
};
