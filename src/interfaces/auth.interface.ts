export interface LoginUserInput {
	email: string;
	password: string;
	fcmToken?: string;
}

export interface RegisterUserInput {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone: string;
}

export interface resetPasswordInput {
	email: string;
	password: string;
	token: string;
}
