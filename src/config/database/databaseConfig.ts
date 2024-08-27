import mongoose from 'mongoose';

import logger from '../../app/utils/logger';

import { MongoURI, LocalMongoURI } from './keys';

export function init() {
	const database = process.env.STAGE === 'prd' ? MongoURI : LocalMongoURI;

	mongoose
		.connect(database)
		.then(() => {
			logger.info('Database connected');
		})
		.catch((err) => {
			logger.error('Database connection error:', err);
		});
}

export default { init };
