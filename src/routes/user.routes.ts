import express from 'express';
import { UserController } from '../controllers/user.controller';

const router = express.Router();
router.post('/users', UserController.createUser);
router.post('/deposit', UserController.deposit);
export default router;
