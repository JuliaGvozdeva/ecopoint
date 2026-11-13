import { z } from 'zod';
import { coordinatesSchema, idSchema, slugSchema, timestampSchema } from './common.js';

export const placeStatusSchema = z.enum(['active', 'temporarily_closed', 'closed']);

export type PlaceStatus = z.infer<typeof placeStatusSchema>;

export const placeContactsSchema = z.object({
  phone: z.string().trim().max(50).nullable(),
  email: z.email().nullable(),
  website: z.url({ protocol: /^https?$/ }).nullable(),
});

export type PlaceContacts = z.infer<typeof placeContactsSchema>;

/** Пункт приёма. `slug` используется в постоянном URL страницы пункта. */
export const placeSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  name: z.string().trim().min(1).max(200),
  address: z.string().trim().min(1).max(300),
  coordinates: coordinatesSchema,
  contacts: placeContactsSchema,
  /** Часы работы в формате OSM `opening_hours`; `null` — неизвестны. */
  openingHours: z.string().trim().max(500).nullable(),
  status: placeStatusSchema,
  /** Дата последней подтверждённой проверки данных; `null` — не проверялось. */
  verifiedAt: timestampSchema.nullable(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export type Place = z.infer<typeof placeSchema>;

/** Способ обращения с материалом. Утилизация не равна переработке. */
export const handlingMethodSchema = z.enum(['recycling', 'reuse', 'disposal']);

export type HandlingMethod = z.infer<typeof handlingMethodSchema>;

/**
 * Статус приёма материала. Отсутствие записи PlaceMaterial тоже означает
 * `unknown`; `not_accepted` ставится только при подтверждённом отказе.
 */
export const acceptanceStatusSchema = z.enum(['accepted', 'not_accepted', 'unknown']);

export type AcceptanceStatus = z.infer<typeof acceptanceStatusSchema>;

/** Условия приёма конкретного материала конкретным пунктом. */
export const placeMaterialSchema = z.object({
  placeId: idSchema,
  materialId: idSchema,
  acceptance: acceptanceStatusSchema,
  /** `null` — способ обращения неизвестен. */
  handling: handlingMethodSchema.nullable(),
  /** Свободный текст: «только чистое», «не более 10 кг», «платно» и т.п. */
  conditions: z.string().trim().max(1000).nullable(),
  /** Источник, из которого получены эти условия. */
  sourceId: idSchema.nullable(),
});

export type PlaceMaterial = z.infer<typeof placeMaterialSchema>;

export const placeSourceTypeSchema = z.enum(['osm', 'official_website', 'manual_check']);

export type PlaceSourceType = z.infer<typeof placeSourceTypeSchema>;

/** Источник сведений о пункте. У пункта может быть несколько источников. */
export const placeSourceSchema = z.object({
  id: idSchema,
  placeId: idSchema,
  type: placeSourceTypeSchema,
  /** Идентификатор во внешней системе, например `node/123456` для OSM. */
  externalId: z.string().trim().max(100).nullable(),
  url: z.url().nullable(),
  /** Когда сведения были получены или проверены. */
  checkedAt: timestampSchema,
  note: z.string().trim().max(1000).nullable(),
});

export type PlaceSource = z.infer<typeof placeSourceSchema>;
