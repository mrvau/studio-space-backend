import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { Payload } from "../types/index.js";

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ success: false, message: "Unauthorized request!", data: null });
	}

	try {
		const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));

		const { payload } = await jwtVerify<Payload>(token, JWKS);

		if (!payload) {
			return res.status(401).json({ success: false, message: "Unauthorized request!", data: null });
		}

		req.payload = payload;

		next();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error!", data: null });
	}
};

export default validateToken;
