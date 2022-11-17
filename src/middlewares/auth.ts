import { NextFunction } from 'express';
import jwt, { JwtHeader, JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import logger from '../config/logger';
import Env from '../helpers/env';

const key = Env.get('JWT_AUTH_SECRET');

const verifyToken = (req: any, res: any, next: NextFunction) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return res.status(httpStatus.UNAUTHORIZED).send({
			status: 'error',
			message: 'Please sign in or create an account',
		});
	}

	const tokenBearer = req.headers.authorization.split(' ')[1];

	const token = req.get('x-access-token') || tokenBearer || authorization;

	if (!token) {
		return res.status(httpStatus.UNAUTHORIZED).send({
			status: 'error',
			message: 'Please sign in or create an account',
		});
	}

	const XSRFToken = req.get('XSRF-TOKEN') || req.cookies._csrf;
	if (!XSRFToken) {
		return res.status(httpStatus.UNAUTHORIZED).send({
			status: 'error',
			message: 'Please sign in or create an account',
		});
	}

	try {
		const decoded = jwt.verify(token, key);
		req.user = decoded;
		next();
	} catch (error) {
		logger.error(error);
		return res.status(httpStatus.FORBIDDEN).send({
			status: 'error',
			message: 'You are not authorized to access this resource',
		});
	}
};

export default { verifyToken };
