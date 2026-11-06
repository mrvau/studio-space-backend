import { Request, Response, NextFunction } from "express";
import { getCollection } from "../db/db.js";

export const getAllStudio = async (req: Request, res: Response, next: NextFunction) => {
	const studioCollection = getCollection("studio");
	const query = req.query;

	try {
		const studios = await studioCollection.aggregate([
			{
				match,
			},
		]);
		res.status(200).json({ success: true, message: "Fetched all studios.", data: studios });
	} catch (error) {
		res.status(500).json({ success: false, message: "Failed to fetch studios." });
	}
};

export const addNewStudio = async (req: Request, res: Response, next: NextFunction) => {
	const studioCollection = getCollection("studio");
	const newStudioData = req.body;
	try {
		const newStudio = await studioCollection.insertOne(newStudioData);
		if (!newStudio) {
			res.status(500).json({ success: false, message: "Internal server error." });
			return;
		}

		res.status(201).json({ success: true, message: "Added new studio.", data: newStudio });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal server error." });
	}
};
