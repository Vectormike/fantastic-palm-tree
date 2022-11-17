import httpStatus from 'http-status';
import ApiError from '../helpers/ApiError';
import utilities from '../utilities';
import { LoginUserInput } from '../interfaces/auth.interface';
import { userArray } from './userArray';
import logger from '../config/logger';

const loginUserWithEmailAndPassword = async (userDto: LoginUserInput) => {
	const { email, password } = userDto;

	// Check if userDto.email exists in userArray
	logger.info('Checking if user exists');
	const userExists = userArray.find((user: any) => user.email === email);
	if (!userExists) throw new ApiError(httpStatus.BAD_REQUEST, 'User information is incorrect.');

	// Check if userDto.password corresponds to userExists.password
	logger.info('Checking if password is correct');
	const validPassword = await utilities.comparePassword(password, userExists.password);
	if (!validPassword) throw new ApiError(httpStatus.BAD_REQUEST, 'User information is incorrect.');

	const { password: _, ...user } = userExists;

	return user;
};

export default { loginUserWithEmailAndPassword };
