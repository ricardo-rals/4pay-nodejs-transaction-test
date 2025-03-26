import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { createUserSchema, transactionSchema } from '../validations/userValidations';
import { IUser } from '../interfaces/IUser';

export class UserController {
  private static userService = new UserService();
  // remover o any para usar o IUser
  static async createUser(req: Request, res: Response): Promise<void>{
    try {
      const { nome, cpf } = createUserSchema.parse(req.body);
      const user = await UserController.userService.createUser(nome, cpf);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async deposit(req: Request, res: Response): Promise<void>{
    try {
      const { id, amount } = transactionSchema.parse(req.body);
      const user = await UserController.userService.deposit(id, amount);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}