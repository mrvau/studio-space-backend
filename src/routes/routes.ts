import { Router } from "express";
import { studioRouter } from "./studio.route.js";

export const globalRouter = Router();

globalRouter.get("/", (req, res) => {
	res.status(200).json({ success: true, message: "Welcome to StudioSpace API." });
});

globalRouter.use("/studio", studioRouter);
