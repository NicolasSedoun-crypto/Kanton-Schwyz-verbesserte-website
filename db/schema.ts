import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const accounts = sqliteTable('accounts', {
 id: text('id').primaryKey(), owner: text('owner').notNull(), email: text('email').notNull(),
 salt: text('salt').notNull(), passwordHash: text('password_hash').notNull(),
 profile: text('profile').notNull().default('{}'), created: integer('created').notNull()
}, t => [uniqueIndex('accounts_owner_email').on(t.owner,t.email)]);
export const sessions = sqliteTable('sessions', {
 tokenHash: text('token_hash').primaryKey(), accountId: text('account_id').notNull().references(()=>accounts.id,{onDelete:'cascade'}),
 expires: integer('expires').notNull()
});
export const drafts = sqliteTable('drafts', {
 id: text('id').primaryKey(), accountId: text('account_id').notNull().references(()=>accounts.id,{onDelete:'cascade'}),
 service: integer('service').notNull(), step: integer('step').notNull(), answers: text('answers').notNull(),
 updated: integer('updated').notNull(), status: text('status').notNull().default('draft')
},t=>[uniqueIndex('drafts_account_service').on(t.accountId,t.service)]);
export const attempts = sqliteTable('auth_attempts', {
 owner:text('owner').primaryKey(), count:integer('count').notNull(), window:integer('window').notNull()
});
