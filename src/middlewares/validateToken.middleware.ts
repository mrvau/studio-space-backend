import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, errors, jwtVerify } from "jose";
import { Payload } from "../types/index.js";

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
	const authorization = req.headers.authorization;
	const [scheme, token, ...extraParts] = authorization?.trim().split(/\s+/) ?? [];

	if (scheme?.toLowerCase() !== "bearer" || !token || extraParts.length > 0) {
		return res.status(401).json({ success: false, message: "Unauthorized request!", data: null });
	}

	try {
		const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));

		const { payload } = await jwtVerify<Payload>(token, JWKS);

		req.payload = payload;

		return next();
	} catch (error) {
		if (
			error instanceof errors.JWTExpired ||
			error instanceof errors.JWTClaimValidationFailed ||
			error instanceof errors.JWTInvalid ||
			error instanceof errors.JWSInvalid ||
			error instanceof errors.JWSSignatureVerificationFailed ||
			error instanceof errors.JWEInvalid ||
			error instanceof errors.JWEDecryptionFailed
		) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized request!",
				data: null,
			});
		}

		throw error;
	}
};

export default validateToken;
