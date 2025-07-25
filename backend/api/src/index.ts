import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

import router from "./routes";

// const envPath = path.resolve(
//   __dirname,
//   "../../../env/backend_env/api_env/api.env"
// );
// dotenv.config({ path: envPath });

const port = process.env.API_PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4200";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

const MONGO_URL = process.env.MONGO_URL || "";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully!");
});
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
