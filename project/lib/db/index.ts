import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { projectMembers, projects, tasks, users } from "./schema";
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
    projects: {
        getById: async (id: string) => {
            const result = await db
                .select()
                .from(projects)
                .where(eq(projects.id, id));
            return result[0] || null;
        },
        getByUserId: async (userId: string) => {
            const result = await db
                .select({
                    project: projects,
                })
                .from(projectMembers)
                .innerJoin(projects, eq(projectMembers.projectId, projects.id))
                .where(eq(projectMembers.userId, userId));

            return result.map((row) => row.project);
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
    projectMembers: {
        getByProject: async (projectId: string) => {
            return await db
                .select()
                .from(projectMembers)
                .where(eq(projectMembers.projectId, projectId));
        },
        getByUser: async (userId: string) => {
            return await db
                .select()
                .from(projectMembers)
                .where(eq(projectMembers.userId, userId));
        },
        create: async (data: any) => {
            const result = await db
                .insert(projectMembers)
                .values(data)
                .returning();
            return result[0];
        },
        confirmInvite: async (id: string) => {
            const result = await db
                .update(projectMembers)
                .set({ inviteConfirmed: true })
                .where(eq(projectMembers.id, id))
                .returning();
            return result[0];
        },
        delete: async (id: string) => {
            await db.delete(projectMembers).where(eq(projectMembers.id, id));
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
