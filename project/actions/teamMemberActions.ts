"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";

export const fetchTeamMembersBySlug = async (teamSlug: string) => {
    const userId = await getUserDbId();
    return await queries.teamMembers.getByTeamSlug(teamSlug, userId);
};

export const deleteMember = async (teamSlug: string, targerUserId: string) => {
    const userId = await getUserDbId();
    return await queries.teamMembers.deleteMember(
        teamSlug,
        targerUserId,
        userId
    );
};
