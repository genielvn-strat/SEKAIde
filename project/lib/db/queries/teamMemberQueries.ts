import { teamMembers, users } from "@/migrations/schema";
import { and, eq, ne } from "drizzle-orm";
import { TeamMember } from "@/types/TeamMember";
import { db } from "../db";
import { authorization } from "./authorizationQueries";
import { failure, success } from "@/types/Response";
import { FetchTeamMember } from "@/types/ServerResponses";

export const teamMemberQueries = {
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
            const result: FetchTeamMember[] = await db
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
    deleteMember: async (
        teamSlug: string,
        targetUserId: string,
        userId: string
    ) => {
        const member = await authorization.checkIfTeamMemberByTeamSlug(
            teamSlug,
            userId
        );

        if (
            !member ||
            !member.role ||
            !authorization.checkIfHasRole(member.role, [
                "project_manager",
                "admin",
            ])
        )
            return failure(400, "Cannot kick this member (not found or admin)");
        console.log(targetUserId, member.userId);
        if (targetUserId === member.userId) {
            return failure(400, "You cannot kick yourself");
        }

        try {
            const targetMember = await db
                .select({ id: teamMembers.id, role: teamMembers.role })
                .from(teamMembers)
                .where(
                    and(
                        eq(teamMembers.userId, targetUserId),
                        eq(teamMembers.teamId, member.teamId),
                        ne(teamMembers.role, "admin") // is not an admin
                    )
                )
                .then((res) => res[0] ?? null);

            if (!targetMember) return failure(400, "This member is an admin.");

            const result = await db
                .delete(teamMembers)
                .where(eq(teamMembers.id, targetMember.id))
                .returning();

            return success(200, "Team member kicked successfully", result);
        } catch {
            return failure(500, "Failed to kick member");
        }
    },
    update: "",
};
