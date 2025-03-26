import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { createUserSchema } from '../validations/userValidations';
import { IUser } from '../interfaces/IUser';

export class UserController {
  private static userService = new UserService();
  // remover o any para usar o IUser
  static async createUser(req: Request, res: Response): Promise<any>{
    try {
      const { nome, cpf } = createUserSchema.parse(req.body);
      const user = await UserController.userService.createUser(nome, cpf);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

}