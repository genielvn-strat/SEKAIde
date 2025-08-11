import {
    tasks,
    projects,
    teams,
    teamMembers,
    lists,
    comments,
} from "@/migrations/schema";
import { and, eq } from "drizzle-orm";
import { db } from "../db";

export const authorization = {
    checkIfTeamMemberByTeamId: async (teamId: string, userId: string) => {
        if (!teamId || !userId) {
            throw new Error("Missing required fields");
        }
        const result = await db
            .select({
                id: teamMembers.id,
                role: teamMembers.role,
                inviteConfirmed: teamMembers.inviteConfirmed,
            })
            .from(teamMembers)
            .where(
                and(
                    eq(teamMembers.teamId, teamId),
                    eq(teamMembers.userId, userId)
                )
            )
            .then((res) => res[0] || null);
        return result;
    },
    checkIfTeamOwnedByUser: async (teamId: string, userId: string) => {
        if (!teamId || !userId) {
            throw new Error("Missing required fields");
        }
        const result = await db
            .select({
                id: teams.id,
                ownerId: teams.ownerId,
            })
            .from(teams)
            .where(and(eq(teams.id, teamId), eq(teams.ownerId, userId)))
            .then((res) => res[0] || null);
        return result;
    },
    checkIfTeamMemberByProjectSlug: async (
        projectSlug: string,
        userId: string
    ) => {
        if (!projectSlug || !userId) {
            throw new Error("Missing required fields");
        }
        const result = await db
            .select({
                id: teamMembers.id,
                teamId: teams.id,
                role: teamMembers.role,
                inviteConfirmed: teamMembers.inviteConfirmed,
            })
            .from(teamMembers)
            .innerJoin(teams, eq(teamMembers.teamId, teams.id))
            .innerJoin(projects, eq(teams.id, projects.teamId))
            .where(
                and(
                    eq(projects.slug, projectSlug),
                    eq(teamMembers.userId, userId)
                )
            )
            .then((res) => res[0] || null);
        return result;
    },
    checkIfTeamMemberByTeamSlug: async (teamSlug: string, userId: string) => {
        if (!teamSlug || !userId) {
            throw new Error("Missing required fields");
        }
        const result = await db
            .select({
                id: teamMembers.id,
                teamId: teams.id,
                role: teamMembers.role,
                inviteConfirmed: teamMembers.inviteConfirmed,
            })
            .from(teamMembers)
            .innerJoin(teams, eq(teamMembers.teamId, teams.id))
            .where(
                and(eq(teams.slug, teamSlug), eq(teamMembers.userId, userId))
            )
            .then((res) => res[0] || null);
        console.log(result);
        return result;
    },
    checkIfProjectOwnedByUserBySlug: async (
        projectSlug: string,
        userId: string
    ) => {
        if (!projectSlug || !userId) {
            throw new Error("Missing required fields");
        }
        const result = await db
            .select({
                id: projects.id,
                ownerId: projects.ownerId,
            })
            .from(projects)
            .where(
                and(
                    eq(projects.slug, projectSlug),
                    eq(projects.ownerId, userId)
                )
            )
            .then((res) => res[0] || null);
        return result;
    },
    checkIfProjectBelongsToTeam: async (teamId: string, projectId: string) => {
        if (!teamId || !projectId) {
            throw new Error("Missing required fields");
        }
        const result = await db
            .select()
            .from(projects)
            .where(and(eq(projects.teamId, teamId), eq(projects.id, projectId)))
            .then((res) => res[0] || null);
        return result;
    },
    checkIfTaskBelongsToProjectBySlug: async (
        projectSlug: string,
        taskSlug: string
    ) => {
        if (!projectSlug || !taskSlug) {
            throw new Error("Missing required fields");
        }
        const result = await db
            .select({
                id: tasks.id,
                projectId: tasks.projectId,
                teamId: projects.teamId,
            })
            .from(tasks)
            .innerJoin(projects, eq(tasks.projectId, projects.id))
            .where(
                and(eq(projects.slug, projectSlug), eq(tasks.slug, taskSlug))
            )
            .then((res) => res[0] || null);
        return result;
    },
    checkIfListBelongsToProjectBySlug: async (
        projectSlug: string,
        listId: string
    ) => {
        if (!projectSlug || !listId) {
            throw new Error("Missing required fields");
        }
        const result = await db
            .select({
                id: lists.id,
                projectId: lists.projectId,
                teamId: projects.teamId,
            })
            .from(lists)
            .innerJoin(projects, eq(lists.projectId, projects.id))
            .where(and(eq(projects.slug, projectSlug), eq(lists.id, listId)))
            .then((res) => res[0] || null);

        return result;
    },
    checkIfCommentOwnedByUser: async (commentId: string, userId: string) => {
        if (!commentId || !userId) {
            throw new Error("Missing required fields");
        }
        const result = await db
            .select({
                id: comments.id,
                userId: comments.authorId,
            })
            .from(comments)
            .where(
                and(eq(comments.id, commentId), eq(comments.authorId, userId))
            )
            .then((res) => res[0] || null);
        return result;
    },
    checkIfHasRole: (userRole: string, roles: string[]) => {
        return roles.includes(userRole);
    },
};
