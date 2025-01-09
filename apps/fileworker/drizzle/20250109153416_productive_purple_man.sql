CREATE TABLE `files` (
	`file_pk` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`file_id` text NOT NULL,
	`name` text NOT NULL,
	`created_on` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`expires_on` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `files_file_id_unique` ON `files` (`file_id`);