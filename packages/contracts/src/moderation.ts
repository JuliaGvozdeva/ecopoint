import { z } from 'zod';
import { idSchema, timestampSchema } from './common.js';

export const moderationActionSchema = z.enum([
  'suggestion_approved',
  'suggestion_rejected',
  'place_created',
  'place_updated',
  'place_deleted',
]);

export type ModerationAction = z.infer<typeof moderationActionSchema>;

export const fieldChangeSchema = z.object({
  from: z.unknown(),
  to: z.unknown(),
});

/** Запись журнала: кто, когда и какое изменение одобрил, отклонил или внёс. */
export const moderationEventSchema = z.object({
  id: idSchema,
  action: moderationActionSchema,
  /** Логин администратора, выполнившего действие. */
  actor: z.string().trim().min(1).max(100),
  placeId: idSchema.nullable(),
  suggestionId: idSchema.nullable(),
  /** Изменённые поля: путь поля → исходное и новое значение. */
  changes: z.record(z.string(), fieldChangeSchema).nullable(),
  reason: z.string().trim().max(2000).nullable(),
  createdAt: timestampSchema,
});

export type ModerationEvent = z.infer<typeof moderationEventSchema>;
