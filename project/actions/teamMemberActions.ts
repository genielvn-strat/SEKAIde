"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { CreateTeamMemberInput } from "@/lib/validations";
import { CreateTeamMember } from "@/types/TeamMember";

export const fetchTeamMembersBySlug = async (teamSlug: string) => {
    const userId = await getUserDbId();
    return await queries.teamMembers.getByTeamSlug(teamSlug, userId);
};
export const createMember = async (
    teamSlug: string,
    data: CreateTeamMemberInput
) => {
    const userId = await getUserDbId();
    return await queries.teamMembers.invite(teamSlug, data, userId);
};

export const deleteMember = async (teamSlug: string, targerUserId: string) => {
    const userId = await getUserDbId();
    return await queries.teamMembers.kick(teamSlug, targerUserId, userId);
};
export const leaveMember = async (teamSlug: string) => {
    const userId = await getUserDbId();
    return await queries.teamMembers.leave(teamSlug, userId);
};
