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
} from "./schema";
import { eq } from "drizzle-orm";
import { Team, User } from "@/types";

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
        create: async (data: Partial<User>) => {
            if (!data.name || !data.clerkId || !data.username || !data.email) {
                throw new Error("Missing required fields");
            }
            const result = await db
                .insert(users)
                .values(data as User)
                .returning();
            return result[0];
        },
        update: async (data: Partial<User>) => {
            if (!data.clerkId) throw new Error("Missing required fields.");

            const user = await db
                .select()
                .from(users)
                .where(eq(users.clerkId, data.clerkId));

            if (!user) {
                throw new Error("User not in the database.");
            }

            const result = await db
                .update(users)
                .set({ ...data, updatedAt: new Date() })
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
                    teamId: teams.id,
                    teamName: teams.name,
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
        create: async (data: Partial<Team>) => {
            const result = await db.transaction(async (tx) => {
                if (!data.name || !data.ownerId) {
                    throw new Error("Missing required fields");
                }
                const insertedTeam = await tx
                    .insert(teams)
                    .values({
                        name: data.name,
                        ownerId: data.ownerId,
                    })
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
        update: async (id: string, data: any) => {
            const result = await db
                .update(teams)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(teams.id, id))
                .returning();
            return result[0];
        },
        delete: async (data: Partial<Team>) => {
            if (!data.id || !data.ownerId) {
                throw new Error("Missing required fields");
            }
            const team = await db
                .select()
                .from(teams)
                .where(eq(teams.id, data.id));

            if (!team[0]) {
                throw new Error("Team not found");
            }

            if (team[0].ownerId !== data.ownerId) {
                throw new Error("You are not authorized to delete this team");
            }

            await db.delete(teams).where(eq(teams.id, data.id));
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
        create: async (data: any) => {
            const result = await db
                .insert(teamMembers)
                .values(data)
                .returning();
            return result[0];
        },
        update: async (id: string, data: any) => {
            const result = await db
                .update(teamMembers)
                .set(data)
                .where(eq(teamMembers.id, id))
                .returning();
            return result[0];
        },
        delete: async (id: string) => {
            await db.delete(teamMembers).where(eq(teamMembers.id, id));
        },
    },

    projects: {
        getById: async (id: string) => {
            const result = await db
                .select()
                .from(projects)
                .where(eq(projects.id, id));
            return result[0] || null;
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
                    teamName: teams.name,
                })
                .from(teamMembers)
                .innerJoin(projects, eq(teamMembers.teamId, projects.teamId))
                .innerJoin(teams, eq(teamMembers.teamId, teams.id))
                .where(eq(teamMembers.userId, userId));
            return result;
        },
        create: async (data: Partial<Project>) => {
            if (!data.name || !data.ownerId || !data.teamId) {
                throw new Error("Missing required fields.");
            }
            const result = await db
                .insert(projects)
                .values({
                    name: data.name,
                    ownerId: data.ownerId,
                    teamId: data.teamId,
                    description: data.description ?? "A project.",
                })
                .returning();
            return result[0];
        },
        update: async (data: Partial<Project>) => {
            if (!data.id || !data.ownerId) {
                throw new Error("Missing required fields");
            }
            const project = await db
                .select()
                .from(projects)
                .where(eq(projects.id, data.id));

            if (!project[0]) {
                throw new Error("Project not found");
            }

            if (project[0].ownerId !== data.ownerId) {
                throw new Error("You are not authorized to delete this team");
            }

            const result = await db
                .update(projects)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(projects.id, data.id))
                .returning();
            return result[0];
        },
        delete: async (data: Partial<Project>) => {
            if (!data.id || !data.ownerId) {
                throw new Error("Missing required fields");
            }
            const project = await db
                .select()
                .from(projects)
                .where(eq(projects.id, data.id));

            if (!project[0]) {
                throw new Error("Team not found");
            }

            if (project[0].ownerId !== data.ownerId) {
                throw new Error("You are not authorized to delete this team");
            }

            await db.delete(projects).where(eq(projects.id, data.id));
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
        getByProject: async (projectId: string) => {
            return await db
                .select()
                .from(tasks)
                .where(eq(tasks.projectId, projectId));
        },
        create: async (data: any) => {
            const result = await db.insert(tasks).values(data).returning();
            return result[0];
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
