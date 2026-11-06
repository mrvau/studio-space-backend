import { Router } from "express";
import { addNewStudio, getAllStudio } from "../controllers/studio.controller.js";

export const studioRouter = Router();

studioRouter.get("/", getAllStudio);
studioRouter.post("/", addNewStudio);
