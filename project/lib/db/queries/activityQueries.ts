import { failure, success } from "@/types/Response";
import { authorization } from "./authorizationQueries";
import { db } from "../db";
import { activityLogs, permissions, teams, users } from "@/migrations/schema";
import { desc, eq } from "drizzle-orm";
import { FetchTeamActivity } from "@/types/ServerResponses";

export const activityQueries = {
    getTeamActivity: async (teamSlug: string, userId: string) => {
        const member = authorization.checkIfTeamMemberByTeamSlug(
            teamSlug,
            userId
        );
        if (!member)
            return failure(
                400,
                "You are not authorized to see the team's activities."
            );

        try {
            const result: FetchTeamActivity[] = await db
                .select({
                    userFullName: users.name,
                    userName: users.username,
                    userDisplayPicture: users.displayPictureLink,
                    permissionName: permissions.name,
                    description: activityLogs.description,
                    createdAt: activityLogs.createdAt,
                })
                .from(activityLogs)
                .innerJoin(
                    permissions,
                    eq(permissions.id, activityLogs.permissionId)
                )
                .innerJoin(teams, eq(teams.id, activityLogs.teamId))
                .leftJoin(users, eq(users.id, activityLogs.userId))
                .where(eq(teams.slug, teamSlug))
                .orderBy(desc(activityLogs.createdAt));
            return success(200, "Team Activity fetched successfully", result);
        } catch {
            return failure(500, "Failed to fetch team activity");
        }
    },
};
