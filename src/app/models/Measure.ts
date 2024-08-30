import mongoose, { Schema } from 'mongoose';

const Measure: any = new Schema(
	{
		measure_uuid: mongoose.Schema.Types.ObjectId,
		image: {
			type: String,
			required: true,
		},
		customer_code: {
			type: String,
			required: true,
		},
		measure_datetime: {
			type: Date,
			required: true,
		},
		measure_type: {
			type: String,
			required: false,
			enum: ['WATER', 'GAS'],
		},
		measure_value: {
			type: String,
			required: true,
		},
		confirmed_value: {
			type: Boolean,
			required: false,
		},
		created_at: {
			type: Date,
			default: new Date(),
		},
	},
	{
		timestamps: true,
	},
);

mongoose.model('measures', Measure);
