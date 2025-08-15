"use server";

import { queries } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const getSession = async () => {
    const session = await auth();
    if (!session.userId) throw new Error("Not logged in");
    return session;
};

export const getUserDbId = async (userId?: string) => {
    if (!userId) userId = (await getSession()).userId;
    const user = await queries.users.getByClerkId(userId);
    if (!user) throw new Error("User not found in DB");
    return user.id;
};
