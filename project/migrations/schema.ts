import {
    pgTable,
    foreignKey,
    unique,
    uuid,
    text,
    timestamp,
    integer,
    boolean,
    pgEnum,
} from "drizzle-orm/pg-core";

export const taskPriority = pgEnum("task_priority", ["low", "medium", "high"]);
export const color = pgEnum("color", [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "violet",
]);

export const projects = pgTable(
    "projects",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        description: text(),
        ownerId: uuid("owner_id").notNull(),
        teamId: uuid("team_id").notNull(),
        slug: text().notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
        dueDate: timestamp("due_date", { mode: "string" }),
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

export const permissions = pgTable("permissions", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull().unique(),
    description: text(),
});

export const comments = pgTable(
    "comments",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        content: text().notNull(),
        taskId: uuid("task_id").notNull(),
        authorId: uuid("author_id").notNull(),
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

export const rolePermissions = pgTable(
    "role_permissions",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        roleId: uuid().notNull(),
        permissionId: uuid().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.roleId],
            foreignColumns: [roles.id],
            name: "role_permissions_roleId_roles_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.permissionId],
            foreignColumns: [permissions.id],
            name: "role_permissions_permissionId_permissions_id_fk",
        }).onDelete("cascade"),
    ]
);

export const lists = pgTable(
    "lists",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        description: text(),
        projectId: uuid("project_id"),
        position: integer().notNull(),
        isFinal: boolean().notNull().default(false),
        color: color(),
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
        projectId: uuid("project_id").notNull(),
        listId: uuid("list_id"),
        assigneeId: uuid("assignee_id"),
        priority: taskPriority().default("medium").notNull(),
        position: integer().notNull(),
        slug: text().notNull(),
        finished: boolean().notNull().default(false),
        dueDate: timestamp("due_date", { mode: "string" }),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
        finishedAt: timestamp("finished_at", { mode: "string" }),
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
        }).onDelete("set null"),
        foreignKey({
            columns: [table.assigneeId],
            foreignColumns: [users.id],
            name: "tasks_assignee_id_users_id_fk",
        }).onDelete("set null"),
    ]
);

export const users = pgTable(
    "users",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        clerkId: text("clerk_id").notNull(),
        email: text().notNull(),
        name: text().notNull(),
        displayPictureLink: text().notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
        username: text().notNull(),
    },
    (table) => [
        unique("users_clerk_id_unique").on(table.clerkId),
        unique("users_username_unique").on(table.username),
    ]
);

export const teams = pgTable(
    "teams",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        ownerId: uuid("owner_id").notNull(),
        slug: text().notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
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

export const roles = pgTable(
    "roles",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        nameId: text().notNull(),
        color: color(),
        priority: integer().notNull(),
    },
    (table) => [unique("roles_nameId_unique").on(table.nameId)]
);

export const teamMembers = pgTable(
    "team_members",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid("user_id").notNull(),
        teamId: uuid("team_id").notNull(),
        roleId: uuid("role_id").notNull(),
        inviteConfirmed: boolean("invite_confirmed").default(false).notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    },
    (table) => [
        foreignKey({
            columns: [table.roleId],
            foreignColumns: [roles.id],
            name: "team_members_role_id_roles_id_fk",
        }).onDelete("cascade"),
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
