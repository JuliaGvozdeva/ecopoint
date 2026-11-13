import { z } from 'zod';
import { coordinatesSchema, idSchema, timestampSchema } from './common.js';
import {
  acceptanceStatusSchema,
  handlingMethodSchema,
  placeContactsSchema,
  placeStatusSchema,
} from './places.js';

export const suggestionTypeSchema = z.enum(['new_place', 'place_correction']);

export type SuggestionType = z.infer<typeof suggestionTypeSchema>;

export const suggestionStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export type SuggestionStatus = z.infer<typeof suggestionStatusSchema>;

export const suggestedPlaceMaterialSchema = z.object({
  materialId: idSchema,
  acceptance: acceptanceStatusSchema,
  handling: handlingMethodSchema.nullable().default(null),
  conditions: z.string().trim().max(1000).nullable().default(null),
});

/** Поля пункта, которые гость может прислать. Без default — иначе `.partial()` подставит значения в исправление. */
const placeDraftFieldsSchema = z.object({
  name: z.string().trim().min(1).max(200),
  address: z.string().trim().min(1).max(300),
  /** Гость может не знать координат — их уточнит администратор. */
  coordinates: coordinatesSchema.nullable(),
  contacts: placeContactsSchema.partial(),
  openingHours: z.string().trim().max(500).nullable(),
  status: placeStatusSchema,
  materials: z.array(suggestedPlaceMaterialSchema).max(50),
});

/** Данные нового пункта в том виде, в котором их может прислать гость. */
export const placeDraftSchema = placeDraftFieldsSchema.extend({
  coordinates: placeDraftFieldsSchema.shape.coordinates.default(null),
  contacts: placeDraftFieldsSchema.shape.contacts.default({}),
  openingHours: placeDraftFieldsSchema.shape.openingHours.default(null),
  status: placeDraftFieldsSchema.shape.status.default('active'),
  materials: placeDraftFieldsSchema.shape.materials.default([]),
});

export type PlaceDraft = z.infer<typeof placeDraftSchema>;

const suggestionMetaShape = {
  comment: z.string().trim().max(2000).nullable().default(null),
  contactEmail: z.email().nullable().default(null),
};

export const newPlaceSuggestionInputSchema = z.object({
  type: z.literal('new_place'),
  place: placeDraftSchema,
  ...suggestionMetaShape,
});

export const placeCorrectionSuggestionInputSchema = z.object({
  type: z.literal('place_correction'),
  placeId: idSchema,
  changes: placeDraftFieldsSchema
    .partial()
    .refine((changes) => Object.values(changes).some((value) => value !== undefined), {
      message: 'At least one field must be changed',
    }),
  ...suggestionMetaShape,
});

/** Тело запроса публичной формы предложения. */
export const createPlaceSuggestionInputSchema = z.discriminatedUnion('type', [
  newPlaceSuggestionInputSchema,
  placeCorrectionSuggestionInputSchema,
]);

export type CreatePlaceSuggestionInput = z.input<typeof createPlaceSuggestionInputSchema>;

const suggestionRecordShape = {
  id: idSchema,
  status: suggestionStatusSchema,
  createdAt: timestampSchema,
  reviewedAt: timestampSchema.nullable(),
};

/** Предложение пользователя. Каталог меняется только после модерации. */
export const placeSuggestionSchema = z.discriminatedUnion('type', [
  newPlaceSuggestionInputSchema.extend(suggestionRecordShape),
  placeCorrectionSuggestionInputSchema.extend(suggestionRecordShape),
]);

export type PlaceSuggestion = z.infer<typeof placeSuggestionSchema>;
