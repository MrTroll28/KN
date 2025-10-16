import { login } from '../services/auth.service.js';
import { body, validationResult } from 'express-validator';

export const loginValidators = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 })
];

export async function postLogin(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const data = await login(email, password);
    res.json(data);
  } catch (e) { next(e); }
}
