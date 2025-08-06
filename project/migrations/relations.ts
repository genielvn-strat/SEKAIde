import { relations } from "drizzle-orm/relations";
import {
    users,
    teams,
    projects,
    teamMembers,
    lists,
    tasks,
    comments,
} from "./schema";

export const teamRelations = relations(teams, ({ one, many }) => ({
    user: one(users, {
        fields: [teams.ownerId],
        references: [users.id],
    }),
    projects: many(projects),
    teamMembers: many(teamMembers),
}));

export const usersRelations = relations(users, ({ many }) => ({
    teams: many(teams),
    projects: many(projects),
    teamMembers: many(teamMembers),
    tasks: many(tasks),
    comments: many(comments),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    user: one(users, {
        fields: [projects.ownerId],
        references: [users.id],
    }),
    team: one(teams, {
        fields: [projects.teamId],
        references: [teams.id],
    }),
    lists: many(lists),
    tasks: many(tasks),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
    user: one(users, {
        fields: [teamMembers.userId],
        references: [users.id],
    }),
    team: one(teams, {
        fields: [teamMembers.teamId],
        references: [teams.id],
    }),
}));

export const listsRelations = relations(lists, ({ one, many }) => ({
    project: one(projects, {
        fields: [lists.projectId],
        references: [projects.id],
    }),
    tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id],
    }),
    list: one(lists, {
        fields: [tasks.listId],
        references: [lists.id],
    }),
    user: one(users, {
        fields: [tasks.assigneeId],
        references: [users.id],
    }),
    comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    task: one(tasks, {
        fields: [comments.taskId],
        references: [tasks.id],
    }),
    user: one(users, {
        fields: [comments.authorId],
        references: [users.id],
    }),
}));
