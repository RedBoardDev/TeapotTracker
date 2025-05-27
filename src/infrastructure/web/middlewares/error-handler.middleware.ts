import type { Request, Response, NextFunction } from 'express';
import { BaseError } from '@shared/errors/base.error.js';
import { logger } from '@infrastructure/logger/logger.js';
import { environmentConfig } from '@infrastructure/config/environment.config.js';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
  logger.error('Unhandled error in request', error, {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });

  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof BaseError) {
    res.status(getHttpStatusCode(error.code)).json({
      error: error.code,
      message: error.message,
      ...(environmentConfig.isDevelopment && { context: error.context }),
    });
    return;
  }

  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: environmentConfig.isProduction ? 'An unexpected error occurred' : error.message,
    ...(environmentConfig.isDevelopment && { stack: error.stack }),
  });
}

function getHttpStatusCode(errorCode: string): number {
  if (errorCode.includes('VALIDATION')) return 400;
  if (errorCode.includes('NOT_FOUND')) return 404;
  if (errorCode.includes('UNAUTHORIZED')) return 401;
  if (errorCode.includes('FORBIDDEN')) return 403;
  return 500;
}
