import { Router } from "express";
import { studioRouter } from "./studio.route.js";
import { bookingRouter } from "./booking.route.js";

export const globalRouter = Router();

globalRouter.get("/", (req, res) => {
	res.status(200).json({ success: true, message: "Welcome to StudioSpace API." });
});

globalRouter.use("/studio", studioRouter);
globalRouter.use("/booking", bookingRouter);
