import express, { ErrorRequestHandler, RequestHandler } from "express";
import cors from "cors";

import { globalRouter } from "./routes/routes.js";
import { HttpError } from "./errors/http-error.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", globalRouter);

const notFoundHandler: RequestHandler = (req, _res, next) => {
	next(new HttpError(404, `Route ${req.method} ${req.path} not found.`));
};

const errorHandler: ErrorRequestHandler = (error: unknown, req, res, _next) => {
	const parseError =
		error instanceof SyntaxError &&
		typeof error === "object" &&
		"type" in error &&
		error.type === "entity.parse.failed";
	const knownError = error instanceof HttpError ? error : null;
	const status = parseError ? 400 : (knownError?.status ?? 500);
	const message = parseError
		? "Invalid JSON request body."
		: (knownError?.publicMessage ?? "Internal server error.");

	if (status >= 500) {
		const errorName = error instanceof Error ? error.name : "UnknownError";
		console.error("Unexpected API error", {
			method: req.method,
			path: req.path,
			errorName,
		});
	}

	return res.status(status).json({ success: false, message, data: null });
};

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
