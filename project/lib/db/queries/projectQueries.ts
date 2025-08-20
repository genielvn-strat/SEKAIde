import {
    projects,
    teams,
    teamMembers,
    lists,
    tasks,
} from "@/migrations/schema";
import { and, count, eq, or, sql } from "drizzle-orm";
import { CreateProject, UpdateProject } from "@/types/Project";
import { failure, success } from "@/types/Response";
import { FetchProject } from "@/types/ServerResponses";
import { authorization } from "./authorizationQueries";
import { db } from "../db";

export const projectQueries = {
    getBySlug: async (projectSlug: string, userId: string) => {
        if (!projectSlug || !userId)
            return failure(400, "Missing require fields");

        const member = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );

        if (!member) {
            return failure(404, "Not found");
        }
        try {
            const result: FetchProject = await db
                .select({
                    id: projects.id,
                    name: projects.name,
                    slug: projects.slug,
                    description: projects.description,
                    ownerId: projects.ownerId,
                    teamId: projects.teamId,
                    teamName: teams.name,
                    createdAt: projects.createdAt,
                    updatedAt: projects.updatedAt,
                    dueDate: projects.dueDate,
                })
                .from(projects)
                .innerJoin(teams, eq(projects.teamId, teams.id))
                .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
                .where(
                    and(
                        eq(projects.slug, projectSlug),
                        or(
                            eq(projects.ownerId, userId),
                            eq(teamMembers.userId, userId)
                        )
                    )
                )
                .then((res) => res[0] || null);

            return success(200, "Projects successfully fetched.", result);
        } catch {
            return failure(500, "Failed to fetch project");
        }
    },
    getByTeamSlug: async (teamSlug: string, userId: string) => {
        const member = await authorization.checkIfTeamMemberByTeamSlug(
            teamSlug,
            userId
        );
        if (!member) {
            return failure(
                400,
                "You are not authorized to see this team projects"
            );
        }

        try {
            const result: FetchProject[] = await db
                .select({
                    id: projects.id,
                    name: projects.name,
                    slug: projects.slug,
                    description: projects.description,
                    ownerId: projects.ownerId,
                    createdAt: projects.createdAt,
                    updatedAt: projects.updatedAt,
                    dueDate: projects.dueDate,
                    totalTaskCount: count(tasks.id).mapWith(Number),
                    finishedTaskCount: sql<number>`sum(case when ${tasks.finished} = true then 1 else 0 end)`,
                })
                .from(projects)
                .innerJoin(teams, eq(teams.id, projects.teamId))
                .leftJoin(tasks, eq(tasks.projectId, projects.id)) // include tasks
                .where(eq(teams.slug, teamSlug))
                .groupBy(projects.id); // aggregate per project
            return success(200, "Team projects fetched successfully", result);
        } catch {
            return failure(500, "Failed to fetch team projects");
        }
    },
    getByUserTeams: async (userId: string) => {
        try {
            const result: FetchProject[] = await db
                .select({
                    id: projects.id,
                    name: projects.name,
                    slug: projects.slug,
                    description: projects.description,
                    ownerId: projects.ownerId,
                    teamId: projects.teamId,
                    teamName: teams.name,
                    createdAt: projects.createdAt,
                    updatedAt: projects.updatedAt,
                    dueDate: projects.dueDate,
                    totalTaskCount: count(tasks.id).mapWith(Number),
                    finishedTaskCount: sql<number>`sum(case when ${tasks.finished} = true then 1 else 0 end)`,
                })
                .from(teamMembers)
                .innerJoin(projects, eq(teamMembers.teamId, projects.teamId))
                .innerJoin(teams, eq(teamMembers.teamId, teams.id))
                .leftJoin(tasks, eq(tasks.projectId, projects.id)) // join tasks to projects
                .where(eq(teamMembers.userId, userId))
                .groupBy(projects.id, teams.name); // group to aggregate per project
            return success(200, "Projects successfully fetched", result);
        } catch {
            return failure(500, "Failed to fetch projects");
        }
    },
    create: async (data: CreateProject) => {
        try {
            const result = await db.transaction(async (tx) => {
                if (!data.name || !data.ownerId || !data.teamId) {
                    return failure(500, "Missing required fields");
                }
                const inserted = await tx
                    .insert(projects)
                    .values({
                        ...data,
                        dueDate: data.dueDate?.toISOString(),
                    })
                    .returning();

                const project = inserted[0];
                if (!project) return failure(500, "Failed to create project");

                const defaultLists = [
                    {
                        name: "To Do",
                        description: "Tasks to be done",
                        projectId: project.id,
                    },
                    {
                        name: "In Progress",
                        description: "Tasks currently being worked on",
                        projectId: project.id,
                    },
                    {
                        name: "Done",
                        description: "Completed tasks",
                        projectId: project.id,
                    },
                ].map((lists, idx) => ({
                    name: lists.name,
                    description: lists.description,
                    position: idx,
                    projectId: project.id,
                }));

                await tx.insert(lists).values(defaultLists);

                return success(200, "Project successfully created", project);
            });

            return result;
        } catch {
            return failure(500, "Failed to create project");
        }
    },
    update: async (
        projectSlug: string,
        data: UpdateProject,
        userId: string
    ) => {
        const member = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );
        if (!member) {
            return failure(
                400,
                "You are not authorized to update this project"
            );
        }

        const permission = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "update_project"
        );

        if (!permission) {
            return failure(
                400,
                "You are not authorized to update this project"
            );
        }

        try {
            const result = await db
                .update(projects)
                .set({
                    ...data,
                })
                .where(eq(projects.id, member.projectId))
                .returning();
            return success(200, "Project successfully updated", result);
        } catch {
            return failure(500, "Failed to update project");
        }
    },
    delete: async (projectSlug: string, userId: string) => {
        if (!projectSlug || !userId) {
            return failure(500, "Missing required fields");
        }
        const member = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );
        if (!member) {
            return failure(
                400,
                "You are not authorized to delete this project"
            );
        }

        const permission = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "delete_project"
        );

        if (!permission) {
            return failure(
                400,
                "You are not authorized to delete this project"
            );
        }

        try {
            const result = await db
                .delete(projects)
                .where(eq(projects.id, member.projectId))
                .returning();
            return success(200, "Project successfully deleted", result);
        } catch {
            return failure(500, "Failed to update project");
        }
    },
};
