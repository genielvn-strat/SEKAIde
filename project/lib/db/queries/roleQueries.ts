import { roles } from "@/migrations/schema";
import { db } from "../db";
import { failure, success } from "@/types/Response";
import { authorization } from "./authorizationQueries";
import { asc, eq, gte } from "drizzle-orm";
import { de } from "date-fns/locale";

export const roleQueries = {
    getRoles: async (userId: string, teamSlug: string) => {
        const member = await authorization.checkIfTeamMemberBySlug(
            teamSlug,
            userId
        );

        if (!member) {
            return failure(400, "Not authorized to fetch roles");
        }

        try {
            const result = await db
                .select()
                .from(roles)
                .where(gte(roles.priority, member.rolePriority))
                .orderBy(asc(roles.priority));
            return success(200, "Roles fetch successfully", result);
        } catch {
            return failure(500, "Failed to fetch roles");
        }
    },
};
