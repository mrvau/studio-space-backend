import { Router } from "express";
import { createNewBooking, getAllBookings } from "../controllers/booking.controller.js";

export const bookingRouter = Router();

bookingRouter.get("/", getAllBookings);
bookingRouter.post("/", createNewBooking);
