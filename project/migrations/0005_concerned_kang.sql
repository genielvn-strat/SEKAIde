ALTER TABLE "projects" ALTER COLUMN "owner_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "team_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "list_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "invite_confirmed" SET NOT NULL;