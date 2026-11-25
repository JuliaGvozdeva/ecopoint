import { sql } from 'drizzle-orm';
import {
  customType,
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const geographyPoint = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return 'geography(Point, 4326)';
  },
});

export const collectionPoints = pgTable(
  'collection_points',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    name: varchar('name', { length: 255 }).notNull(),

    description: text('description'),

    latitude: doublePrecision('latitude').notNull(),

    longitude: doublePrecision('longitude').notNull(),

    location: geographyPoint('location')
      .generatedAlwaysAs(
        sql`ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography`,
      )
      .notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('collection_points_location_idx').using('gist', table.location),
  ],
);