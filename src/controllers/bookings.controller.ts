import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db/db.js";
import { HttpError } from "../errors/http-error.js";

export const getAllBookings = async (req: Request, res: Response) => {
	const bookingCollection = getCollection("booking");
	const { email: userEmail } = req.payload;
	const allBookings = await bookingCollection.find({ userEmail }).toArray();

	return res
		.status(200)
		.json({ success: true, message: "Fetched all bookings.", data: allBookings });
};

export const createNewBooking = async (req: Request, res: Response) => {
	const bookingCollection = getCollection("booking");
	const bookingData = req.body;
	const { name, email, id: userId } = req.payload;

	if (bookingData.hostId === userId) {
		throw new HttpError(409, "Cannot book own studio.");
	}

	const newBooking = await bookingCollection.insertOne({
		...bookingData,
		status: "Pending",
		paymentStatus: "Pending",
		userId,
		userName: name,
		userEmail: email,
	});

	return res.status(201).json({
		success: true,
		message: "Booking created successfully.",
		data: newBooking,
	});
};

export const cancelBooking = async (req: Request, res: Response) => {
	const bookingCollection = getCollection("booking");
	const id = req.params.id;
	const { status } = req.body;
	const { email: userEmail } = req.payload;

	if (typeof id !== "string" || !ObjectId.isValid(id)) {
		throw new HttpError(400, "Invalid booking id.");
	}
	if (status !== "Cancelled") {
		throw new HttpError(400, "Invalid status. Status must be 'Cancelled'");
	}

	const bookingId = new ObjectId(id);
	const booking = await bookingCollection.findOne({ _id: bookingId });
	if (!booking) {
		throw new HttpError(404, "Booking not found.");
	}
	if (booking.userEmail !== userEmail) {
		throw new HttpError(403, "You do not have permission to cancel this booking.");
	}
	if (booking.status !== "Pending") {
		throw new HttpError(409, "Only pending bookings can be cancelled.");
	}

	const canceledBooking = await bookingCollection.findOneAndUpdate(
		{ _id: bookingId, userEmail, status: "Pending" },
		{ $set: { status } },
	);

	if (!canceledBooking) {
		throw new HttpError(409, "Only pending bookings can be cancelled.");
	}

	return res
		.status(200)
		.json({ success: true, message: "Booking canceled.", data: canceledBooking });
};
