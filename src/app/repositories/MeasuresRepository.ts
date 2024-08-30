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
	measure_value?: string;
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

	async findByMeasureType(measure_type: string): Promise<any> {
		return Measure.findOne({ measure_type }).then((measure) => measure);
	}

	async create({
		image,
		customer_code,
		measure_datetime,
		measure_type,
		measure_value,
	}: IMeasure): Promise<any> {
		return Measure.create({
			image,
			customer_code,
			measure_datetime,
			measure_type,
			measure_value,
		}).then((measure) => measure.id);
	}

	// TODO: remove the validation, and the two step database update (find and save) have to be implemented separately
	// TODO: also delegates the error handling to controller
	async update(id: string, measure_value: IMeasure): Promise<any> {
		const updatedMeasure = await Measure.findOne({ _id: id }).then(
			(measure: any) => {
				if (measure) {
					measure.measure_value = measure_value;
					measure.confirmed_value = true;
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
