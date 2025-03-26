import { z } from 'zod';
import { userSchema } from '../models/user.model';

export type IUser = z.infer<typeof userSchema>;

export interface IUserService {
  createUser(name: string, cpf: string, initialBalance: number): Promise<IUser>;
  getUser(id: string): Promise<IUser | undefined> ;
  deposit(id: string, amount: number): Promise<IUser>;
  withdraw(id: string, amount: number): Promise<IUser>;
  getStatement(id: string): Promise<IUser['transactions']>;
}