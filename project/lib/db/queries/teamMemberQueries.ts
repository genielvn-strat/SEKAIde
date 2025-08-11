import { teamMembers } from "@/migrations/schema";
import { eq } from "drizzle-orm";
import { TeamMember } from "@/types/TeamMember";
import { db } from "../db";

export const teamMemberQueries = {
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
    accept: "", // Set invite to true
    reject: "", // Delete the row
    invite: async (data: Partial<TeamMember>) => {
        if (!data.teamId || !data.userId)
            throw new Error("Missing required fields");
        const result = await db
            .insert(teamMembers)
            .values({
                teamId: data.teamId,
                userId: data.userId,
                role: "member",
                inviteConfirmed: false,
            })
            .returning();
        return result[0];
    },
    delete: "", // prolly like leave the team
    update: async (id: string, data: any) => {
        const result = await db
            .update(teamMembers)
            .set(data)
            .where(eq(teamMembers.id, id))
            .returning();
        return result[0];
    },
};
