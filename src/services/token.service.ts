import ApiError from '../helpers/ApiError';
import Token from '../models/token.model';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import Env from '../helpers/env';
/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId: string, expires: any, type: string, secret: string = Env.get('JWT_AUTH_SECRET')) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token: string, userId: string, expires: any, type: string, blacklisted: boolean = false) => {
	const tokenDoc = await Token.create({
		token,
		user: userId,
		expires: expires.toDate(),
		type,
		blacklisted,
	});
	return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user: { id: string }) => {
	const accessTokenExpires = moment().add(Env.get('ACCESSTOKENEXPIRESMINUTES'), 'minutes');
	const accessToken = generateToken(user.id, accessTokenExpires, 'access');

	const refreshTokenExpires = moment().add(Env.get('REFRESHTOKENEXPIRESDAYS'), 'days');
	const refreshToken = generateToken(user.id, refreshTokenExpires, 'refresh');

	// await saveToken(refreshToken, user.id, refreshTokenExpires, 'refresh');

	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	};
};

export default { generateAuthTokens };
