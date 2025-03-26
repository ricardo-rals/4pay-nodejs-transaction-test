import { v4 as uuidv4 } from 'uuid';
import { Mutex } from 'async-mutex';
import { readData, writeData } from '../utils/database';
import { IUser, IUserService } from '../interfaces/IUser';
import { userSchema } from '../models/user.model';

export class UserService implements IUserService {
  private mutex = new Mutex();
  async createUser(name: string, cpf: string, initialBalance: number = 0): Promise<IUser> {
    const release = await this.mutex.acquire();
    try {
      const data = await readData();
      const cpfExists = data.users.some((user => user.cpf === cpf));
      if (cpfExists) {
        throw new Error('CPF already exists');
      }
      const newUser: IUser = {
        id: uuidv4(),
        name,
        cpf,
        balance: initialBalance,
        transactions: [],
      };
      userSchema.parse(newUser);
      data.users.push(newUser);
      await writeData(data);
      return newUser;
    } finally {
      release();
    }
  }

  getUser(id: string): Promise<IUser> | undefined {
    throw new Error('Method not implemented.');
  }
  deposit(id: string, amount: number): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
  withdraw(id: string, amount: number): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
  getStatement(id: string): Promise<IUser['transactions']> {
    throw new Error('Method not implemented.');
  }
}