import { Request, Response, ErrorRequestHandler  } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';


export const errorHandler: ErrorRequestHandler = (err: Error | ZodError, req: Request, res: Response) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: fromZodError(err).message,
    });
  } else if (err instanceof Error) {
    res.status(400).json({
      message: err.message,
    });
  } else {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};