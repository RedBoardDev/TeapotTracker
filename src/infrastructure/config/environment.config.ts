import { z } from 'zod';
import { config } from 'dotenv';
import { logger, LogLevel } from '@infrastructure/logger/logger.js';

config();

const EnvironmentSchema = z.object({
  DISCORD_BOT_TOKEN: z.string().min(1),
  PORT: z.string().default('4983').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  LOG_LEVEL: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']).default('INFO'),
  LOG_TO_FILE: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
  LOG_DIR: z.string().default('./logs'),
  WEBHOOK_PATH: z.string().default('/webhook'),
});

type Environment = z.infer<typeof EnvironmentSchema>;

class EnvironmentConfig {
  private env: Environment;

  constructor() {
    try {
      this.env = EnvironmentSchema.parse(process.env);
      this.configureLogger();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Environment validation failed:', error.errors);
        process.exit(1);
      }
      throw error;
    }
  }

  private configureLogger(): void {
    const logLevel = LogLevel[this.env.LOG_LEVEL as keyof typeof LogLevel];
    logger.setLevel(logLevel);
    logger.enableFileLogging(this.env.LOG_TO_FILE);
    logger.setLogDirectory(this.env.LOG_DIR);
  }

  get discordBotToken(): string {
    return this.env.DISCORD_BOT_TOKEN;
  }

  get port(): number {
    return this.env.PORT;
  }

  get nodeEnv(): string {
    return this.env.NODE_ENV;
  }

  get webhookPath(): string {
    return this.env.WEBHOOK_PATH;
  }

  get isProduction(): boolean {
    return this.env.NODE_ENV === 'production';
  }

  get isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development';
  }
}

export const environmentConfig = new EnvironmentConfig();
