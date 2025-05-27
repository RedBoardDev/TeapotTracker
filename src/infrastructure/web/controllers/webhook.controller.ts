import type { Request, Response, NextFunction } from 'express';
import type { DiscordBotService } from '@application/services/discord-bot.service.js';
import { logger } from '@infrastructure/logger/logger.js';

export class WebhookController {
  constructor(private readonly discordBotService: DiscordBotService) {}

  async handleWebhook(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = req.body;

      logger.info('Webhook received', { payload });

      if (!this.discordBotService.isConnected()) {
        logger.warn('Discord bot is not connected, skipping webhook processing');
        res.status(503).json({
          error: 'SERVICE_UNAVAILABLE',
          message: 'Discord bot is not connected',
        });
        return;
      }

      const processTimeTrackingUseCase = this.discordBotService.getProcessTimeTrackingUseCase();
      await processTimeTrackingUseCase.execute(payload);

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}
