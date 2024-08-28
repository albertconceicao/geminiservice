export function isValidBase64Image(base64String: string) {
	const validTypes = [
		'image/png',
		'image/jpeg',
		'image/webp',
		'image/heic',
		'image/heif',
	];

	// Verifica se a string base64 começa com um dos tipos permitidos
	const isValid = validTypes.some((type) =>
		base64String.startsWith(`data:${type};base64,`),
	);

	return isValid;
}
