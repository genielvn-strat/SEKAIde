"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import {
    CreateTeamMemberInput,
    UpdateTeamMemberInput,
} from "@/lib/validations";

export const fetchTeamMembersByTeamSlug = async (teamSlug: string) => {
    const userId = await getUserDbId();
    const members = await queries.teamMembers.getByTeamSlug(teamSlug, userId);
    if (!members.success) throw new Error(members.message);
    return members;
};
export const fetchTeamMembersByProjectSlug = async (projectSlug: string) => {
    const userId = await getUserDbId();
    const members = await queries.teamMembers.getByProjectSlug(
        projectSlug,
        userId
    );
    if (!members.success) throw new Error(members.message);
    return members;
};
export const createMember = async (
    teamSlug: string,
    data: CreateTeamMemberInput
) => {
    const userId = await getUserDbId();
    return await queries.teamMembers.invite(teamSlug, data, userId);
};
export const updateMember = async (
    teamSlug: string,
    teamMemberUserId: string,
    data: UpdateTeamMemberInput
) => {
    const userId = await getUserDbId();
    return await queries.teamMembers.update(
        teamSlug,
        teamMemberUserId,
        data,
        userId
    );
};
export const deleteMember = async (teamSlug: string, targerUserId: string) => {
    const userId = await getUserDbId();
    return await queries.teamMembers.kick(teamSlug, targerUserId, userId);
};

export const acceptMembership = async (teamMemberId: string) => {
    return await queries.teamMembers.accept(teamMemberId);
};
export const rejectMembership = async (teamMemberId: string) => {
    return await queries.teamMembers.reject(teamMemberId);
};
export const leaveMember = async (teamSlug: string) => {
    const userId = await getUserDbId();
    return await queries.teamMembers.leave(teamSlug, userId);
};
