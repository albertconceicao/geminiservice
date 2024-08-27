export function verifyRequiredFields(requiredFields: {
	[key: string]: any;
}): string[] {
	return Object.entries(requiredFields)
		.filter(([, value]) => value === undefined || value === null)
		.map(([key]) => key);
}
