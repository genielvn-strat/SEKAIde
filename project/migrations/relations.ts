import { relations } from "drizzle-orm/relations";
import { users, projects, teams, tasks, comments, roles, rolePermissions, permissions, lists, teamMembers } from "./schema";

export const projectsRelations = relations(projects, ({one, many}) => ({
	user: one(users, {
		fields: [projects.ownerId],
		references: [users.id]
	}),
	team: one(teams, {
		fields: [projects.teamId],
		references: [teams.id]
	}),
	lists: many(lists),
	tasks: many(tasks),
}));

export const usersRelations = relations(users, ({many}) => ({
	projects: many(projects),
	comments: many(comments),
	tasks: many(tasks),
	teams: many(teams),
	teamMembers: many(teamMembers),
}));

export const teamsRelations = relations(teams, ({one, many}) => ({
	projects: many(projects),
	user: one(users, {
		fields: [teams.ownerId],
		references: [users.id]
	}),
	teamMembers: many(teamMembers),
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

export const tasksRelations = relations(tasks, ({one, many}) => ({
	comments: many(comments),
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

export const rolesRelations = relations(roles, ({many}) => ({
	rolePermissions: many(rolePermissions),
	teamMembers: many(teamMembers),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	rolePermissions: many(rolePermissions),
}));

export const listsRelations = relations(lists, ({one, many}) => ({
	project: one(projects, {
		fields: [lists.projectId],
		references: [projects.id]
	}),
	tasks: many(tasks),
}));

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