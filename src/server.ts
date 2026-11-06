import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db/db.js";

const PORT = 8000;

const startServer = async () => {
	await connectDB();

	app.listen(PORT, () => {
		console.log(`Server running at port ${PORT}`);
	});
};

startServer();
