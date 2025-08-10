/**
 * Creates a key from the given arguments by joining them with a dash.
 * @param args
 */
export function joinKeyResolver(...args: any[]): string {
	return args.join('-');
}

/**
 * Creates a key from the given arguments by converting them to JSON.
 * @param args
 */
export function jsonKeyResolver(...args: any[]): string {
	return JSON.stringify(args);
}
