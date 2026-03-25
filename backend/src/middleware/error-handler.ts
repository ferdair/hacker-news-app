import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { logger } from './logger.middleware';
import { ApiResponse } from '../utils/response';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      err instanceof ValidationError ? err.errors : undefined
    );
  }

  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  return ApiResponse.error(res, message, 500);
};
