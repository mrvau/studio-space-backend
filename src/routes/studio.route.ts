import { Router } from "express";
import {
	createNewStudio,
	deleteStudio,
	getAllStudios,
	getFeaturedStudios,
	getStudioById,
	updateStudio,
} from "../controllers/studio.controller.js";

export const studioRouter = Router();

studioRouter.get("/", getAllStudios);
studioRouter.get("/featured", getFeaturedStudios);
studioRouter.get("/:id", getStudioById);

studioRouter.post("/", createNewStudio);

studioRouter.delete("/:id", deleteStudio);
studioRouter.put("/:id", updateStudio);
