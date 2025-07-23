import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
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
        create: async (data: any) => {
            const result = await db.insert(users).values(data).returning();
            return result[0];
        },
        update: async (id: string, data: any) => {
            const result = await db
                .update(users)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(users.id, id))
                .returning();
            return result[0];
        },
        delete: async (id: string) => {
            await db.delete(users).where(eq(users.id, id));
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
        getByOwner: async (ownerId: string) => {
            return await db
                .select()
                .from(teams)
                .where(eq(teams.ownerId, ownerId));
        },
        create: async (data: any) => {
            const result = await db.insert(teams).values(data).returning();
            return result[0];
        },
        update: async (id: string, data: any) => {
            const result = await db
                .update(teams)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(teams.id, id))
                .returning();
            return result[0];
        },
        delete: async (id: string) => {
            await db.delete(teams).where(eq(teams.id, id));
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
        create: async (data: any) => {
            const result = await db.insert(projects).values(data).returning();
            return result[0];
        },
        update: async (id: string, data: any) => {
            const result = await db
                .update(projects)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(projects.id, id))
                .returning();
            return result[0];
        },
        delete: async (id: string) => {
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
