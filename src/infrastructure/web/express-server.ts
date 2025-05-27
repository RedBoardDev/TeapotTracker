import express, { type Express } from 'express';
import { createWebhookRouter } from './routes/webhook.route.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { environmentConfig } from '../config/environment.config.js';
import type { DiscordBotService } from '@application/services/discord-bot.service.js';
import { logger } from '../logger/logger.js';
import type { Server } from 'node:http';
import { WebServerError } from '@shared/errors/infrastructure.error.js';

export class ExpressServer {
  private app: Express;
  private server?: Server;

  constructor(private readonly discordBotService: DiscordBotService) {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(express.json());

    this.app.use((req, _res, next) => {
      logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
      });
      next();
    });
  }

  private setupRoutes(): void {
    this.app.get('/health', (_req, res) => {
      res.json({
        status: 'ok',
        discord: this.discordBotService.isConnected() ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
      });
    });

    this.app.use(environmentConfig.webhookPath, createWebhookRouter(this.discordBotService));

    this.app.use((_req, res) => {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Route not found',
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(environmentConfig.port, () => {
          logger.info('Express server started', {
            port: environmentConfig.port,
            environment: environmentConfig.nodeEnv,
            webhookPath: environmentConfig.webhookPath,
          });
          resolve();
        });

        this.server.on('error', (error) => {
          logger.error('Express server error', error);
          reject(new WebServerError(`Failed to start server: ${error.message}`));
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close(() => {
        logger.info('Express server stopped');
        resolve();
      });
    });
  }
}
