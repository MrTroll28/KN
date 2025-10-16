import { Router } from 'express';
import { loginValidators, postLogin } from '../controllers/auth.controller.js';
const router = Router();

router.post('/login', loginValidators, postLogin);
export default router;
