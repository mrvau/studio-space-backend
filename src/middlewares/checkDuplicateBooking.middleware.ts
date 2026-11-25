import { Request, Response, NextFunction } from "express";
import { getCollection } from "../db/db.js";

const convertToMinutes = (timeStr: string) => {
	const hours = Number(timeStr.split(":")[0]);

	return hours * 60;
};

export const checkDuplicateBooking = async (req: Request, res: Response, next: NextFunction) => {
	const bookingCollection = getCollection("booking");

	const bookingData = req.body;

	try {
		const existingBooking = await bookingCollection.findOne({
			studioId: bookingData.studioId,
			bookingDate: bookingData.bookingDate,
		});

		if (!existingBooking) return next();

		const existingStart = convertToMinutes(existingBooking.startTime);
		const existingEnd = convertToMinutes(existingBooking.endTime);

		const newStart = convertToMinutes(bookingData.startTime);
		const newEnd = convertToMinutes(bookingData.endTime);

		if (newStart < existingEnd && newEnd > existingStart) {
			return res
				.status(409)
				.json({ success: false, message: "Studio is already booked.", data: null });
		}
		next();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error!", data: null });
	}
};
