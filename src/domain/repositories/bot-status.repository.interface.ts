import type { ActivityEntity } from '../entities/activity.entity.js';
import type { BotStatus } from '../value-objects/bot-status.value-object.js';

export interface BotStatusRepository {
  updateStatus(activity: ActivityEntity, status: BotStatus): Promise<void>;
  isConnected(): boolean;
}
