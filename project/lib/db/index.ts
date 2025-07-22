import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { projects, tasks } from "./schema";
import { eq } from "drizzle-orm";

config({ path: ".env" });
export const db = drizzle(process.env.DATABASE_URL!);

export const queries = {
    projects: {
        getAll: async () => {
            return await db.select().from(projects);
        },
        getById: async (id: string) => {
            const result = await db
                .select()
                .from(projects)
                .where(eq(projects.id, id));
            return result[0] || null;
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
