import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Wrap the request body in a body object
      const validationTarget = {
        body: req.body
      }
      await schema.parseAsync(validationTarget)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map((e) => ({
            field: e.path.join('.').replace('body.', ''), // Remove 'body.' prefix from error path
            message: e.message,
          })),
        })
        return
      }
      next(error)
    }
  }
} 