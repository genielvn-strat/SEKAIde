import {
    projects,
    teams,
    teamMembers,
    lists,
    tasks,
    activityLogs,
} from "@/migrations/schema";
import { and, count, desc, eq, or, sql } from "drizzle-orm";
import { CreateProject, UpdateProject } from "@/types/Project";
import { failure, success } from "@/types/Response";
import { FetchProject } from "@/types/ServerResponses";
import { authorization } from "./authorizationQueries";
import { db } from "../db";
import { CreateList } from "@/types/List";

const defaultList = (projectId: string) => [
    {
        name: "To Do",
        description: "Tasks to be done",
        projectId: projectId,
        color: "red" as const,
        isFinal: false,
    },
    {
        name: "In Progress",
        description: "Tasks currently being worked on",
        projectId: projectId,
        color: "blue" as const,
        isFinal: false,
    },
    {
        name: "Done",
        description: "Completed tasks",
        projectId: projectId,
        color: "green" as const,
        isFinal: true,
    },
];
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
                    totalTaskCount: count(tasks.id).mapWith(Number),
                })
                .from(projects)
                .innerJoin(teams, eq(projects.teamId, teams.id))
                .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
                .leftJoin(tasks, eq(tasks.projectId, projects.id)) // include tasks
                .where(
                    and(
                        eq(projects.slug, projectSlug),
                        or(
                            eq(projects.ownerId, userId),
                            eq(teamMembers.userId, userId)
                        )
                    )
                )
                .groupBy(projects.id, teams.name) // aggregate per project

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
                .leftJoin(tasks, eq(tasks.projectId, projects.id))
                .where(
                    and(
                        eq(teamMembers.userId, userId),
                        eq(teamMembers.inviteConfirmed, true)
                    )
                )
                .groupBy(projects.id, teams.name)
                .orderBy(desc(projects.updatedAt));
            return success(200, "Projects successfully fetched", result);
        } catch {
            return failure(500, "Failed to fetch projects");
        }
    },
    create: async (data: CreateProject, userId: string) => {
        const member = await authorization.checkIfTeamMemberByTeamId(
            data.teamId,
            userId
        );
        if (!member) {
            return failure(
                400,
                "You are not authorized to create a project on this team."
            );
        }

        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "create_project"
        );
        if (!permitted) {
            return failure(
                400,
                "You are not authorized to create a project on this team."
            );
        }

        try {
            const result = await db.transaction(async (tx) => {
                const inserted = await tx
                    .insert(projects)
                    .values({
                        ...data,
                        dueDate: data.dueDate?.toISOString(),
                    })
                    .returning();

                const project = inserted[0];
                if (!project) return failure(500, "Failed to create project");

                const defaultLists: CreateList[] = defaultList(project.id).map(
                    (lists, idx) => ({
                        name: lists.name,
                        description: lists.description,
                        position: idx,
                        projectId: project.id,
                        color: lists.color,
                        isFinal: lists.isFinal,
                    })
                );

                await tx.insert(lists).values(defaultLists);

                await tx.insert(activityLogs).values({
                    teamId: member.teamId,
                    permissionId: permitted.id,
                    userId: member.id,
                    description: `A project named ${inserted[0].name} has been created by ${member.userFullName}.`,
                });

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

        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "update_project"
        );

        if (!permitted) {
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
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(projects.id, member.projectId))
                .returning();
            await db.insert(activityLogs).values({
                teamId: member.teamId,
                permissionId: permitted.id,
                userId: member.id,
                description: `${member.userFullName} has made changes to ${member.projectName}.`,
            });
            return success(200, "Project successfully updated", result);
        } catch {
            return failure(500, "Failed to update project");
        }
    },
    delete: async (projectId: string, userId: string) => {
        if (!projectId || !userId) {
            return failure(500, "Missing required fields");
        }
        const member = await authorization.checkIfTeamMemberByProjectId(
            projectId,
            userId
        );
        if (!member) {
            return failure(
                400,
                "You are not authorized to delete this project"
            );
        }

        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "delete_project"
        );

        if (!permitted) {
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
            await db.insert(activityLogs).values({
                teamId: member.teamId,
                permissionId: permitted.id,
                userId: member.id,
                description: ` ${member.projectName} has been deleted by ${member.userFullName}.`,
            });
            return success(200, "Project successfully deleted", result);
        } catch {
            return failure(500, "Failed to update project");
        }
    },
    reset: async (projectId: string, userId: string) => {
        if (!projectId || !userId) {
            return failure(500, "Missing required fields");
        }
        const member = await authorization.checkIfTeamMemberByProjectId(
            projectId,
            userId
        );
        if (!member) {
            return failure(
                400,
                "You are not authorized to reset this project"
            );
        }

        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "reset_project"
        );

        if (!permitted) {
            return failure(
                400,
                "You are not authorized to reset this project"
            );
        }

        try {
            const tasksDeleted = await db
                .delete(tasks)
                .where(eq(tasks.projectId, member.projectId))
                .returning();
            const listsDeleted = await db
                .delete(lists)
                .where(eq(lists.projectId, member.projectId))
                .returning();
            const defaultLists: CreateList[] = defaultList(
                member.projectId
            ).map((lists, idx) => ({
                name: lists.name,
                description: lists.description,
                position: idx,
                projectId: member.projectId,
                color: lists.color,
                isFinal: lists.isFinal,
            }));

            const listsCreated = await db
                .insert(lists)
                .values(defaultLists)
                .returning();
            await db.insert(activityLogs).values({
                teamId: member.teamId,
                permissionId: permitted.id,
                userId: member.id,
                description: ` ${member.projectName} has been reset by ${member.userFullName}.`,
            });
            return success(200, "Project successfully reset to default", {
                tasksDeleted,
                listsDeleted,
                listsCreated,
            });
        } catch {
            return failure(500, "Failed to update project");
        }
    },
};
