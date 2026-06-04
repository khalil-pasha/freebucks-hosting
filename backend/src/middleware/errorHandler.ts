import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error]', err);

  // Never expose stack traces to users in production
  res.status(err.status || 500).json({
    error: err.isOperational ? err.message : 'Internal Server Error'
  });
};
