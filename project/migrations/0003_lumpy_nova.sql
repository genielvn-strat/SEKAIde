ALTER TABLE "lists" ADD COLUMN "isFinal" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "finished" boolean DEFAULT false NOT NULL;