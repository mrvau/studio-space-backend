import { Request, Response } from "express";
import { getCollection } from "../db/db.js";
import { ObjectId } from "mongodb";

export const getAllStudios = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const { category } = req.query;

	let query: Partial<{ category: string }> | null = {};

	if (category) {
		query.category = String(category);
	} else {
		query = null;
	}

	try {
		const studios = await studioCollection.find(query || {}).toArray();

		return res.status(200).json({ success: true, message: "Fetched all studios.", data: studios });
	} catch (error) {
		console.error(error);

		return res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};

export const getFeaturedStudios = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");

	try {
		const studios = await studioCollection.find({}).sort({ averageRating: -1 }).limit(6).toArray();

		return res
			.status(200)
			.json({ success: true, message: "Fetched featured studios", data: studios });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};

export const getUserListedStudios = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");

	const { email } = req.payload;

	try {
		const userListedStudios = await studioCollection.find({ ownerEmail: email }).toArray();

		return res
			.status(200)
			.json({ success: true, message: "Fetched listed studios.", data: userListedStudios });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};

export const createNewStudio = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const studioData = req.body;
	const { id, name, email } = req.payload;

	const newStudioData = {
		...studioData,
		ownerId: id,
		ownerName: name,
		ownerEmail: email,
	};

	try {
		const newStudio = await studioCollection.insertOne(newStudioData);

		if (!newStudio) {
			return res
				.status(500)
				.json({ success: false, message: "Internal server error.", data: null });
		}

		return res.status(201).json({ success: true, message: "Added new studio.", data: newStudio });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error.", data: null });
	}
};

export const getStudioById = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const { id } = req.params;
	try {
		const studio = await studioCollection.findOne({ _id: new ObjectId(id as string) });
		if (!studio) {
			return res.status(404).json({ success: false, message: "Studio not found", data: null });
		}

		return res
			.status(200)
			.json({ success: true, message: "Studio retrive successfully.", data: studio });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};

export const deleteStudio = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const { id } = req.params;

	const { id: ownerId } = req.payload;
	try {
		const studio = await studioCollection.findOne({
			_id: new ObjectId(id as string),
		});

		if (String(studio?.ownerId) !== String(ownerId)) {
			return res.status(401).json({ success: false, message: "Unauthorized request!", data: null });
		}

		const deletedStudio = await studioCollection.findOneAndDelete({
			_id: new ObjectId(id as string),
		});

		if (!deletedStudio) {
			return res.status(500).json({ success: false, message: "Internal server error", data: null });
		}
		return res
			.status(200)
			.json({ success: true, message: "Studio deleted successfully", data: deletedStudio });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};

export const updateStudio = async (req: Request, res: Response) => {
	const studioCollection = getCollection("studio");
	const { id } = req.params;
	const data = req.body;
	const { name, email, id: ownerId } = req.payload;

	try {
		const studio = await studioCollection.findOne({ _id: new ObjectId(id as string) });

		if (String(studio?.ownerId) !== String(ownerId)) {
			return res.status(401).json({ success: false, message: "Unauthorized request!", data: null });
		}

		const updatedStudio = await studioCollection.findOneAndUpdate(
			{ _id: new ObjectId(id as string) },
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
			return res.status(500).json({ success: false, message: "Internal server error", data: null });
		}

		return res
			.status(200)
			.json({ success: true, message: "Studio updated successfully.", data: updatedStudio });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error", data: null });
	}
};
