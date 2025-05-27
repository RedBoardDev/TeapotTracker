import { BaseError } from './base.error.js';

export class InfrastructureError extends BaseError {
  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message, `INFRA_${code}`, context);
  }
}

export class DiscordConnectionError extends InfrastructureError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'DISCORD_CONNECTION', context);
  }
}

export class WebServerError extends InfrastructureError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'WEB_SERVER', context);
  }
}

export class ValidationError extends InfrastructureError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION', context);
  }
}
