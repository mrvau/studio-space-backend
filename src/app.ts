import express from "express";
import cors from "cors";

import { globalRouter } from "./routes/routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", globalRouter);

export default app;
