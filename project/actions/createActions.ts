"use server";
import { createData } from "@/lib/db/queries/createDataQueries";

export const createPermissions = async () => {
    const comments = await createData.permissions();

    return comments;
};
export const createRolePermissions = async () => {
    const comments = await createData.rolePermissions();

    return comments;
};
