import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../lib/errors.js';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle ApiError instances
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  // Return generic error for unexpected errors
  return res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}; 