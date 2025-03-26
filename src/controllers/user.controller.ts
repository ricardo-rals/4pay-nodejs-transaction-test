import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { createUserSchema, createTransactionSchema } from '../models/user.model';

export class UserController {
  private static userService = new UserService();
  static async createUser(req: Request, res: Response): Promise<void>{
    try {
      const { name, cpf } = createUserSchema.parse(req.body);
      const user = await UserController.userService.createUser(name, cpf);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async deposit(req: Request, res: Response): Promise<void>{
    try {
      const { amount } = createTransactionSchema.parse(req.body);
      const user = await UserController.userService.deposit(req.params.id, amount);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async withdraw(req: Request, res: Response): Promise<void> {
    try {
      const { amount } = createTransactionSchema.parse(req.body);
      const user = await UserController.userService.withdraw(req.params.id, amount);
      res.json(user);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getStatement(req: Request, res: Response): Promise<void>{
    try {
      const statement = await UserController.userService.getStatement(req.params.id);
      res.json(statement);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}