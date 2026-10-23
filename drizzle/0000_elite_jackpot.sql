CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`email` text NOT NULL,
	`salt` text NOT NULL,
	`password_hash` text NOT NULL,
	`profile` text DEFAULT '{}' NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_owner_email` ON `accounts` (`owner`,`email`);--> statement-breakpoint
CREATE TABLE `auth_attempts` (
	`owner` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`window` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`service` integer NOT NULL,
	`step` integer NOT NULL,
	`answers` text NOT NULL,
	`updated` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `drafts_account_service` ON `drafts` (`account_id`,`service`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
