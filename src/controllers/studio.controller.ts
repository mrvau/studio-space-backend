import { Request, Response, NextFunction } from "express";
import { getCollection } from "../db/db.js";

export const getAllStudios = async (req: Request, res: Response, next: NextFunction) => {
	const studioCollection = getCollection("studio");
	const { ownerEmail, category, limit = 0 } = req.query;

	let query: Partial<{ ownerEmail: string; category: string }> | null = {};

	if (ownerEmail) {
		query.ownerEmail = String(ownerEmail);
	} else if (category) {
		query.category = String(category);
	} else {
		query = null;
	}

	try {
		const studios = await studioCollection.find(query ? query : {}).toArray();

		res.status(200).json({ success: true, message: "Fetched all studios.", data: studios });
	} catch (error) {
		console.error(error);

		res.status(500).json({ success: false, message: "Failed to fetch studios.", data: null });
	}
};

export const getFeaturedStudios = async (req: Request, res: Response, next: NextFunction) => {
	const studioCollection = getCollection("studio");

	try {
		const studios = await studioCollection.find({}).sort({ averageRating: -1 }).limit(6).toArray();

		res.status(200).json({ success: true, message: "Fetched featured studios", data: studios });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Failed to fetch studios.", data: null });
	}
};

export const addNewStudio = async (req: Request, res: Response, next: NextFunction) => {
	const studioCollection = getCollection("studio");
	const newStudioData = req.body;

	try {
		const newStudio = await studioCollection.insertOne(newStudioData);

		if (!newStudio) {
			res.status(500).json({ success: false, message: "Internal server error.", data: null });
			return;
		}

		res.status(201).json({ success: true, message: "Added new studio.", data: newStudio });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error.", data: null });
	}
};
