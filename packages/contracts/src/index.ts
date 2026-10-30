import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.string(),
  timestamp: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const materialCategorySchema = z.enum([
  'paper_cardboard',
  'plastic_glass_metal',
  'batteries_hazardous',
  'electronics',
  'clothing_textiles',
  'reuse',
]);

export type MaterialCategory = z.infer<typeof materialCategorySchema>;
