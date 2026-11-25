import type { JWTPayload } from "jose";

export interface Payload extends JWTPayload {
	id: string;
	name: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			payload: Payload;
		}
	}
}
