import { UserService } from '../services/user.service';
import * as database from '../utils/database';
import { Mutex } from 'async-mutex';
import { IUser } from '../interfaces/IUser';

jest.mock('../utils/database');

describe('UserService', () => {
  let userService: UserService;
  const mockDatabase = {
    users: [] as IUser[],
  };

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    // Default mock configuration
    (database.readData as jest.Mock).mockImplementation(async () => ({
      users: [...mockDatabase.users],
    }));
    (database.writeData as jest.Mock).mockImplementation(async (data) => {
      mockDatabase.users = [...data.users];
    });
    mockDatabase.users = []; // Clear data between tests
  });

  describe('Race Condition Tests', () => {
    it('should handle concurrent deposits correctly', async () => {
      const mockUser: IUser = {
        id: '123',
        name: 'Test User',
        cpf: '123.456.789-00',
        balance: 1000,
        transactions: []
      };

      mockDatabase.users.push(mockUser);
      const deposit1 = userService.deposit('123', 500);
      const deposit2 = userService.deposit('123', 300);
      await Promise.all([deposit1, deposit2]);
      const finalUser = await userService.getUser('123');
      expect(finalUser?.balance).toBe(1800);
    });

    it('should handle concurrent withdrawals correctly', async () => {
      const mockUser: IUser = {
        id: '123',
        name: 'Test User',
        cpf: '123.456.789-00',
        balance: 1000,
        transactions: []
      };

      mockDatabase.users.push(mockUser);
      const withdrawal1 = userService.withdraw('123', 300);
      const withdrawal2 = userService.withdraw('123', 400);
      await Promise.all([withdrawal1, withdrawal2]);
      const finalUser = await userService.getUser('123');
      expect(finalUser?.balance).toBe(300);
    });

    it('should prevent overdraft in concurrent withdrawals', async () => {
      const mockUser: IUser = {
        id: '123',
        name: 'Test User',
        cpf: '123.456.789-00',
        balance: 500,
        transactions: []
      };

      mockDatabase.users.push(mockUser);
      const withdrawal1 = userService.withdraw('123', 300);
      const withdrawal2 = userService.withdraw('123', 400);
      await expect(Promise.all([withdrawal1, withdrawal2]))
        .rejects.toThrow('Insufficient funds');
    });

    it('should handle mixed concurrent operations correctly', async () => {
      const mockUser: IUser = {
        id: '123',
        name: 'Test User',
        cpf: '123.456.789-00',
        balance: 1000,
        transactions: []
      };

      mockDatabase.users.push(mockUser);
      const operations = [
        userService.deposit('123', 500),
        userService.withdraw('123', 300),
        userService.deposit('123', 200),
        userService.withdraw('123', 400)
      ];
      await Promise.all(operations);
      const finalUser = await userService.getUser('123');
      expect(finalUser?.balance).toBe(1000 + 500 - 300 + 200 - 400);
    });
  });

  describe('UserService Core Tests', () => {
    it('should create a user with name and CPF', async () => {
      const user = await userService.createUser('Ricardo Augusto', '123.456.789-00');
      expect(user.name).toBe('Ricardo Augusto');
      expect(user.cpf).toBe('123.456.789-00');
    });

    it('should create a user with initial balance 0', async () => {
      const user = await userService.createUser('Ricardo Augusto', '123.456.789-00');
      expect(user.balance).toBe(0);
    });

    it('should create a user with specified initial balance', async () => {
      const user = await userService.createUser('Ricardo Augusto', '123.456.789-00', 100);
      expect(user.balance).toBe(100);
    });

    it('should deposit a valid amount', async () => {
      const user = await userService.createUser('Ricardo Augusto', '123.456.789-00', 100);
      const updatedUser = await userService.deposit(user.id, 50);
      expect(updatedUser.balance).toBe(150);
    });

    it('should withdraw a valid amount', async () => {
      const user = await userService.createUser('Ricardo Augusto', '123.456.789-00', 100);
      const updatedUser = await userService.withdraw(user.id, 50);
      expect(updatedUser.balance).toBe(50);
    });

    it('should not allow withdrawal greater than balance', async () => {
      const user = await userService.createUser('Ricardo Augusto', '123.456.789-00', 100);
      await expect(userService.withdraw(user.id, 150)).rejects.toThrow('Insufficient funds');
    });

    it('should not allow negative deposit', async () => {
      const user = await userService.createUser('Ricardo Augusto', '123.456.789-00', 100);
      await expect(userService.deposit(user.id, -50)).rejects.toThrow('Deposit amount must be positive or greater than zero');
    });

    it('should not allow negative withdrawal', async () => {
      const user = await userService.createUser('Ricardo Augusto', '123.456.789-00', 100);
      await expect(userService.withdraw(user.id, -50)).rejects.toThrow('Invalid withdrawal amount');
    });

    it('should register transactions correctly with IDs', async () => {
      const user = await userService.createUser('Ricardo Augusto', '123.456.789-00', 100);
      await userService.deposit(user.id, 50);
      const updatedUser = await userService.withdraw(user.id, 25);
      const statement = await userService.getStatement(updatedUser.id);
      expect(statement).toHaveLength(2);
      expect(statement[0].id).toBeDefined();
      expect(statement[1].id).toBeDefined();
      expect(statement[0].type).toBe('deposit');
      expect(statement[0].amount).toBe(50);
      expect(statement[1].type).toBe('withdraw');
      expect(statement[1].amount).toBe(25);
    });

    it('should maintain consistency with rapid sequential operations', async () => {
      const user = await userService.createUser('Sequential User', '123.456.789-00', 500);
      for (let i = 0; i < 10; i++) {
        await userService.deposit(user.id, 100);
        await userService.withdraw(user.id, 50);
      }
      const finalUser = await userService.getUser(user.id);
      expect(finalUser?.balance).toBe(500 + (10 * 100) - (10 * 50));
    });
  });

  describe('Security and Edge Case Tests', () => {
    it('should reject duplicate CPF on user creation', async () => {
      await userService.createUser('User 1', '123.456.789-00');
      await expect(userService.createUser('User 2', '123.456.789-00'))
        .rejects.toThrow('CPF already exists');
    });

    it('should reject invalid CPF format', async () => {
      await expect(userService.createUser('User', '123')).rejects.toThrow('Invalid CPF format(format: 000.000.000-00)');
    });

    it('should reject deposit that would exceed max safe integer', async () => {
      const user = await userService.createUser('Rich User', '123.456.789-00', 1_000_001);
      await expect(userService.deposit(user.id, 1))
        .rejects.toThrow('Deposit amount exceeds the maximum allowed');
    });

    it('should handle transaction history correctly with many operations', async () => {
      const user = await userService.createUser('Active User', '123.456.789-00', 1000);

      await Promise.all([
        userService.deposit(user.id, 100),
        userService.withdraw(user.id, 200),
        userService.deposit(user.id, 300),
        userService.withdraw(user.id, 400),
      ]);
      const statement = await userService.getStatement(user.id);
      expect(statement.length).toBe(4);
      const finalBalance = (await userService.getUser(user.id))?.balance;
      expect(finalBalance).toBe(1000 + 100 - 200 + 300 - 400);
    });

    it('should return undefined for non-existent user', async () => {
      const user = await userService.getUser('non-existent-id');
      expect(user).toBeUndefined();
    });

    it('should throw when getting statement for non-existent user', async () => {
      await expect(userService.getStatement('non-existent-id'))
        .rejects.toThrow('User not found');
    });

    it('should reject creation with negative initial balance', async () => {
      await expect(userService.createUser('User', '123.456.789-00', -100))
        .rejects.toThrow('Initial balance cannot be negative');
    });

    it('should reject creation with short name', async () => {
      await expect(userService.createUser('A', '123.456.789-00'))
        .rejects.toThrow('Name must be at least 3 characters long');
    });
  });
});