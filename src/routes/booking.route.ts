import { Router } from "express";
import {
	cancelBooking,
	createNewBooking,
	getAllBookings,
} from "../controllers/booking.controller.js";
import validateToken from "../middlewares/validateToken.middleware.js";

export const bookingRouter = Router();

bookingRouter.get("/", validateToken, getAllBookings);
bookingRouter.post("/", validateToken, createNewBooking);
bookingRouter.patch("/:id", validateToken, cancelBooking);
