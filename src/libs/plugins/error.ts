export class UnreachableError extends Error {
	static {
		this.prototype.name = "UnreachableError";
	}
}

export function unreachable(): never {
	throw new UnreachableError();
}
