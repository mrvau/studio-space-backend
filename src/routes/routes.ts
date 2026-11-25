import { Router } from "express";
import { studioRouter } from "./studios.route.js";
import { bookingRouter } from "./bookings.route.js";

export const globalRouter = Router();

globalRouter.get("/", (req, res) => {
	res.status(200).json({ success: true, message: "Welcome to StudioSpace API." });
});

globalRouter.use("/studios", studioRouter);
globalRouter.use("/bookings", bookingRouter);
