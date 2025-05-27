import { Router } from 'express';
import { WebhookPayloadSchema } from '@application/dto/webhook-payload.dto.js';
import type { DiscordBotService } from '@application/services/discord-bot.service.js';
import { WebhookController } from '../controllers/webhook.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';

export function createWebhookRouter(discordBotService: DiscordBotService): Router {
  const router = Router();
  const webhookController = new WebhookController(discordBotService);

  router.post('/', validateBody(WebhookPayloadSchema), (req, res, next) =>
    webhookController.handleWebhook(req, res, next),
  );

  return router;
}