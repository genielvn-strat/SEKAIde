import { roles } from "@/migrations/schema";
import { db } from "../db";
import { failure, success } from "@/types/Response";

export const roleQueries = {
    getRoles: async () => {
        try {
            const result = await db.select().from(roles);
            return success(200, "Roles fetch successfully", result);
        } catch {
            return failure(500, "Failed to fetch roles");
        }
    },
};
