import express from 'express';
import { UserController } from '../controllers/user.controller';

const router = express.Router();
router.post('/users', UserController.createUser);
export default router;
