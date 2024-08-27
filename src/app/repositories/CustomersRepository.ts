// Connect with Data Source
import mongoose from 'mongoose';

import '../models/User';
import logger from '../utils/logger';

const User = mongoose.model('customers');

interface ICustomer {
	id?: string;
	name: string;
	email: string;
	phone: string;
	password?: string;
}

export class CustomersRepository {
	// TODO: include the Type of return inside Promise returned from functions
	async findAll(orderBy?: string): Promise<any> {
		const direction = orderBy?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

		return User.find({}).sort({ id: direction.toLowerCase() as any });
	}

	async findById(id: string): Promise<any> {
		return User.findOne({ _id: id });
	}

	async findByEmail(email: string): Promise<any> {
		return User.findOne({ email }).then((user) => user);
	}

	async create({ name, email, phone, password }: ICustomer): Promise<any> {
		return User.create({ name, email, phone, password });
	}

	// TODO: remove the validation, and the two step database update (find and save) have to be implemented separately
	// TODO: also delegates the error handling to controller
	async update(id: string, { name, email, phone }: ICustomer): Promise<any> {
		const updatedUser = await User.findOne({ _id: id }).then((user) => {
			if (user) {
				user.name = name;
				user.email = email;
				user.phone = phone;
				user
					.save()
					.then((responseUpdatedUser: string) => responseUpdatedUser)
					.catch((error: Error) =>
						logger.error('Erro ao atualizar cliente', error),
					);
			}
		});

		return updatedUser;
	}

	async delete(id: string): Promise<any> {
		return User.findOneAndDelete({ _id: id });
	}
}
