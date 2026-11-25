ALTER TABLE "collection_points"
DROP COLUMN "location";
--> statement-breakpoint

ALTER TABLE "collection_points"
ADD COLUMN "location" geography(Point, 4326)
GENERATED ALWAYS AS (
  ST_SetSRID(
    ST_MakePoint(longitude, latitude),
    4326
  )::geography
) STORED NOT NULL;
--> statement-breakpoint