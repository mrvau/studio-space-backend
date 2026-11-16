import { Router } from "express";
import {
	createNewStudio,
	deleteStudio,
	getAllStudios,
	getFeaturedStudios,
	getStudioById,
	getUserListedStudios,
	updateStudio,
} from "../controllers/studio.controller.js";
import validateToken from "../middlewares/validateToken.middleware.js";

export const studioRouter = Router();

studioRouter.get("/", getAllStudios);
studioRouter.get("/featured", getFeaturedStudios);
studioRouter.get("/listed", validateToken, getUserListedStudios);
studioRouter.get("/:id", getStudioById);

studioRouter.post("/", validateToken, createNewStudio);

studioRouter.delete("/:id", validateToken, deleteStudio);
studioRouter.put("/:id", validateToken, updateStudio);
