// Connect with Data Source
import mongoose from 'mongoose';

import '../models/Measure';
import logger from '../utils/logger';

const Measure = mongoose.model('measures');

interface IMeasure {
	image: string;
	customer_code: string;
	measure_datetime: Date;
	measure_type: 'WATER' | 'GAS';
	confirmed_value?: number;
}

export class MeasuresRepository {
	// TODO: include the Type of return inside Promise returned from functions
	async findAll(orderBy?: string): Promise<any> {
		const direction = orderBy?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

		return Measure.find({}).sort({ id: direction.toLowerCase() as any });
	}

	async findById(id: string): Promise<any> {
		return Measure.findOne({ _id: id });
	}

	async findByEmail(customer_code: string): Promise<any> {
		return Measure.findOne({ customer_code }).then((measure) => measure);
	}

	async create({
		image,
		customer_code,
		measure_datetime,
		measure_type,
	}: IMeasure): Promise<any> {
		return Measure.create({
			image,
			customer_code,
			measure_datetime,
			measure_type,
		});
	}

	// TODO: remove the validation, and the two step database update (find and save) have to be implemented separately
	// TODO: also delegates the error handling to controller
	async update(
		id: string,
		{ image, customer_code, measure_datetime }: IMeasure,
	): Promise<any> {
		const updatedMeasure = await Measure.findOne({ _id: id }).then(
			(measure: any) => {
				if (measure) {
					measure.image = image;
					measure.customer_code = customer_code;
					measure.measure_datetime = measure_datetime;
					measure
						.save()
						.then((responseUpdatedMeasure: string) => responseUpdatedMeasure)
						.catch((error: Error) =>
							logger.error('Erro ao atualizar cliente', error),
						);
				}
			},
		);

		return updatedMeasure;
	}

	async delete(id: string): Promise<any> {
		return Measure.findOneAndDelete({ _id: id });
	}
}
