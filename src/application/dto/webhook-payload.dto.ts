import { z } from 'zod';

export const TimeIntervalSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime().optional(),
});

export const ProjectSchema = z.object({
  clientName: z.string().optional(),
  name: z.string().optional(),
});

export const WebhookPayloadSchema = z.object({
  timeInterval: TimeIntervalSchema,
  currentlyRunning: z.boolean(),
  project: ProjectSchema.optional(),
});

export type WebhookPayloadDto = z.infer<typeof WebhookPayloadSchema>;
