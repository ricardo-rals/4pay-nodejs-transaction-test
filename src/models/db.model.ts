import { z } from 'zod';
import { userSchema } from '../models/user.model';

export const DB_SCHEMA = z.object({
  users: z.array(userSchema),
});

export type DatabaseData = z.infer<typeof DB_SCHEMA>;
