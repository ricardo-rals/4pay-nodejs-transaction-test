import express from 'express';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/errorHandler';
import { env } from './config/env';

const app = express();

app.use(express.json());
app.use('/api/v1', userRoutes);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost/${env.PORT}`);
});