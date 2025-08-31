"use server";
import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";

export const fetchTeamActivity = async (teamSlug: string) => {
    const userId = await getUserDbId();
    const activities = await queries.teamActivity.getTeamActivity(
        teamSlug,
        userId
    );
    if (!activities.success) throw new Error(activities.message);
    return activities;
};
