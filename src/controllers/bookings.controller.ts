import { Request, Response } from "express";
import { getCollection } from "../db/db.js";
import { ObjectId } from "mongodb";

export const getAllBookings = async (req: Request, res: Response) => {
	const bookingCollection = getCollection("booking");

	const { email: userEmail } = req.payload;

	try {
		const allBookings = await bookingCollection.find({ userEmail }).toArray();
		return res
			.status(200)
			.json({ success: true, message: "Fetched all bookings.", data: allBookings });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};

export const createNewBooking = async (req: Request, res: Response) => {
	const bookingCollection = getCollection("booking");

	const bookingData = req.body;

	const { name, email, id: userId } = req.payload;

	if (bookingData.hostId === userId) {
		return res.status(409).json({ success: false, message: "Cannot book own studio.", data: null });
	}

	try {
		const newBooking = await bookingCollection.insertOne({
			...bookingData,
			status: "Pending",
			paymentStatus: "Pending",
			userId,
			userName: name,
			userEmail: email,
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

	const { email: userEmail } = req.payload;

	try {
		const canceledBooking = await bookingCollection.findOneAndUpdate(
			{
				_id: new ObjectId(id as string),
				userEmail,
				status: {
					$eq: "Pending",
				},
			},
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
