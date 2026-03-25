import { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, data: T, meta?: any, statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      data,
      meta
    });
  }

  static error(res: Response, message: string, statusCode = 500, errors?: any) {
    return res.status(statusCode).json({
      status: 'error',
      message,
      ...(errors && { errors })
    });
  }
}
