import { ActivityEntity } from '@domain/entities/activity.entity.js';
import { BotStatus } from '@domain/value-objects/bot-status.value-object.js';
import { ActivityType } from '@domain/value-objects/activity-type.value-object.js';
import type { BotStatusRepository } from '@domain/repositories/bot-status.repository.interface.js';
import { logger } from '@infrastructure/logger/logger.js';

export class UpdateBotStatusUseCase {
  constructor(private readonly botStatusRepository: BotStatusRepository) {}

  async execute(activityName: string, status: 'online' | 'idle' | 'dnd', startTimestamp?: number): Promise<void> {
    try {
      const activity = new ActivityEntity(activityName, ActivityType.custom().getValue(), startTimestamp);

      const botStatus = new BotStatus(status);

      await this.botStatusRepository.updateStatus(activity, botStatus);

      logger.info('Bot status updated successfully', {
        activity: activityName,
        status,
        startTimestamp,
      });
    } catch (error) {
      logger.error('Failed to update bot status', error as Error, {
        activityName,
        status,
        startTimestamp,
      });
      throw error;
    }
  }
}
