"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";

export const fetchTeamMembersBySlug = async (teamSlug: string) => {
    const userId = await getUserDbId();

    return await queries.teamMembers.getByTeamSlug(teamSlug, userId);
};
