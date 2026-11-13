import { z } from 'zod';
import { idSchema, slugSchema } from './common.js';

export const materialCategorySchema = z.enum([
  'paper_cardboard',
  'plastic_glass_metal',
  'batteries_hazardous',
  'electronics',
  'clothing_textiles',
  'reuse',
]);

export type MaterialCategory = z.infer<typeof materialCategorySchema>;

/**
 * Конкретный материал (макулатура, ПЭТ-бутылки, батарейки...).
 * Связь с пунктом идёт только по `id`, категория — лишь группировка для UI.
 */
export const materialSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  name: z.string().trim().min(1).max(120),
  category: materialCategorySchema,
});

export type Material = z.infer<typeof materialSchema>;
