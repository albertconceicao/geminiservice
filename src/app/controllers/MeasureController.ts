import { Request, Response } from 'express';

import { MeasuresRepository } from '../repositories/MeasuresRepository';
import {
	base64ImageisNotValid,
	customerNotFound,
	generalServerError,
	mandatoryFieldsRequired,
	measureAlreadyExists,
	measureTypeIsNotValid,
} from '../utils/errors';
import { isValidBase64Image } from '../utils/isValidBase64';
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
			if (!isValidBase64Image(image)) {
				logger.error('create :: Error :: ', base64ImageisNotValid.message);
				return res
					.status(StatusCode.BAD_REQUEST)
					.json({ error: base64ImageisNotValid, fields: requiredFields });
			}
			console.log({ measure_type });
			if (
				measure_type.toLowerCase() !== 'water' &&
				measure_type.toLowerCase() !== 'gas'
			) {
				return res
					.status(StatusCode.BAD_REQUEST)
					.json({ error: measureTypeIsNotValid, fields: requiredFields });
			}

			const measureExists =
				await MeasuresRepositoryFunction.findByMeasureType(measure_type);

			if (measureExists && measureExists.date === measure_datetime) {
				logger.error('create :: Error :: ', measureAlreadyExists.message);
				logger.debug('create :: Error :: Email :', measure_type);
				return res.status(StatusCode.BAD_REQUEST).json(measureAlreadyExists);
			}

			const measure_value = await GeminiControllerFunction.readImage(image);
			console.log('here');
			const measure = await MeasuresRepositoryFunction.create({
				image,
				customer_code,
				measure_datetime,
				measure_type,
				measure_value: measure_value!.measureValue,
			});
			res.json({ image_url: measure_value!.image_url, measure_id: measure.id });
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
		const { measure_value } = req.body;

		try {
			const requiredFields = verifyRequiredFields({
				measure_uuid,
				measure_value,
			});
			const measureExists =
				await MeasuresRepositoryFunction.findById(measure_uuid);

			if (!measureExists) {
				return res.status(StatusCode.NOT_FOUND).json({
					error_code: 'MEASURE_NOT_FOUND"',
					error: 'Leitura do mês já realizada',
				});
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
				measure_value,
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
