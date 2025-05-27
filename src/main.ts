import { DiscordClient } from './infrastructure/discord/discord-client.js';
import { DiscordStatusRepository } from './infrastructure/discord/discord-status.repository.js';
import { DiscordBotService } from './application/services/discord-bot.service.js';
import { ExpressServer } from './infrastructure/web/express-server.js';
import { logger } from './infrastructure/logger/logger.js';
import { environmentConfig } from './infrastructure/config/environment.config.js';

class Application {
  private discordClient?: DiscordClient;
  private discordBotService?: DiscordBotService;
  private expressServer?: ExpressServer;

  async start(): Promise<void> {
    try {
      logger.info('Starting Discord Time Tracker Bot', {
        environment: environmentConfig.nodeEnv,
      });

      // Initialize Discord client
      this.discordClient = new DiscordClient();
      await this.discordClient.connect();

      // Initialize repositories and services
      const discordStatusRepository = new DiscordStatusRepository(this.discordClient);
      this.discordBotService = new DiscordBotService(discordStatusRepository);
      await this.discordBotService.initialize();

      // Start Express server
      this.expressServer = new ExpressServer(this.discordBotService);
      await this.expressServer.start();

      logger.info('Application started successfully');

      // Setup graceful shutdown
      this.setupGracefulShutdown();
    } catch (error) {
      logger.fatal('Failed to start application', error as Error);
      await this.shutdown();
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

    for (const signal of signals) {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, starting graceful shutdown`);
        await this.shutdown();
        process.exit(0);
      });
    }

    process.on('uncaughtException', async (error) => {
      logger.fatal('Uncaught exception', error);
      await this.shutdown();
      process.exit(1);
    });

    process.on('unhandledRejection', async (reason, promise) => {
      logger.fatal('Unhandled rejection', reason as Error, {
        promise: String(promise),
      });
      await this.shutdown();
      process.exit(1);
    });
  }

  private async shutdown(): Promise<void> {
    logger.info('Shutting down application');

    try {
      // Stop Express server
      if (this.expressServer) {
        await this.expressServer.stop();
      }

      // Disconnect Discord client
      if (this.discordClient) {
        await this.discordClient.disconnect();
      }

      logger.info('Application shutdown complete');
    } catch (error) {
      logger.error('Error during shutdown', error as Error);
    }
  }
}

// Start the application
const app = new Application();
app.start().catch((error) => {
  logger.fatal('Failed to start application', error as Error);
  process.exit(1);
});
