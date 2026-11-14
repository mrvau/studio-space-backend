import { Router } from "express";
import {
	addNewStudio,
	getAllStudios,
	getFeaturedStudios,
	getStudioById,
} from "../controllers/studio.controller.js";

export const studioRouter = Router();

studioRouter.get("/", getAllStudios);
studioRouter.get("/featured", getFeaturedStudios);
studioRouter.get("/:id", getStudioById);

studioRouter.post("/", addNewStudio);
