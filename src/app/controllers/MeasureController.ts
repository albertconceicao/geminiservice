import { Request, Response } from 'express';

import { MeasuresRepository } from '../repositories/MeasuresRepository';
import {
	customerNotFound,
	emailAlreadyExists,
	generalServerError,
	mandatoryFieldsRequired,
} from '../utils/errors';
import logger from '../utils/logger';
import { StatusCode } from '../utils/statusCodes';
import { verifyRequiredFields } from '../utils/validations';

import { GeminiController } from './GeminiController';

const MeasuresRepositoryFunction = new MeasuresRepository();
const GeminiControllerFunction = new GeminiController();

export class MeasureController {
	/** ------------------------------------------------------------------------------
	 * @function list
	 * @param req
	 * @param res
	 */
	async list(req: Request, res: Response) {
		logger.info('list >> Start >>');

		const orderBy: string | undefined = req.query.orderBy
			? String(req.query.orderBy)
			: undefined;

		try {
			const measures = await MeasuresRepositoryFunction.findAll(orderBy);
			logger.info('list << End <<');
			res.status(StatusCode.FOUND).json(measures);
		} catch (error) {
			logger.error('list :: Error :: ', error);
			res.status(StatusCode.INTERNAL_SERVER_ERROR).json(generalServerError);
		}
	}

	/**
	 * @function find
	 * @param req
	 * @param res
	 */
	async find(req: Request, res: Response) {
		logger.info('find >> Start >>');
		// List a specific records
		const { id } = req.params;
		logger.debug('id: ', id);
		try {
			const measure = await MeasuresRepositoryFunction.findById(id);

			if (!measure) {
				return res.status(404).json({ error: 'User not found' });
			}
			logger.info('find << End <<');
			res.status(StatusCode.SUCCESS).json(measure);
		} catch (error) {
			logger.error('find :: Error :: ', error);
			res.status(StatusCode.INTERNAL_SERVER_ERROR).json(generalServerError);
		}
	}

	/** ------------------------------------------------------------------------------
	 * @function create
	 * @param req
	 * @param res
	 */
	async create(req: Request, res: Response) {
		logger.info('create >> Start');
		// Create a new records
		const { image, customer_code, measure_datetime, measure_type } = req.body;
		logger.debug(
			`image: ${image} , customer_code: ${customer_code}, measure_datetime: ${measure_datetime}, measure_type: ${measure_type}`,
		);
		const requiredFields = verifyRequiredFields({
			image,
			customer_code,
			measure_datetime,
			measure_type,
		});

		try {
			if (requiredFields.length > 0) {
				logger.error('create :: Error :: ', mandatoryFieldsRequired.message);
				logger.debug('create :: Error :: Fields ', requiredFields);
				return res
					.status(StatusCode.BAD_REQUEST)
					.json({ error: mandatoryFieldsRequired, fields: requiredFields });
			}

			const measure_value = await GeminiControllerFunction.readImage(image);

			res.json({ measure_value });
			// const measureExists =
			// 	await MeasuresRepositoryFunction.findByMeasureType(measure_type);

			// if (measureExists) {
			// 	logger.error('create :: Error :: ', emailAlreadyExists.message);
			// 	logger.debug('create :: Error :: Email :', measure_type);
			// 	return res.status(StatusCode.BAD_REQUEST).json(emailAlreadyExists);
			// }
			// const measure = await MeasuresRepositoryFunction.create({
			// 	image,
			// 	customer_code,
			// 	measure_datetime,
			// 	measure_type,
			// });
			logger.info('create << End <<');
			// res.json(measure);
		} catch (error) {
			logger.error('create :: Error :: ', error);
			res.status(StatusCode.INTERNAL_SERVER_ERROR).json(generalServerError);
		}
	}

	/** ------------------------------------------------------------------------------
	 * @function update
	 * @param req
	 * @param res
	 */
	async update(req: Request, res: Response) {
		logger.info('update >> Start >>');
		// Update a specific records
		const { measure_uuid } = req.params;
		const { confirmed_value } = req.body;

		try {
			const measureExists =
				await MeasuresRepositoryFunction.findById(measure_uuid);
			const requiredFields = verifyRequiredFields({
				measure_uuid,
				confirmed_value,
			});

			if (!measureExists) {
				return res
					.status(StatusCode.NOT_FOUND)
					.json({ error: 'customer not found' });
			}
			if (requiredFields.length > 0) {
				logger.error('update :: Error :: ', mandatoryFieldsRequired.message);
				logger.debug('update :: Error :: Fields ', requiredFields);
				return res
					.status(StatusCode.BAD_REQUEST)
					.json({ error: mandatoryFieldsRequired, fields: requiredFields });
			}
			const measureByUUID =
				await MeasuresRepositoryFunction.findByEmail(measure_uuid);

			if (measureByUUID && measureByUUID._id !== measure_uuid) {
				logger.error('update :: Error :: ', emailAlreadyExists.message);
				logger.debug('update :: Error :: Email :', measure_uuid);
				return res.status(StatusCode.BAD_REQUEST).json(emailAlreadyExists);
			}

			const measure = await MeasuresRepositoryFunction.update(measure_uuid, {
				confirmed_value,
			});

			logger.info('update << End <<');
			res.json(measure);
		} catch (error) {
			logger.error('update :: Error :: ', error);
			res.status(StatusCode.INTERNAL_SERVER_ERROR).json(generalServerError);
		}
	}

	/** ------------------------------------------------------------------------------
	 * @function delete
	 * @param req
	 * @param res
	 */
	async delete(req: Request, res: Response) {
		logger.info('delete >> Start >>');
		// Delete a specific records
		const { id } = req.params;
		try {
			const customer = await MeasuresRepositoryFunction.findById(id);

			if (!customer) {
				return res.status(StatusCode.BAD_REQUEST).json(customerNotFound);
			}
			await MeasuresRepositoryFunction.delete(id);
			logger.info('delete << End <<');
			res.sendStatus(StatusCode.NO_CONTENT);
		} catch (error) {
			logger.error('delete :: Error :: ', error);
			res.status(StatusCode.INTERNAL_SERVER_ERROR).json(generalServerError);
		}
	}

	/** ------------------------------------------------------------------------------
	 * @function authenticatedRoute
	 * @param req
	 * @param res
	 */
	async authenticatedRoute(req: Request, res: Response) {
		res.json({
			statusCode: StatusCode.SUCCESS,
			message: 'Authenticated',
		});
	}
}
