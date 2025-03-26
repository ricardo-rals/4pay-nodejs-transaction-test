import express from 'express';
import { UserController } from '../controllers/user.controller';

const router = express.Router();
router.post('/users', UserController.createUser);
router.post('/:id/deposit', UserController.deposit);
router.post('/:id/withdraw', UserController.withdraw);
router.get('/:id/statement', UserController.getStatement);
export default router;
