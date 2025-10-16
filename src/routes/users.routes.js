import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createUserValidators, getUsers, postUser } from '../controllers/users.controller.js';
const router = Router();

router.use(authenticate, authorize('ADMIN'));
router.get('/', getUsers);
router.post('/', createUserValidators, postUser);

export default router;
