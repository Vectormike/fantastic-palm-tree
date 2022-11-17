import mongoose, { ConnectOptions } from 'mongoose';
import logger from './logger';
import env from '../helpers/env';

const db: string = env.get('MONGOURI');

const connectDB = () => {
	mongoose
		.connect(db, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		} as ConnectOptions)
		.then(() => logger.info('Database connected'))
		.catch((err: { message: any }) => logger.error(err.message || 'Database connection failed'));
};

export default connectDB;
