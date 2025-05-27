import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '@shared/errors/infrastructure.error.js';
import { logger } from '@infrastructure/logger/logger.js';

export function validateBody<T extends z.ZodSchema>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError('Validation failed', {
          errors: error.errors,
        });

        logger.warn('Request validation failed', {
          path: req.path,
          errors: error.errors,
        });

        res.status(400).json({
          error: validationError.code,
          message: validationError.message,
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
}
