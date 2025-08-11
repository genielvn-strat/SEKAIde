import { teamMembers, users } from "@/migrations/schema";
import { eq } from "drizzle-orm";
import { TeamMember } from "@/types/TeamMember";
import { db } from "../db";
import { authorization } from "./authorizationQueries";
import { failure, success } from "@/types/Response";

export const teamMemberQueries = {
    getByUser: async (userId: string) => {
        return await db
            .select()
            .from(teamMembers)
            .where(eq(teamMembers.userId, userId));
    },
    getByTeamSlug: async (teamSlug: string, userId: string) => {
        const member = await authorization.checkIfTeamMemberByTeamSlug(
            teamSlug,
            userId
        );

        if (!member)
            return failure(
                400,
                "You are not authorized to view this team members"
            );

        try {
            const result = await db
                .select({
                    userId: users.id,
                    name: users.name,
                    username: users.username,
                    role: teamMembers.role,
                    inviteConfirmed: teamMembers.inviteConfirmed,
                })
                .from(teamMembers)
                .innerJoin(users, eq(users.id, teamMembers.userId))
                .where(eq(teamMembers.teamId, member.teamId));
            return success(200, "Team members fetched successfully", result);
        } catch {
            return failure(500, "Failed to fetch team members");
        }
    },
    accept: "", // Set invite to true
    reject: "", // Delete the row
    invite: "",
    kick: "", // prolly like leave the team
    update: "",
};
