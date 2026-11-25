import { Router } from "express";
import {
	cancelBooking,
	createNewBooking,
	getAllBookings,
} from "../controllers/bookings.controller.js";
import validateToken from "../middlewares/validateToken.middleware.js";
import { checkDuplicateBooking } from "../middlewares/checkDuplicateBooking.middleware.js";

export const bookingRouter = Router();

bookingRouter.get("/", validateToken, getAllBookings);
bookingRouter.post("/", validateToken, checkDuplicateBooking, createNewBooking);
bookingRouter.patch("/:id", validateToken, cancelBooking);
