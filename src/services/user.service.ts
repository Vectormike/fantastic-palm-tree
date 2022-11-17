import { CreateUserInput } from '../interfaces/user.interface';
import ApiError from '../helpers/ApiError';
import httpStatus from 'http-status';
import logger from '../config/logger';
import bcrypt from 'bcryptjs';
import { userArray } from './userArray';

/**
 * Create a user
 * @param userDto
 * @returns
 */
const createUser = async (userDto: CreateUserInput) => {
	let userObject: {
		email: string;
		password: string;
	};

	// Check if userDto.email exists in userArray
	logger.info('Checking if user exists');
	const userExists = userArray.find((user: any) => user.email === userDto.email);
	if (userExists) throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(userDto.password, salt);

	// Save user to javascript object
	userObject = {
		email: userDto.email,
		password: hashedPassword,
	};

	userArray.push(userObject);

	// Remove password from user object
	const { password, ...user } = userObject;

	return user;
};

const getUser = async (email: string) => {
	// Check if userDto.email exists in userArray
	logger.info('Checking if user exists');
	const userExists = userArray.find((user: any) => user.email === email);
	if (!userExists) throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');

	// Remove password from user object
	const { password, ...user } = userExists;

	return user;
};

export default { createUser, getUser };
