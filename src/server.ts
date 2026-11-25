import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db/db.js";

const PORT = 8000;

const startServer = async () => {
	await connectDB();

	await new Promise<void>((resolve, reject) => {
		const server = app.listen(PORT, () => {
			console.log(`Server running at port ${PORT}`);
			resolve();
		});

		server.once("error", reject);
	});
};

startServer().catch((error: unknown) => {
	const errorName = error instanceof Error ? error.name : "UnknownError";
	console.error("Failed to start StudioSpace API", { errorName });
	process.exit(1);
});
