"use server";
import { createData } from "@/lib/db/queries/createDataQueries";

export const createRoles = async () => {
    const comments = await createData.roles();

    return comments;
};
export const createPermissions = async () => {
    const comments = await createData.permissions();

    return comments;
};
export const createRolePermissions = async () => {
    const comments = await createData.rolePermissions();

    return comments;
};
