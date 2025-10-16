import { body, validationResult } from 'express-validator';
import { createUser, listUsers } from '../services/users.service.js';

export const createUserValidators = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  body('name').optional().isString(),
  body('role').optional().isIn(['USER','ADMIN'])
];

export async function getUsers(req, res, next) {
  try { res.json(await listUsers()); } catch (e) { next(e); }
}

export async function postUser(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const user = await createUser(req.body);
    res.status(201).json({ id: user.id });
  } catch (e) { next(e); }
}
