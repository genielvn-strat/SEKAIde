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
import { and, eq, or } from "drizzle-orm";
import { Task } from "@/types/Task";
import { CreateProject, Project, UpdateProject } from "@/types/Project";
import { TeamMember } from "@/types/TeamMember";
import { CreateTeam, Team, UpdateTeam } from "@/types/Team";
import { CreateUser, UpdateUser, User } from "@/types/User";
import { nanoid } from "nanoid";
import slugify from "slugify";

config({ path: ".env" });
export const db = drizzle(process.env.DATABASE_URL!);

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
            if (clerkId) throw new Error("Missing required fields.");

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
            return await db
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
        },
        getByOwner: async (ownerId: string) => {
            return await db
                .select()
                .from(teams)
                .where(eq(teams.ownerId, ownerId));
        },
        getBySlug: async (slug: string, userId: string) => {
            if (!slug || !userId) throw new Error("Missing required fields");

            const result = await db
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

            return result;
        },
        create: async (data: CreateTeam) => {
            const result = await db.transaction(async (tx) => {
                if (!data.name || !data.ownerId) {
                    throw new Error("Missing required fields");
                }

                const insertedTeam = await tx
                    .insert(teams)
                    .values(data)
                    .returning();
                const team = insertedTeam[0];

                if (!team) throw new Error("Failed to create team.");

                // create a team member for this user as well
                await tx.insert(teamMembers).values({
                    teamId: team.id,
                    userId: data.ownerId,
                    role: "admin",
                    inviteConfirmed: true,
                });
                return team;
            });

            return result;
        },
        update: async (teamId: string, data: UpdateTeam, ownerId: string) => {
            if (!teamId || !ownerId) {
                throw new Error("Missing required fields");
            }
            const team = await db
                .select()
                .from(teams)
                .where(eq(teams.id, teamId));

            if (!team[0]) {
                throw new Error("Team not found");
            }

            if (team[0].ownerId !== ownerId) {
                throw new Error("You are not authorized to delete this team");
            }

            const result = await db
                .update(teams)
                .set({ ...data })
                .where(eq(teams.id, teamId))
                .returning();
            return result[0];
        },
        delete: async (teamId: string, ownerId: string) => {
            if (!teamId || !ownerId) {
                throw new Error("Missing required fields");
            }
            const team = await db
                .select()
                .from(teams)
                .where(eq(teams.id, teamId));

            if (!team[0]) {
                throw new Error("Team not found");
            }

            if (team[0].ownerId !== ownerId) {
                throw new Error("You are not authorized to delete this team");
            }

            await db.delete(teams).where(eq(teams.id, teamId));
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
        getBySlug: async (slug: string, userId: string) => {
            if (!slug || !userId) throw new Error("Missing required fields");

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
                        eq(projects.slug, slug),
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

                const defaultLists = ["Backlog", "Todo", "Doing", "Done"].map(
                    (name, idx) => ({
                        name,
                        position: idx,
                        projectId: project.id,
                    })
                );

                await tx.insert(lists).values(defaultLists);

                return project;
            });

            return result;
        },
        update: async (
            projectId: string,
            data: UpdateProject,
            user: string
        ) => {
            const project = await db
                .select()
                .from(projects)
                .where(eq(projects.id, projectId));

            if (!project[0]) {
                throw new Error("Project not found");
            }

            if (project[0].ownerId !== user) {
                throw new Error("You are not authorized to delete this team");
            }

            const result = await db
                .update(projects)
                .set({
                    ...data,
                })
                .where(eq(projects.id, projectId))
                .returning();
            return result[0];
        },
        delete: async (id: string, ownerId: string) => {
            if (!id || !ownerId) {
                throw new Error("Missing required fields");
            }
            const project = await db
                .select()
                .from(projects)
                .where(eq(projects.id, id));

            if (!project[0]) {
                throw new Error("Project not found");
            }

            if (project[0].ownerId !== ownerId) {
                throw new Error(
                    "You are not authorized to delete this project"
                );
            }

            await db.delete(projects).where(eq(projects.id, id));
        },
    },

    lists: {
        getByProject: async (projectId: string) => {
            return await db
                .select()
                .from(lists)
                .where(eq(lists.projectId, projectId));
        },
        create: async (data: any) => {
            const result = await db.insert(lists).values(data).returning();
            return result[0];
        },
        update: async (id: string, data: any) => {
            const result = await db
                .update(lists)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(lists.id, id))
                .returning();
            return result[0];
        },
        delete: async (id: string) => {
            await db.delete(lists).where(eq(lists.id, id));
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
        getByProject: async (projectId: string) => {
            return await db
                .select()
                .from(tasks)
                .where(eq(tasks.projectId, projectId));
        },
        create: async (data: Partial<Task>, slug: string) => {
            // if (
            //     !data.title ||
            //     !data.assigneeId ||
            //     !data.createdBy ||
            //     !data.listId
            // )
            //     throw new Error("Missing required fields");
            // const project = await db
            //     .select({ teamId: projects.teamId, id: projects.id })
            //     .from(projects)
            //     .where(eq(projects.slug, slug))
            //     .then((res) => res[0]);
            // if (!project) throw new Error("Project not found");
            // const isMember = await db
            //     .select()
            //     .from(teamMembers)
            //     .where(
            //         and(
            //             eq(teamMembers.teamId, project.teamId!),
            //             eq(teamMembers.userId, data.assigneeId)
            //         )
            //     )
            //     .then((res) => res[0] ?? null);
            // if (!isMember) throw new Error("You are not part of the team");
            // if (isMember.role == "member")
            //     throw new Error(
            //         "You are not the project manager or an admin to assign tasks."
            //     );
            // const result = await db
            //     .insert(tasks)
            //     .values({
            //         ...data,
            //     })
            //     .returning();
            // title: data.title!,
            // description: data.description ?? "",
            // projectId: project.id,
            // assigneeId: data.assigneeId,
            // priority: data.priority ?? "low",
            // createdBy: isMember.id,
            // dueDate: data.dueDate ? new Date(data.dueDate) : null,
            // position: data.position
            // return result[0];
        },

        update: async (id: string, data: any) => {
            const result = await db
                .update(tasks)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(tasks.id, id))
                .returning();
            return result[0];
        },
        delete: async (id: string) => {
            await db.delete(tasks).where(eq(tasks.id, id));
        },
    },

    comments: {
        getByTask: async (taskId: string) => {
            return await db
                .select()
                .from(comments)
                .where(eq(comments.taskId, taskId));
        },
        create: async (data: any) => {
            const result = await db.insert(comments).values(data).returning();
            return result[0];
        },
        update: async (id: string, data: any) => {
            const result = await db
                .update(comments)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(comments.id, id))
                .returning();
            return result[0];
        },
        delete: async (id: string) => {
            await db.delete(comments).where(eq(comments.id, id));
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
