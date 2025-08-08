import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-serverless";
import {
    users,
    tasks,
    projects,
    teams,
    teamMembers,
    lists,
    comments,
} from "@/migrations/schema";
import { and, asc, desc, eq, or, sql } from "drizzle-orm";
import { CreateTask, Task, UpdateTask } from "@/types/Task";
import { CreateProject, Project, UpdateProject } from "@/types/Project";
import { TeamMember } from "@/types/TeamMember";
import { CreateTeam, Team, UpdateTeam } from "@/types/Team";
import { CreateUser, UpdateUser, User } from "@/types/User";
import { CreateList, UpdateList } from "@/types/List";
import { CreateComment, UpdateComment } from "@/types/Comment";
import { failure, success } from "@/types/Response";
import { fail } from "assert";
import {
    FetchJoinedTeams,
    FetchOwnedTeams,
    FetchTeamDetails,
} from "@/types/ServerResponses";

config({ path: ".env" });
export const db = drizzle(process.env.DATABASE_URL!);

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
            .where(eq(projects.slug, projectSlug))
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
};
export const queries = {
    users: {
        getById: async (id: string) => {
            const result = await db
                .select()
                .from(users)
                .where(eq(users.id, id));
            return result[0] || null;
        },
        getByClerkId: async (clerkId: string) => {
            const result = await db
                .select()
                .from(users)
                .where(eq(users.clerkId, clerkId));
            return result[0] || null;
        },
        create: async (data: CreateUser) => {
            if (!data.name || !data.clerkId || !data.username || !data.email) {
                throw new Error("Missing required fields");
            }
            const result = await db.insert(users).values(data).returning();
            return result[0];
        },
        update: async (data: UpdateUser, clerkId: string) => {
            if (!clerkId) throw new Error("Missing required fields.");

            const user = await db
                .select()
                .from(users)
                .where(eq(users.clerkId, clerkId));

            if (!user) {
                throw new Error("User not in the database.");
            }

            const result = await db
                .update(users)
                .set({ ...data })
                .where(eq(users.id, user[0].id))
                .returning();
            return result[0];
        },
        delete: async (cleckId: string) => {
            await db.delete(users).where(eq(users.clerkId, cleckId));
        },
    },

    teams: {
        getById: async (id: string) => {
            const result = await db
                .select()
                .from(teams)
                .where(eq(teams.id, id));
            return result[0] || null;
        },
        getJoinedTeams: async (userId: string) => {
            try {
                const result: FetchJoinedTeams[] = await db
                    .select({
                        id: teams.id,
                        teamName: teams.name,
                        slug: teams.slug,
                        role: teamMembers.role,
                        inviteConfirmed: teamMembers.inviteConfirmed,
                        createdAt: teams.createdAt,
                        updatedAt: teams.updatedAt,
                    })
                    .from(teamMembers)
                    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
                    .where(eq(teamMembers.userId, userId));
                return success(
                    200,
                    "Joined teams successfully fetched",
                    result
                );
            } catch {
                return failure(500, "Failed to fetch joined teams");
            }
        },
        getByOwner: async (ownerId: string) => {
            try {
                const result: FetchOwnedTeams[] = await db
                    .select({
                        id: teams.id,
                        teamName: teams.name,
                        slug: teams.slug,
                        createdAt: teams.createdAt,
                        updatedAt: teams.updatedAt,
                    })
                    .from(teams)
                    .where(eq(teams.ownerId, ownerId));
                return success(200, "Owned teams successfully fetched", result);
            } catch {
                return failure(500, "Failed to fetch owned teams");
            }
        },
        getBySlug: async (slug: string, userId: string) => {
            if (!slug || !userId)
                return failure(400, "Missing required fields.");

            const isAuthorized =
                await authorization.checkIfTeamMemberByTeamSlug(slug, userId);

            if (!isAuthorized) return failure(404, "Not Found");
            try {
                const result: FetchTeamDetails = await db
                    .select({
                        id: teams.id,
                        name: teams.name,
                        slug: teams.slug,
                        ownerId: teams.ownerId,
                        createdAt: teams.createdAt,
                        updatedAt: teams.updatedAt,
                    })

                    .from(teams)
                    .leftJoin(teamMembers, eq(teams.id, teamMembers.teamId))
                    .where(
                        and(
                            eq(teams.slug, slug),
                            or(
                                eq(teams.ownerId, userId),
                                eq(teamMembers.userId, userId)
                            )
                        )
                    )
                    .then((res) => res[0] || null);

                return success(
                    200,
                    "Team details successfully fetched.",
                    result
                );
            } catch {
                return failure(500, "Failed to fetch team details");
            }
        },
        create: async (data: CreateTeam) => {
            const result = await db.transaction(async (tx) => {
                if (!data.name || !data.ownerId) {
                    return failure(400, "Missing required fields.");
                }

                try {
                    const insertedTeam = await tx
                        .insert(teams)
                        .values(data)
                        .returning();
                    const team = insertedTeam[0];

                    if (!team) throw new Error("Team creation failed");

                    // create a team member for this user as well
                    await tx.insert(teamMembers).values({
                        teamId: team.id,
                        userId: data.ownerId,
                        role: "admin",
                        inviteConfirmed: true,
                    });
                    return success(201, "Team created successfully", team);
                } catch {
                    return failure(500, "Team creation failed");
                }
            });

            return result;
        },
        update: async (teamId: string, data: UpdateTeam, userId: string) => {
            if (!teamId || !userId) {
                return failure(400, "Missing required fields");
            }
            const team = await authorization.checkIfTeamOwnedByUser(
                teamId,
                userId
            );

            if (!team) {
                return failure(
                    403,
                    "You are not authorized to update this team"
                );
            }

            try {
                const result = await db
                    .update(teams)
                    .set({ ...data })
                    .where(eq(teams.id, team.id))
                    .returning();
                return success(200, "Team updated successfully", result[0]);
            } catch {
                return failure(500, "Failed to update team");
            }
        },
        delete: async (teamId: string, userId: string) => {
            if (!teamId || !userId) {
                return failure(400, "Missing required fields");
            }
            const team = await authorization.checkIfTeamOwnedByUser(
                teamId,
                userId
            );

            if (!team) {
                return failure(
                    403,
                    "You are not authorized to delete this team"
                );
            }

            try {
                const result = await db
                    .delete(teams)
                    .where(eq(teams.id, teamId))
                    .returning();
                return success(200, "Team deleted successfully", result[0]);
            } catch {
                return failure(500, "Failed to delete team");
            }
        },
    },

    teamMembers: {
        getByUser: async (userId: string) => {
            return await db
                .select()
                .from(teamMembers)
                .where(eq(teamMembers.userId, userId));
        },
        getByTeam: async (teamId: string) => {
            return await db
                .select()
                .from(teamMembers)
                .where(eq(teamMembers.teamId, teamId));
        },
        accept: "", // Set invite to true
        reject: "", // Delete the row
        invite: async (data: Partial<TeamMember>) => {
            if (!data.teamId || !data.userId)
                throw new Error("Missing required fields");
            const result = await db
                .insert(teamMembers)
                .values({
                    teamId: data.teamId,
                    userId: data.userId,
                    role: "member",
                    inviteConfirmed: false,
                })
                .returning();
            return result[0];
        },
        delete: "", // prolly like leave the team
        update: async (id: string, data: any) => {
            const result = await db
                .update(teamMembers)
                .set(data)
                .where(eq(teamMembers.id, id))
                .returning();
            return result[0];
        },
    },

    projects: {
        getBySlug: async (projectSlug: string, userId: string) => {
            if (!projectSlug || !userId)
                throw new Error("Missing required fields");

            const isAuthorized =
                await authorization.checkIfTeamMemberByProjectSlug(
                    projectSlug,
                    userId
                );

            if (!isAuthorized) {
                return null;
            }

            const result = await db
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
                .leftJoin(teams, eq(projects.teamId, teams.id))
                .leftJoin(teamMembers, eq(teams.id, teamMembers.teamId))
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

            return result;
        },
        getByTeamId: async (teamId: string) => {
            return await db
                .select()
                .from(projects)
                .where(eq(projects.teamId, teamId));
        },
        getByOwnerId: async (ownerId: string) => {
            return await db
                .select()
                .from(projects)
                .where(eq(projects.ownerId, ownerId));
        },
        getByUserTeams: async (userId: string) => {
            const result = await db
                .select({
                    projectId: projects.id,
                    name: projects.name,
                    description: projects.description,
                    createdAt: projects.createdAt,
                    updatedAt: projects.updatedAt,
                    teamId: projects.teamId,
                    slug: projects.slug,
                    teamName: teams.name,
                })
                .from(teamMembers)
                .innerJoin(projects, eq(teamMembers.teamId, projects.teamId))
                .innerJoin(teams, eq(teamMembers.teamId, teams.id))
                .where(eq(teamMembers.userId, userId));
            return result;
        },
        create: async (data: CreateProject) => {
            const result = await db.transaction(async (tx) => {
                if (!data.name || !data.ownerId || !data.teamId) {
                    throw new Error("Missing required fields.");
                }
                const inserted = await tx
                    .insert(projects)
                    .values({
                        ...data,
                        dueDate: data.dueDate?.toISOString(),
                    })
                    .returning();

                const project = inserted[0];
                if (!project) throw new Error("Project creation failed");

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

                return project;
            });

            return result;
        },
        update: async (
            projectSlug: string,
            data: UpdateProject,
            userId: string
        ) => {
            const project = await authorization.checkIfProjectOwnedByUserBySlug(
                projectSlug,
                userId
            );

            if (!project) {
                throw new Error("You are not authorized to update this team");
            }

            const result = await db
                .update(projects)
                .set({
                    ...data,
                })
                .where(eq(projects.id, project.id))
                .returning();
            return result[0];
        },
        delete: async (projectSlug: string, userId: string) => {
            if (!projectSlug || !userId) {
                throw new Error("Missing required fields");
            }
            const project = await authorization.checkIfProjectOwnedByUserBySlug(
                projectSlug,
                userId
            );

            if (!project) {
                throw new Error(
                    "You are not authorized to delete this project"
                );
            }

            await db.delete(projects).where(eq(projects.id, project.id));
        },
    },

    lists: {
        getByProject: async (projectId: string) => {
            return await db
                .select()
                .from(lists)
                .where(eq(lists.projectId, projectId));
        },
        getByProjectSlug: async (projectSlug: string, userId: string) => {
            const member = await authorization.checkIfTeamMemberByProjectSlug(
                projectSlug,
                userId
            );

            if (!member) {
                throw new Error("Not authorized to view this project.");
            }

            return await db
                .select({
                    id: lists.id,
                    name: lists.name,
                    description: lists.description,
                    position: lists.position,
                })
                .from(lists)
                .leftJoin(projects, eq(lists.projectId, projects.id))
                .where(eq(projects.slug, projectSlug))
                .orderBy(asc(lists.position));
        },
        create: async (
            data: CreateList,
            userId: string,
            projectSlug: string
        ) => {
            // 1. Find the project by slug
            const project = await db
                .select({ id: projects.id })
                .from(projects)
                .where(eq(projects.slug, projectSlug))
                .then((res) => res[0] ?? null);

            if (!project) {
                throw new Error("Project not found");
            }

            // 2. Check if the user is part of the team and is a project_manager or admin
            const member = await authorization.checkIfTeamMemberByProjectSlug(
                projectSlug,
                userId
            );

            if (
                !member ||
                (member.role != "project_manager" && member.role != "admin")
            ) {
                throw new Error(
                    "Not authorized to create list in this project"
                );
            }

            const result = await db
                .insert(lists)
                .values({
                    ...data,
                    projectId: project.id,
                })
                .returning();

            return result[0];
        },
        update: async (
            data: UpdateList,
            listId: string,
            userId: string,
            projectSlug: string
        ) => {
            if (!data || !listId || !userId || !projectSlug) {
                throw new Error("Missing required fields");
            }

            const list = await authorization.checkIfListBelongsToProjectBySlug(
                projectSlug,
                listId
            );

            if (!list || !list.id || !list.projectId || !list.teamId) {
                throw new Error("List not found in this project");
            }

            const member = await authorization.checkIfTeamMemberByTeamId(
                list.teamId,
                userId
            );

            if (
                !member ||
                (member?.role !== "project_manager" && member?.role !== "admin")
            ) {
                throw new Error(
                    "Not authorized to create list in this project"
                );
            }

            const result = await db
                .update(lists)
                .set({
                    ...data,
                })
                .where(eq(lists.id, list.id))
                .returning();

            return result[0];
        },
        delete: async (listId: string, projectSlug: string, userId: string) => {
            const list = await authorization.checkIfListBelongsToProjectBySlug(
                projectSlug,
                listId
            );

            if (!list) {
                throw new Error("List not found in this project");
            }

            if (!list.teamId || !list.id) {
                throw new Error("List's project does not have a valid teamId");
            }

            const isAuthorized = await authorization.checkIfTeamMemberByTeamId(
                list.teamId,
                userId
            );

            if (!isAuthorized) {
                throw new Error("Not authorized to delete this list");
            }

            await db.delete(lists).where(eq(lists.id, list.id));
        },
    },
    tasks: {
        getByProjectSlug: async (slug: string) => {
            return await db
                .select()
                .from(tasks)
                .innerJoin(projects, eq(tasks.projectId, projects.id))
                .where(eq(projects.slug, slug));
        },
        getByTaskSlug: async (
            taskSlug: string,
            projectSlug: string,
            userId: string
        ) => {
            const isAuthorized =
                await authorization.checkIfTeamMemberByProjectSlug(
                    projectSlug,
                    userId
                );

            if (!isAuthorized) {
                throw new Error("Not authorized to view this task.");
            }

            const result = await db
                .select({
                    id: tasks.id,
                    title: tasks.title,
                    description: tasks.description,
                    priority: tasks.priority,
                    dueDate: tasks.dueDate,
                    position: tasks.position,
                    slug: tasks.slug,
                    assigneeName: users.name,
                    assigneeUsername: users.username,
                    projectName: projects.name,
                    projectSlug: projects.slug,
                })
                .from(tasks)
                .innerJoin(projects, eq(tasks.projectId, projects.id))
                .innerJoin(users, eq(tasks.assigneeId, users.id))
                .where(
                    and(
                        eq(tasks.slug, taskSlug),
                        eq(projects.slug, projectSlug)
                    )
                )
                .then((res) => res[0] || null);

            return result;
        },
        getByListId: async (projectSlug: string, listId: string) => {
            if (!projectSlug || !listId) {
                throw new Error("Missing required fields");
            }

            const list = await authorization.checkIfListBelongsToProjectBySlug(
                projectSlug,
                listId
            );

            if (!list || !list.id || !list.projectId) {
                throw new Error("List not found in this project");
            }

            const tasksInList = await db
                .select({
                    id: tasks.id,
                    title: tasks.title,
                    description: tasks.description,
                    priority: tasks.priority,
                    dueDate: tasks.dueDate,
                    position: tasks.position,
                    slug: tasks.slug,
                    assigneeName: users.name,
                    assigneeUsername: users.username,
                    projectName: projects.name,
                    projectSlug: projects.slug,
                })
                .from(tasks)
                .innerJoin(users, eq(tasks.assigneeId, users.id))
                .innerJoin(projects, eq(tasks.projectId, projects.id))
                .where(
                    and(
                        eq(projects.id, list.projectId),
                        eq(tasks.listId, list.id)
                    )
                )
                .orderBy(asc(tasks.position));

            if (!tasksInList) {
                throw new Error("No tasks found for this list");
            }

            return tasksInList;
        },
        getByProject: async (projectId: string) => {
            return await db
                .select()
                .from(tasks)
                .where(eq(tasks.projectId, projectId));
        },
        create: async (
            projectSlug: string,
            data: CreateTask,
            userId: string
        ) => {
            if (!data.title || !data.listId) {
                throw new Error("Missing required fields");
            }

            // Check if the user is part of the team and is a project_manager or admin
            const member = await authorization.checkIfTeamMemberByProjectSlug(
                projectSlug,
                userId
            );

            if (!member) {
                throw new Error(
                    "Not authorized to create task in this project"
                );
            }

            const project = await db
                .select()
                .from(projects)
                .where(eq(projects.slug, projectSlug))
                .then((res) => res[0] ?? null);

            if (!project) {
                throw new Error("Project not found");
            }

            const result = await db
                .insert(tasks)
                .values({
                    ...data,
                    projectId: project.id,
                    dueDate: data.dueDate?.toISOString(),
                })
                .returning();

            return result[0];
        },

        update: async (
            taskSlug: string,
            data: UpdateTask,
            projectSlug: string,
            userId: string
        ) => {
            // Check if task exists in the project
            const task = await authorization.checkIfTaskBelongsToProjectBySlug(
                projectSlug,
                taskSlug
            );

            if (!task) {
                throw new Error("Task not found in this project");
            }

            if (!task.id || !task.projectId || !task.teamId) {
                throw new Error("Task does not have a valid ID or project");
            }

            // Check if the user is part of the team and is a project_manager or admin
            const isAuthorized = await authorization.checkIfTeamMemberByTeamId(
                task.teamId,
                userId
            );

            if (
                !isAuthorized ||
                (isAuthorized.role !== "project_manager" &&
                    isAuthorized.role !== "admin")
            ) {
                throw new Error("Not authorized to update this task");
            }

            const result = await db
                .update(tasks)
                .set({
                    ...data,
                    dueDate: data.dueDate
                        ? data.dueDate.toISOString()
                        : undefined,
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(tasks.id, task.id))
                .returning();
            return result[0];
        },
        delete: async (
            taskSlug: string,
            projectSlug: string,
            userId: string
        ) => {
            const task = await authorization.checkIfTaskBelongsToProjectBySlug(
                projectSlug,
                taskSlug
            );

            if (!task) {
                throw new Error("Task not found in this project");
            }
            if (!task.id || !task.projectId || !task.teamId) {
                throw new Error("Task do not have an ID");
            }

            const isAuthorized = await authorization.checkIfTeamMemberByTeamId(
                task.teamId,
                userId
            );

            if (!isAuthorized) {
                throw new Error("Not authorized to delete this task");
            }

            await db.delete(tasks).where(eq(tasks.id, task.id));
        },
    },

    comments: {
        getByTaskSlug: async (
            taskSlug: string,
            projectSlug: string,
            userId: string
        ) => {
            const isAuthorized =
                await authorization.checkIfTeamMemberByProjectSlug(
                    projectSlug,
                    userId
                );

            if (!isAuthorized) {
                throw new Error("Not authorized to view this task.");
            }

            const task = await authorization.checkIfTaskBelongsToProjectBySlug(
                projectSlug,
                taskSlug
            );

            if (!task) {
                throw new Error("Task not found in this project");
            }

            const result = await db
                .select({
                    id: comments.id,
                    content: comments.content,
                    taskId: comments.taskId,
                    authorId: comments.authorId,
                    createdAt: comments.createdAt,
                    updatedAt: comments.updatedAt,
                    authorName: users.name,
                    authorUsername: users.username,
                })
                .from(comments)
                .innerJoin(users, eq(comments.authorId, users.id))
                .where(eq(comments.taskId, task.id));

            return result;
        },
        create: async (
            taskSlug: string,
            projectSlug: string,
            userId: string,
            data: CreateComment
        ) => {
            const isAuthorized =
                await authorization.checkIfTeamMemberByProjectSlug(
                    projectSlug,
                    userId
                );

            if (!isAuthorized) {
                throw new Error(
                    "Not authorized to create comment in this task."
                );
            }

            const task = await authorization.checkIfTaskBelongsToProjectBySlug(
                projectSlug,
                taskSlug
            );

            if (!task) {
                throw new Error("Task not found in this project");
            }

            const result = await db
                .insert(comments)
                .values({
                    ...data,
                    taskId: task.id,
                    authorId: userId,
                })
                .returning();
            return result[0];
        },
        update: async (
            commentId: string,
            taskSlug: string,
            projectSlug: string,
            data: UpdateComment,
            userId: string
        ) => {
            const isAuthorized =
                await authorization.checkIfTeamMemberByProjectSlug(
                    projectSlug,
                    userId
                );

            if (!isAuthorized) {
                throw new Error("Not authorized to update this comment.");
            }

            const task = await authorization.checkIfTaskBelongsToProjectBySlug(
                projectSlug,
                taskSlug
            );

            if (!task) {
                throw new Error("Task not found in this project");
            }

            const result = await db
                .update(comments)
                .set({
                    ...data,
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(comments.id, commentId))
                .returning();
            return result[0];
        },
        delete: async (
            commentId: string,
            taskSlug: string,
            projectSlug: string,
            userId: string
        ) => {
            const isAuthorized =
                await authorization.checkIfTeamMemberByProjectSlug(
                    projectSlug,
                    userId
                );

            if (!isAuthorized) {
                throw new Error("Not authorized to delete this comment.");
            }

            const task = await authorization.checkIfTaskBelongsToProjectBySlug(
                projectSlug,
                taskSlug
            );

            if (!task) {
                throw new Error("Task not found in this project");
            }

            const comment = await db
                .select()
                .from(comments)
                .where(eq(comments.id, commentId))
                .then((res) => res[0] || null);

            if (!comment || comment.taskId !== task.id) {
                throw new Error("Comment not found in this task");
            }

            await db.delete(comments).where(eq(comments.id, commentId));
        },
    },
};

// TODO: Task 3.2 - Configure PostgreSQL database (Vercel Postgres or Neon)
// TODO: Task 3.5 - Implement database connection and query utilities

/*
TODO: Implementation Notes for Interns:

1. Choose database provider:
   - Vercel Postgres (recommended for Vercel deployment)
   - Neon (good alternative)
   - Local PostgreSQL for development

2. Set up environment variables:
   - DATABASE_URL
   - POSTGRES_URL (if using Vercel Postgres)

3. Configure Drizzle connection
4. Implement CRUD operations for all entities
5. Add proper error handling
6. Set up connection pooling if needed

Example structure:
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema'

export const db = drizzle(sql, { schema })

export const queries = {
  projects: {
    getAll: async () => { ... },
    getById: async (id: string) => { ... },
    create: async (data: any) => { ... },
    update: async (id: string, data: any) => { ... },
    delete: async (id: string) => { ... },
  },
  // ... other entity queries
}
*/

// Placeholder exports to prevent import errors
