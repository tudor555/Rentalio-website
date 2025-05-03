import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { getIATACode } from "../helpers";

// const envPath = path.resolve(
//   __dirname,
//   "../../../../env/backend_env/api_env/api.env"
// );
// dotenv.config({ path: envPath });

const serpApiKey = process.env.SERPAPI_KEY;
const serpBaseUrl =
  process.env.SERPAPI_BASE_URL || "https://serpapi.com/search.json";

export const getFlightsList = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      from,
      destination,
      departureDate,
      flightType,
      returnDate,
      adults,
      childrens,
    } = req.body;

    const fromCode = getIATACode(from);
    const destinationCode = getIATACode(destination);

    if (!fromCode || !destinationCode || !departureDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const flightsResponse = await axios.get(serpBaseUrl, {
      params: {
        api_key: serpApiKey,
        engine: "google_flights",
        hl: "en",
        gl: "us",
        currency: "USD",
        departure_id: fromCode,
        arrival_id: destinationCode,
        outbound_date: departureDate,
        ...(returnDate && { return_date: returnDate }),
        ...(flightType && { type: flightType }),
        ...(adults && { adults }),
        ...(childrens && { children: childrens }),
      },
    });

    console.log(`Successfully find flights.`);
    return res.status(200).json(flightsResponse.data);
  } catch (error) {
    console.error("Error fetching flights:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
