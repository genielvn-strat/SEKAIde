import { relations } from "drizzle-orm/relations";
import { roles, teamMembers, users, teams, projects, tasks, lists, rolePermissions, permissions, comments } from "./schema";

export const teamMembersRelations = relations(teamMembers, ({one}) => ({
	role: one(roles, {
		fields: [teamMembers.roleId],
		references: [roles.id]
	}),
	user: one(users, {
		fields: [teamMembers.userId],
		references: [users.id]
	}),
	team: one(teams, {
		fields: [teamMembers.teamId],
		references: [teams.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	teamMembers: many(teamMembers),
	rolePermissions: many(rolePermissions),
}));

export const usersRelations = relations(users, ({many}) => ({
	teamMembers: many(teamMembers),
	tasks: many(tasks),
	teams: many(teams),
	comments: many(comments),
	projects: many(projects),
}));

export const teamsRelations = relations(teams, ({one, many}) => ({
	teamMembers: many(teamMembers),
	user: one(users, {
		fields: [teams.ownerId],
		references: [users.id]
	}),
	projects: many(projects),
}));

export const tasksRelations = relations(tasks, ({one, many}) => ({
	project: one(projects, {
		fields: [tasks.projectId],
		references: [projects.id]
	}),
	list: one(lists, {
		fields: [tasks.listId],
		references: [lists.id]
	}),
	user: one(users, {
		fields: [tasks.assigneeId],
		references: [users.id]
	}),
	comments: many(comments),
}));

export const projectsRelations = relations(projects, ({one, many}) => ({
	tasks: many(tasks),
	user: one(users, {
		fields: [projects.ownerId],
		references: [users.id]
	}),
	team: one(teams, {
		fields: [projects.teamId],
		references: [teams.id]
	}),
	lists: many(lists),
}));

export const listsRelations = relations(lists, ({one, many}) => ({
	tasks: many(tasks),
	project: one(projects, {
		fields: [lists.projectId],
		references: [projects.id]
	}),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({one}) => ({
	role: one(roles, {
		fields: [rolePermissions.roleId],
		references: [roles.id]
	}),
	permission: one(permissions, {
		fields: [rolePermissions.permissionId],
		references: [permissions.id]
	}),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	rolePermissions: many(rolePermissions),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	task: one(tasks, {
		fields: [comments.taskId],
		references: [tasks.id]
	}),
	user: one(users, {
		fields: [comments.authorId],
		references: [users.id]
	}),
}));