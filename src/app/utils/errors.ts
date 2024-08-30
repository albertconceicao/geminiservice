// VAL - validation errors
// SEC - for security errors or blocks
// GEN - for general server errors

export const customerNotFound = {
	code: 'ERR-001-VAL',
	message: 'customer not found in the database, please fix it and try again',
	shortMessage: 'customerNotFound',
};

export const mandatoryFieldsRequired = {
	code: 'ERR-002-VAL',
	message: 'mandatory fields required must be provided',
	shortMessage: 'mandatoryFieldsRequired',
};

export const base64ImageisNotValid = {
	code: 'ERR-002-VAL',
	message: 'base64 image is not valid and is missing data:image/type',
	shortMessage: 'base64ImageIsNotValid',
};

export const measureTypeIsNotValid = {
	code: 'ERR-002-VAL',
	message: 'measure_type would need to be water or gas',
	shortMessage: 'measureTypeIsNotValid',
};

export const measureAlreadyExists = {
	code: 'ERR-003-VAL',
	message: 'This measure already exists in the database at the specified month',
	shortMessage: 'measureAlreadyExists',
};

export const generalServerError = {
	code: 'ERR-004-GEN',
	message: 'General server error',
	shortMessage: 'generalServerError',
};
