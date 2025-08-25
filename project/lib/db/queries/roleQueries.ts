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
            const role = await db
                .select()
                .from(roles)
                .where(eq(roles.id, member.roleId))
                .then((res) => res[0] ?? null);

            if (!role || role.priority === null || role.priority === undefined)
                return failure(404, "Member role not found");

            const result = await db
                .select()
                .from(roles)
                .where(gte(roles.priority, role.priority))
                .orderBy(asc(roles.priority));
            return success(200, "Roles fetch successfully", result);
        } catch {
            return failure(500, "Failed to fetch roles");
        }
    },
};
