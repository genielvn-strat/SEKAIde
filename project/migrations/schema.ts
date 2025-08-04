import {
    pgTable,
    foreignKey,
    unique,
    uuid,
    text,
    timestamp,
    boolean,
    integer,
    pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const role = pgEnum("role", ["member", "project_manager", "admin"]);
export const taskPriority = pgEnum("task_priority", ["low", "medium", "high"]);

export const teams = pgTable(
    "team",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        ownerId: uuid("owner_id").notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
        slug: text().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.ownerId],
            foreignColumns: [users.id],
            name: "team_owner_id_users_id_fk",
        }).onDelete("cascade"),
        unique("team_slug_unique").on(table.slug),
    ]
);

export const projects = pgTable(
    "projects",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        description: text(),
        ownerId: uuid("owner_id"),
        teamId: uuid("team_id"),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
        dueDate: timestamp("due_date", { mode: "string" }).defaultNow(),
        slug: text().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.ownerId],
            foreignColumns: [users.id],
            name: "projects_owner_id_users_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.teamId],
            foreignColumns: [teams.id],
            name: "projects_team_id_team_id_fk",
        }).onDelete("cascade"),
        unique("projects_slug_unique").on(table.slug),
    ]
);

export const users = pgTable(
    "users",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        clerkId: text("clerk_id").notNull(),
        email: text().notNull(),
        name: text().notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
        username: text().notNull(),
    },
    (table) => [
        unique("users_clerk_id_unique").on(table.clerkId),
        unique("users_username_unique").on(table.username),
    ]
);

export const teamMembers = pgTable(
    "team_members",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid("user_id").notNull(),
        teamId: uuid("team_id").notNull(),
        role: role().default("member"),
        inviteConfirmed: boolean("invite_confirmed").default(false),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "team_members_user_id_users_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.teamId],
            foreignColumns: [teams.id],
            name: "team_members_team_id_team_id_fk",
        }).onDelete("cascade"),
    ]
);

export const lists = pgTable(
    "lists",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        projectId: uuid("project_id"),
        position: integer().notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    },
    (table) => [
        foreignKey({
            columns: [table.projectId],
            foreignColumns: [projects.id],
            name: "lists_project_id_projects_id_fk",
        }).onDelete("cascade"),
    ]
);

export const tasks = pgTable(
    "tasks",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        title: text().notNull(),
        description: text(),
        projectId: uuid("project_id"),
        listId: uuid("list_id"),
        assigneeId: uuid("assignee_id"),
        priority: taskPriority().default("low"),
        dueDate: timestamp("due_date", { mode: "string" }),
        position: integer().notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    },
    (table) => [
        foreignKey({
            columns: [table.projectId],
            foreignColumns: [projects.id],
            name: "tasks_project_id_projects_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.listId],
            foreignColumns: [lists.id],
            name: "tasks_list_id_lists_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.assigneeId],
            foreignColumns: [users.id],
            name: "tasks_assignee_id_users_id_fk",
        }).onDelete("cascade"),
    ]
);

export const comments = pgTable(
    "comments",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        content: text().notNull(),
        taskId: uuid("task_id"),
        authorId: uuid("author_id"),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    },
    (table) => [
        foreignKey({
            columns: [table.taskId],
            foreignColumns: [tasks.id],
            name: "comments_task_id_tasks_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.authorId],
            foreignColumns: [users.id],
            name: "comments_author_id_users_id_fk",
        }).onDelete("cascade"),
    ]
);
