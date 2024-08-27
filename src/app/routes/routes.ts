// The router purpose is to send the requests to Controllers and activate his methods. The Controller will connect with Repository, that will connect with Data Source and return to Controller the result

import { Router } from 'express';

import { AuthController } from '../controllers/AuthController';
import { CustomerController } from '../controllers/CustomerController';

const CustomerControllerFunction = new CustomerController();
const AuthControllerFunction = new AuthController();

export const router = Router();

router.get(
	'/customers',
	AuthControllerFunction.verifyToken,
	CustomerControllerFunction.list,
);
router.get('/customers/:id', CustomerControllerFunction.find);
router.delete('/customers/:id', CustomerControllerFunction.delete);
router.post('/customers/', CustomerControllerFunction.create);
router.put('/customers/:id', CustomerControllerFunction.update);

router.post('/login', AuthControllerFunction.login);
router.post(
	'/authenticatedRoute',
	AuthControllerFunction.verifyToken,
	CustomerControllerFunction.list,
);
