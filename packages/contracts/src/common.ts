import { z } from 'zod';

export const idSchema = z.uuid();

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may contain only lowercase latin letters, digits and hyphens');

export const timestampSchema = z.iso.datetime({ offset: true });

export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;
