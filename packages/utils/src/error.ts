class UnreachableError extends Error {
	static {
		this.prototype.name = 'UnreachableError';
	}
}

export const unreachable = (): never => {
	throw new UnreachableError();
};
