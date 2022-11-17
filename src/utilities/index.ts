import jwt from 'jsonwebtoken';
import moment from 'moment';
import Env from '../helpers/env';
import bcrypt from 'bcryptjs';

const key = process.env.JWT_AUTH_SECRET || 'mysecret';
const accessTokenExpiresMinutes = Env.get('ACCESSTOKENEXPIRESMINUTES');
const refreshTokenExpiresDays = Env.get('REFRESHTOKENEXPIRESDAYS');

const comparePassword = async (password: string, hash: string) => {
	return bcrypt.compare(password, hash);
};

// JWT Helpers
const generateToken = (_id: string, type: string, expiration: any, key: jwt.Secret) => {
	const payload = {
		_id,
		iat: moment().unix(),
		exp: expiration.unix(),
		type,
	};

	return jwt.sign(payload, key);
};

const generateLoginToken = (user: any) => {
	const { _id } = user;
	const accessExpiration = moment().add(accessTokenExpiresMinutes, 'minutes');
	const accessToken = generateToken(_id, 'access', accessExpiration, key);

	const refreshExpiration = moment().add(refreshTokenExpiresDays, 'days');
	const refreshToken = generateToken(_id, 'refresh', refreshExpiration, key);

	return {
		access: {
			token: accessToken,
			expires: accessExpiration.local().format('YYYY-MM-DD HH:mm:ss'),
		},
		refresh: {
			token: refreshToken,
			expires: refreshExpiration.local().format('YYYY-MM-DD HH:mm:ss'),
		},
	};
};

export default {
	comparePassword,
	generateLoginToken,
};
