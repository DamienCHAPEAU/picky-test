import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const files = sqliteTable('files', {
  id: integer('id').primaryKey(),
  fileName: text('file_name').notNull(),
  originalName: text('original_name').notNull(),
  path: text('path').notNull(),
  compressedPath: text('compressed_path').notNull(),
  size: integer('size').notNull(),
  mimeType: text('mime_type').notNull(),
  uploadedAt: integer('uploaded_at', { mode: 'timestamp_ms' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type SelectFile = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;
