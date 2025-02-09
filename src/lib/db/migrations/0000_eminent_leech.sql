CREATE TABLE `files` (
	`id` integer PRIMARY KEY NOT NULL,
	`file_name` text NOT NULL,
	`original_name` text NOT NULL,
	`path` text NOT NULL,
	`compressed_path` text NOT NULL,
	`size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`uploaded_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
