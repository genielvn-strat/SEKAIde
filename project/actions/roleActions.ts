"use server";

import { queries } from "@/lib/db";
import { authorization } from "@/lib/db/queries/authorizationQueries";
import { getUserDbId } from "./sessionActions";

export const fetchRoles = async () => {
    const result = await queries.roles.getRoles();
    return result;
};

export const authRoleByTeamSlug = async (teamSlug: string, action: string) => {
    const userId = await getUserDbId();
    const result = await authorization.checkIfRoleHasPermissionByTeamSlug(
        userId,
        teamSlug,
        action
    );
    console.log(userId, teamSlug, action, !!result);
    return !!result;
};
