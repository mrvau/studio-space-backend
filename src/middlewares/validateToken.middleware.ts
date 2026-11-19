import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).json({ success: false, message: "Unauthorized request!", data: null });
	}

	const [_, token] = authorization.split(" ");

	try {
		const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));

		const { payload } = await jwtVerify(token, JWKS);

		if (!payload) {
			return res.status(401).json({ success: false, message: "Unauthorized request!", data: null });
		}

		req.payload = payload;

		next();
	} catch (error) {
		console.error(error);
		return res.status(401).json({ success: false, message: "Unauthorized request!", data: null });
	}
};

export default validateToken;
