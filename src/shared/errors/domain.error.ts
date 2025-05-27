import { BaseError } from './base.error.js';

export class DomainError extends BaseError {
  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message, `DOMAIN_${code}`, context);
  }
}

export class InvalidActivityError extends DomainError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_ACTIVITY', context);
  }
}

export class InvalidTimeIntervalError extends DomainError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_TIME_INTERVAL', context);
  }
}

export class InvalidBotStatusError extends DomainError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_BOT_STATUS', context);
  }
}
