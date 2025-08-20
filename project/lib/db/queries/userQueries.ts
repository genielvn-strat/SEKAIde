import { users } from "@/migrations/schema";
import { eq } from "drizzle-orm";
import { CreateUser, UpdateUser } from "@/types/User";
import { db } from "../db";

export const userQueries = {
    getByClerkId: async (clerkId: string) => {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.clerkId, clerkId));
        return result[0] || null;
    },
    create: async (data: CreateUser) => {
        
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
};
