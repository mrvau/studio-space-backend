export class HttpError extends Error {
	readonly status: number;
	readonly publicMessage: string;

	constructor(status: number, publicMessage: string) {
		super(publicMessage);
		this.name = "HttpError";
		this.status = status;
		this.publicMessage = publicMessage;
	}
}
