import express, { Request, Response } from 'express';
import authRoutes from './auth.router';
import userRoutes from './user.router';
import csrf from 'csurf';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
	return res.send('Bananapie 🚀 ');
});

router.use('/auth', authRoutes);

router.use('/user', userRoutes);

router.use(csrf({ cookie: true }));

router.use(function (req, res, next) {
	res.cookie('XSRF-TOKEN', req.csrfToken());
	next();
});

export default router;
