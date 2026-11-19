import { Request, Response } from "express";
import { getCollection } from "../db/db.js";
import { ObjectId } from "mongodb";

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
			userId: req.payload.id,
			userName: req.payload.name,
			userEmail: req.payload.email,
		});

		if (!newBooking) {
			return res
				.status(500)
				.json({ success: false, message: "Internal server error.", data: null });
		}

		return res
			.status(200)
			.json({ success: true, message: "Booking created successfully.", data: newBooking });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error.", data: null });
	}
};

export const cancelBooking = async (req: Request, res: Response) => {
	const bookingCollection = getCollection("booking");

	const { id } = req.params;

	try {
		const booking = await bookingCollection.findOne({ _id: new ObjectId(id as string) });

		if (!booking) {
			return res.status(404).json({ success: false, message: "Booking not found.", data: null });
		}

		if (booking.userId !== req.payload.sub) {
			return res.status(401).json({ success: false, message: "Unauthorized request!", data: null });
		}

		const canceledBooking = await bookingCollection.findOneAndUpdate(
			{ _id: new ObjectId(id as string) },
			{
				$set: {
					status: "Canceled",
				},
			},
		);

		if (!canceledBooking) {
			return res
				.status(500)
				.json({ success: false, message: "Internal server error.", data: null });
		}

		return res
			.status(200)
			.json({ success: true, message: "Booking canceled.", data: canceledBooking });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error.", data: null });
	}
};
