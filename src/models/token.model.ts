import mongoose from 'mongoose';

export interface fields {
	userId: mongoose.Types.ObjectId;
	recoveryToken: string;
	verificationToken: string;
	recoverySecret: string;
	verificationSecret: string;
	validationToken: string;
	validationSecret: string;
}

export type tokenModel = mongoose.Document & fields;

const tokenSchema = new mongoose.Schema(
	{
		token: {
			type: String,
			required: true,
			index: true,
		},
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: ['access', 'refresh'],
			required: true,
		},
		expires: {
			type: Date,
			required: true,
		},
		blacklisted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Token = mongoose.model<tokenModel>('Token', tokenSchema);

export default Token;
