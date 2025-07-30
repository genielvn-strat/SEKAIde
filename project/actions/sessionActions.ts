"use server";

import { queries } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const getSession = async () => {
    const session = auth();
    if (!session.userId) throw new Error("Not logged in");
    return session;
};

export const getUserDbId = async () => {
    const session = await getSession();
    const user = await queries.users.getByClerkId(session.userId);
    if (!user) throw new Error("User not found in DB");
    return user.id;
};
