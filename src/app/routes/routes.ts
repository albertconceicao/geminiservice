// The router purpose is to send the requests to Controllers and activate his methods. The Controller will connect with Repository, that will connect with Data Source and return to Controller the result

import { Router } from 'express';

import { AuthController } from '../controllers/AuthController';
import { MeasureController } from '../controllers/MeasureController';

const MeasureControllerFunction = new MeasureController();
const AuthControllerFunction = new AuthController();

export const router = Router();

router.get(
	'/:customercode/list',
	AuthControllerFunction.verifyToken,
	MeasureControllerFunction.list,
);
router.get('/:customercode/list', MeasureControllerFunction.find);
router.post('/upload', MeasureControllerFunction.create);
router.patch('/confirm', MeasureControllerFunction.update);

router.post('/login', AuthControllerFunction.login);
router.post(
	'/authenticatedRoute',
	AuthControllerFunction.verifyToken,
	MeasureControllerFunction.list,
);
