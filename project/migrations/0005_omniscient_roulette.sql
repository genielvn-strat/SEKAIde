CREATE TYPE "public"."color" AS ENUM('red', 'orange', 'yellow', 'green', 'blue', 'violet', 'mono');--> statement-breakpoint
ALTER TABLE "lists" DROP CONSTRAINT "lists_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_list_id_lists_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignee_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "color" SET DEFAULT 'mono'::"public"."color";--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "color" SET DATA TYPE "public"."color" USING "color"::"public"."color";--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "color" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "list_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" SET DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "lists" ADD COLUMN "color" "color";--> statement-breakpoint
ALTER TABLE "lists" ADD CONSTRAINT "lists_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;