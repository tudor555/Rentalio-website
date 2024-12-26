import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../env/api_env/api.env");
dotenv.config({ path: envPath });

const app = express();
const port = process.env.API_PORT || 3000;

app.use(bodyParser.json());

// Simulated Database
let dataStore: { id: string; value: string }[] = [
  {
    id: "1",
    value: "test",
  },
  {
    id: "2",
    value: "test ok",
  },
];

// Routes
const apiRouter = express.Router();

// Read Data (GET)
apiRouter.get("/data", (req: Request, res: Response) => {
  res.json(dataStore);
});

// Read Data by ID (GET)
apiRouter.get("/data/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const item = dataStore.find((d) => d.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).send("Item not found");
  }
});

// Create Data (POST)
apiRouter.post("/data", (req: Request, res: Response) => {
  const { value } = req.body;
  const newItem = { id: uuidv4(), value };
  dataStore.push(newItem);
  res.status(201).json(newItem);
});

// Update Data (PATCH)
apiRouter.patch("/data/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { value } = req.body;
  const item = dataStore.find((d) => d.id === id);

  if (item) {
    if (value) item.value = value;
    res.json(item);
  } else {
    res.status(404).send("Item not found");
  }
});

// Delete Data (DELETE)
apiRouter.delete("/data/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = dataStore.length;
  dataStore = dataStore.filter((d) => d.id !== id);

  if (dataStore.length < initialLength) {
    res.status(200).send("Item deleted");
  } else {
    res.status(404).send("Item not found");
  }
});

// Attach router
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
