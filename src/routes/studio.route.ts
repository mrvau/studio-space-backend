import { Router } from "express";
import {
	addNewStudio,
	getAllStudios,
	getFeaturedStudios,
} from "../controllers/studio.controller.js";

export const studioRouter = Router();

studioRouter.get("/", getAllStudios);
studioRouter.get("/featured", getFeaturedStudios);

studioRouter.post("/", addNewStudio);
