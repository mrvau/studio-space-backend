import { Request, Response, NextFunction } from "express";
import { getCollection } from "../db/db.js";

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
	const bookingCollection = getCollection("booking");

	try {
		const allBookings = await bookingCollection.find({}).toArray();
		res.status(200).json({ data: allBookings });
	} catch (error) {
		console.error(error);
		res.status(500).send("not ok");
	}

	res.status(200).send("ok");
};

export const createNewBooking = async (req: Request, res: Response, next: NextFunction) => {
	const bookingCollection = getCollection("booking");

	const { bookingDate, ...bookingData } = req.body;

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
