import { ProcessTimeTrackingUseCase } from '@application/use-cases/process-time-tracking.use-case.js';
import { UpdateBotStatusUseCase } from '@application/use-cases/update-bot-status.use-case.js';
import type { BotStatusRepository } from '@domain/repositories/bot-status.repository.interface.js';
import { logger } from '@infrastructure/logger/logger.js';

export class DiscordBotService {
  private updateBotStatusUseCase: UpdateBotStatusUseCase;
  private processTimeTrackingUseCase: ProcessTimeTrackingUseCase;

  constructor(private readonly botStatusRepository: BotStatusRepository) {
    this.updateBotStatusUseCase = new UpdateBotStatusUseCase(botStatusRepository);
    this.processTimeTrackingUseCase = new ProcessTimeTrackingUseCase(this.updateBotStatusUseCase);
  }

  async initialize(): Promise<void> {
    logger.info('Initializing Discord bot service');
    await this.setDefaultStatus();
  }

  async setDefaultStatus(): Promise<void> {
    await this.updateBotStatusUseCase.execute("Status 418: I'm a Teapot", 'dnd');
  }

  getProcessTimeTrackingUseCase(): ProcessTimeTrackingUseCase {
    return this.processTimeTrackingUseCase;
  }

  isConnected(): boolean {
    return this.botStatusRepository.isConnected();
  }
}
