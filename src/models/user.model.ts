import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  balance: z.number(),
  transactions: z.array(
    z.object({
      id: z.string().uuid(),
      type: z.enum(['deposit', 'withdraw']),
      amount: z.number(),
      date: z.string(),
    })
  ),
});

export type User = z.infer<typeof userSchema>;