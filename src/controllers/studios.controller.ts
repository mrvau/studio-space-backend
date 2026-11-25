import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db/db.js";
import { HttpError } from "../errors/http-error.js";

export const getAllStudios = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const { category } = req.query;
	const query = category ? { category: String(category) } : {};
	const studios = await studioCollection.find(query).toArray();

	return res.status(200).json({ success: true, message: "Fetched all studios.", data: studios });
};

export const getFeaturedStudios = async (_req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const studios = await studioCollection.find({}).sort({ averageRating: -1 }).limit(6).toArray();

	return res
		.status(200)
		.json({ success: true, message: "Fetched featured studios", data: studios });
};

export const getUserListedStudios = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const { email } = req.payload;
	const userListedStudios = await studioCollection.find({ ownerEmail: email }).toArray();

	return res
		.status(200)
		.json({ success: true, message: "Fetched listed studios.", data: userListedStudios });
};

export const createNewStudio = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const studioData = req.body;
	const { id, name, email } = req.payload;
	const newStudio = await studioCollection.insertOne({
		...studioData,
		ownerId: id,
		ownerName: name,
		ownerEmail: email,
	});

	return res.status(201).json({ success: true, message: "Added new studio.", data: newStudio });
};

export const getStudioById = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const id = req.params.id;
	if (typeof id !== "string" || !ObjectId.isValid(id)) {
		throw new HttpError(400, "Invalid studio id.");
	}

	const studio = await studioCollection.findOne({ _id: new ObjectId(id) });
	if (!studio) {
		throw new HttpError(404, "Studio not found.");
	}

	return res
		.status(200)
		.json({ success: true, message: "Studio retrieved successfully.", data: studio });
};

export const deleteStudio = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const id = req.params.id;
	const { id: ownerId } = req.payload;
	if (typeof id !== "string" || !ObjectId.isValid(id)) {
		throw new HttpError(400, "Invalid studio id.");
	}

	const studioId = new ObjectId(id);
	const studio = await studioCollection.findOne({ _id: studioId });
	if (!studio) {
		throw new HttpError(404, "Studio not found.");
	}
	if (String(studio.ownerId) !== String(ownerId)) {
		throw new HttpError(403, "You do not have permission to delete this studio.");
	}

	const deletedStudio = await studioCollection.findOneAndDelete({ _id: studioId });
	if (!deletedStudio) {
		throw new HttpError(404, "Studio not found.");
	}

	return res.status(200).json({
		success: true,
		message: "Studio deleted successfully.",
		data: deletedStudio,
	});
};

export const updateStudio = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const id = req.params.id;
	const data = req.body;
	const { name, email, id: ownerId } = req.payload;
	if (typeof id !== "string" || !ObjectId.isValid(id)) {
		throw new HttpError(400, "Invalid studio id.");
	}

	const studioId = new ObjectId(id);
	const studio = await studioCollection.findOne({ _id: studioId });
	if (!studio) {
		throw new HttpError(404, "Studio not found.");
	}
	if (String(studio.ownerId) !== String(ownerId)) {
		throw new HttpError(403, "You do not have permission to update this studio.");
	}

	const updatedStudio = await studioCollection.findOneAndUpdate(
		{ _id: studioId },
		{
			$set: {
				...data,
				ownerId,
				ownerName: name,
				ownerEmail: email,
			},
		},
	);
	if (!updatedStudio) {
		throw new HttpError(404, "Studio not found.");
	}

	return res.status(200).json({
		success: true,
		message: "Studio updated successfully.",
		data: updatedStudio,
	});
};
