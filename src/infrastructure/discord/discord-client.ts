import { Client } from 'discord.js';
import { DiscordConnectionError } from '@shared/errors/infrastructure.error.js';
import { logger } from '@infrastructure/logger/logger.js';
import { discordConfig } from '@infrastructure/config/discord.config.js';
import { environmentConfig } from '@infrastructure/config/environment.config.js';

export class DiscordClient {
  private client: Client;
  private isReady = false;

  constructor() {
    this.client = new Client(discordConfig);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.once('ready', () => {
      this.isReady = true;
      logger.info('Discord bot connected successfully', {
        username: this.client.user?.username,
        id: this.client.user?.id,
      });
    });

    this.client.on('error', (error) => {
      logger.error('Discord client error', error);
    });

    this.client.on('warn', (warning) => {
      logger.warn('Discord client warning', { warning });
    });

    this.client.on('disconnect', () => {
      this.isReady = false;
      logger.warn('Discord client disconnected');
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.login(environmentConfig.discordBotToken);

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new DiscordConnectionError('Connection timeout'));
        }, 30000);

        if (this.isReady) {
          clearTimeout(timeout);
          resolve();
        } else {
          this.client.once('ready', () => {
            clearTimeout(timeout);
            resolve();
          });
        }
      });
    } catch (error) {
      logger.error('Failed to connect to Discord', error as Error);
      throw new DiscordConnectionError(`Failed to connect to Discord: ${(error as Error).message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.destroy();
      this.isReady = false;
      logger.info('Discord client disconnected');
    }
  }

  getClient(): Client {
    if (!this.isReady) {
      throw new DiscordConnectionError('Discord client is not ready');
    }
    return this.client;
  }

  isConnected(): boolean {
    return this.isReady && this.client.user !== null;
  }
}
