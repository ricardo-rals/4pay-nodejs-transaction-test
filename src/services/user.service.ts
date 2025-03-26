import { v4 as uuidv4 } from 'uuid';
import { Mutex } from 'async-mutex';
import { readData, writeData } from '../utils/database';
import { IUser, IUserService } from '../interfaces/IUser';
import { userSchema } from '../models/user.model';
import { z } from 'zod';
export class UserService implements IUserService {
  private mutex = new Mutex();
  async createUser(name: string, cpf: string, initialBalance?: number): Promise<IUser> {
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
        balance: initialBalance ?? 0,
        transactions: [],
      };
      try {
        userSchema.parse(newUser);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const firstError = error.errors[0];
          throw new Error(firstError.message);
        }
        throw error;
      }
      data.users.push(newUser);
      await writeData(data);
      return newUser;
    } finally {
      release();
    }
  }

  async deposit(id: string, amount: number): Promise<IUser> {
    const release = await this.mutex.acquire();
    try {
      const data = await readData();
      const userIndex = data.users.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      const user = data.users[userIndex];
      const newBalance = user.balance + amount;
      if (newBalance > 1_000_000) {
        throw new Error('Deposit amount exceeds the maximum allowed');
      }
      if (amount <= 0) {
        throw new Error('Deposit amount must be positive or greater than zero');
      }
      user.balance = newBalance;
      user.transactions.push({
        id: uuidv4(),
        type: 'deposit',
        amount,
        date: new Date().toISOString()
      });
      await writeData(data);
      return user;
    }finally {
      release();
    }
  }

  async withdraw(id: string, amount: number): Promise<IUser> {
    const release = await this.mutex.acquire();
    try {
      const data = await readData();
      const userIndex = data.users.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      const user = data.users[userIndex];
      if (user.balance < amount) {
        throw new Error('Insufficient funds');
      }
      if (amount <= 0) {
        throw new Error('Invalid withdrawal amount');
      }
      user.balance -= amount;
      user.transactions.push({
        id: uuidv4(),
        type: 'withdraw',
        amount,
        date: new Date().toISOString()
      });
      await writeData(data);
      return user;
    } finally {
      release();
    }
  }
  async getUser(id: string): Promise<IUser | undefined> {
    const data = await readData();
    return data.users.find((user) => user.id === id);
  }
  async getStatement(id: string): Promise<IUser['transactions']> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user.transactions;
  }
}