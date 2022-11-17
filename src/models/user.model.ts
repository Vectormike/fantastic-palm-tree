import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

export interface fields {
	id: mongoose.Types.ObjectId;
	email: string;
	password: string;
	isEmailTaken: isEmailTakenFunction;
}

export type userModel = mongoose.Document & fields;

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			immutable: true,
			validate(value: string) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid Email');
				}
			},
			required: true,
		},
		password: {
			type: String,
			minlength: 6,
			required: true,
		},
	},
	{ timestamps: true }
);

type isEmailTakenFunction = (userEmail: string) => Promise<boolean>;

// Hash the password before saving
userSchema.pre<userModel>('save', async function (next: any) {
	if (!this.isModified('password')) {
		return next();
	}
	const salt = await bcrypt.genSalt(10);
	const hash = bcrypt.hashSync(this.password, salt);
	this.password = hash;
	next();
});

// Check if email is taken
const isEmailTaken: isEmailTakenFunction = async (userEmail: string) => {
	const user = await User.findOne({ userEmail });
	return !!user;
};

userSchema.statics.isEmailTaken = isEmailTaken;

const User: Model<userModel> = mongoose.model<userModel>('User', userSchema);

export default User;
