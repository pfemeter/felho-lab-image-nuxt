import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    activeSessionToken: text('active_session_token'),
});

export const images = pgTable('images', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    uploadDateTime: timestamp('upload_date_time').defaultNow(),
    fileMimeType: text('file_mime_type').notNull(),
    s3Key: text('s3_key').notNull(),
    userId: uuid('user_id').references(() => users.id).notNull(),
});