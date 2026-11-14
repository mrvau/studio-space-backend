import { Request, Response, NextFunction } from "express";
import { getCollection } from "../db/db.js";
import { ObjectId } from "mongodb";

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

		res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};

export const getFeaturedStudios = async (req: Request, res: Response, next: NextFunction) => {
	const studioCollection = getCollection("studio");

	try {
		const studios = await studioCollection.find({}).sort({ averageRating: -1 }).limit(6).toArray();

		res.status(200).json({ success: true, message: "Fetched featured studios", data: studios });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error", data: null });
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

export const getStudioById = async (req: Request, res: Response, next: NextFunction) => {
	const studioCollection = getCollection("studio");
	const { id } = req.params;
	console.log(id);
	try {
		const studio = await studioCollection.findOne({ _id: new ObjectId(id as string) });
		if (!studio) {
			res.status(404).json({ success: false, message: "Studio not found", data: null });
		}

		res.status(200).json({ success: true, message: "Studio retrive successfully.", data: studio });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};

export const deleteStudio = async (req: Request, res: Response, next: NextFunction) => {
	const studioCollection = getCollection("studio");
	const { id } = req.params;

	try {
		const deletedStudio = await studioCollection.findOneAndDelete({
			_id: new ObjectId(id as string),
		});

		if (!deleteStudio) {
			res.status(500).json({ success: false, message: "Internal server error", data: null });
			return;
		}
		res
			.status(200)
			.json({ success: true, message: "Studio deleted successfully", data: deletedStudio });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};

export const updateStudio = async (req: Request, res: Response, next: NextFunction) => {
	const studioCollection = getCollection("studio");
	const { id } = req.params;
	const data = req.body;

	try {
		const updatedStudio = await studioCollection.findOneAndUpdate(
			{ _id: new ObjectId(id as string) },
			{
				$set: {
					...data,
				},
			},
		);

		if (!updateStudio) {
			res.status(500).json({ success: false, message: "Internal server error", data: null });
			return;
		}

		res
			.status(200)
			.json({ success: true, message: "Studio updated successfully.", data: updatedStudio });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};
