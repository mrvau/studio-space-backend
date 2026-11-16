import { Request, Response } from "express";
import { getCollection } from "../db/db.js";

export const getAllBookings = async (req: Request, res: Response) => {
	const bookingCollection = getCollection("booking");

	try {
		const allBookings = await bookingCollection.find({ userId: req.payload.sub }).toArray();
		res.status(200).json({ success: true, message: "Fetched all bookings.", data: allBookings });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};

export const createNewBooking = async (req: Request, res: Response) => {
	const bookingCollection = getCollection("booking");

	const { bookingDate, ...bookingData } = req.body;

	if (bookingData.hostId === req.payload.sub) {
		res.status(409).json({ success: false, message: "Cannot book own studio.", data: null });
		return;
	}

	try {
		const newBooking = await bookingCollection.insertOne({
			...bookingData,
			bookingDate: new Date(bookingDate),
		});

		if (!newBooking) {
			res.status(500).json({ success: false, message: "Internal server error.", data: null });
			return;
		}

		res
			.status(200)
			.json({ success: true, message: "Booking created successfully.", data: newBooking });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error.", data: null });
	}
};
