import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string().uuid('Invalid transaction ID'),
  type: z.enum(['deposit', 'withdraw'], {
    errorMap: () => ({ message: 'Invalid transaction type' })
  }),
  amount: z.number()
    .positive('The amount must be positive')
    .max(1_000_000, 'Maximum amount exceeded ($1,000,000)'),
  date: z.string().datetime('Invalid date')
});

export const userSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
  name: z.string()
    .min(3, 'Name must be at least 3 characters long')
    .max(100, 'Name cannot exceed 100 characters'),
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Invalid CPF format(format: 000.000.000-00)'),
  balance: z.number()
    .min(0, 'Initial balance cannot be negative'),
  transactions: z.array(transactionSchema)
});

export const createTransactionSchema = z.object({
  amount: z.number()
    .positive('The amount must be positive')
    .max(1_000_000, 'Maximum amount exceeded ($1,000,000)')
});

export const createUserSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters long')
    .max(100, 'Name cannot exceed 100 characters'),
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Invalid CPF format (format: 000.000.000-00)'),
  initialBalance: z.number()
    .min(0, 'Initial balance cannot be negative')
    .optional(),
  transactions: z.array(transactionSchema).optional().default([])
});

export type User = z.infer<typeof userSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
