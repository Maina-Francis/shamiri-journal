
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('Error caught by asyncHandler:', err);
    next(err);
  });
};
