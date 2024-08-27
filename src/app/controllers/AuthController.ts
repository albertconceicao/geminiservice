import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { CustomersRepository } from '../repositories/CustomersRepository';

const CustomersRepositoryFunction = new CustomersRepository();

const SECRET = process.env.JWT_SECRET as string;

export class AuthController {
	async login(request: any, response: any) {
		const { email, password } = request.body;

		const customer = await CustomersRepositoryFunction.findByEmail(email);

		if (!customer) {
			return response.status(401).json({
				error: 'Usuário não encontrado',
				data: {
					email,
				},
			});
		}

		const validatedPassword = bcrypt.compareSync(password, customer.password);

		if (!validatedPassword) {
			return response.status(401).json({
				error: 'Não autorizado!',
			});
		}

		const token = jwt.sign(
			{ name: customer.name, email: customer.email },
			SECRET,
			{
				expiresIn: '30s',
			},
		);
		response.json({
			statusCode: 200,
			message: 'Usuário logado com sucesso!',
			data: {
				token,
			},
		});
	}

	async verifyToken(request: any, response: any, next: any) {
		const tokenHeader = request.headers.authorization;
		const token = tokenHeader && tokenHeader.split(' ')[1];

		if (!token) {
			return response.status(401).json({
				error: 'Não autorizado!',
			});
		}

		try {
			jwt.verify(token, SECRET);
			next();
		} catch (error) {
			response.status(401).json({
				statusCode: 401,
				message: 'Token inválido',
				error,
			});
		}
	}
}
