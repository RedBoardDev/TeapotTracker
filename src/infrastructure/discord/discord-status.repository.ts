import type { BotStatusRepository } from '@domain/repositories/bot-status.repository.interface.js';
import type { ActivityEntity } from '@domain/entities/activity.entity.js';
import type { BotStatus } from '@domain/value-objects/bot-status.value-object.js';
import type { DiscordClient } from './discord-client.js';
import { logger } from '../logger/logger.js';
import { DiscordConnectionError } from '@shared/errors/infrastructure.error.js';

export class DiscordStatusRepository implements BotStatusRepository {
  constructor(private readonly discordClient: DiscordClient) {}

  async updateStatus(activity: ActivityEntity, status: BotStatus): Promise<void> {
    try {
      if (!this.isConnected()) {
        throw new DiscordConnectionError('Discord client is not connected');
      }

      const client = this.discordClient.getClient();
      const activityData = activity.toDiscordActivity();

      await client.user?.setPresence({
        activities: [activityData],
        status: status.getValue(),
      });

      logger.debug('Discord presence updated', {
        activity: activityData,
        status: status.getValue(),
      });
    } catch (error) {
      logger.error('Failed to update Discord presence', error as Error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.discordClient.isConnected();
  }
}
