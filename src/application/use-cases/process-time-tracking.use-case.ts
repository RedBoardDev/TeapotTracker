import { TimeInterval } from '@domain/entities/time-interval.entity.js';
import type { UpdateBotStatusUseCase } from './update-bot-status.use-case.js';
import { logger } from '@infrastructure/logger/logger.js';
import type { WebhookPayloadDto } from '@application/dto/webhook-payload.dto.js';

export class ProcessTimeTrackingUseCase {
  constructor(private readonly updateBotStatusUseCase: UpdateBotStatusUseCase) {}

  async execute(payload: WebhookPayloadDto): Promise<void> {
    try {
      const timeInterval = new TimeInterval(payload.timeInterval.start, payload.timeInterval.end);

      if (payload.currentlyRunning && timeInterval.isRunning()) {
        if (payload.project?.clientName) {
          await this.updateBotStatusUseCase.execute(
            `Working at ${payload.project.clientName}`,
            'online',
            timeInterval.getStartTimestamp(),
          );
        } else {
          await this.updateBotStatusUseCase.execute('Running a side quest', 'idle');
        }
      } else if (!payload.currentlyRunning && !timeInterval.isRunning()) {
        await this.updateBotStatusUseCase.execute("Status 418: I'm a Teapot", 'dnd');
      }

      logger.info('Time tracking processed successfully', { payload });
    } catch (error) {
      logger.error('Failed to process time tracking', error as Error, { payload });
      throw error;
    }
  }
}
