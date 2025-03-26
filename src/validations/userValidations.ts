import { z } from 'zod';

export const cpfSchema = z.string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'); // Remove formatação para armazenar

export const createUserSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo'),
  cpf: cpfSchema,
  initialBalance: z.number()
    .positive('O saldo inicial deve ser positivo'),
});

export const transactionSchema = z.object({
  id: z.string().uuid('ID inválido'),
  amount: z.number()
    .positive('O valor deve ser positivo')
    .max(1_000_000, 'Valor muito alto'),
});