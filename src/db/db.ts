import { Db, MongoClient } from "mongodb";

let db: Db | null = null;

export const connectDB = async () => {
	const client = new MongoClient(process.env.MONGODB_URI as string);
	try {
		await client.connect();
		db = client.db("studio-space-db");
		console.log("Successfully connected to MongoDB.");

		return client;
	} catch (error) {
		console.dir(error);
		process.exit(1);
	}
};

export const getCollection = (name: string) => {
	if (!db) throw new Error("Database is not initialized. Call connectDB first.");
	return db.collection(name);
};
