"use server";
import { db } from "@/lib/db/db";
import {
    UpdateEmailInput,
    UpdateDetailsSchema,
    UpdatePasswordInput,
} from "@/lib/validations";
import { users } from "@/migrations/schema";
import { FetchUserSession } from "@/types/ServerResponses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

async function getClerkAndUser() {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authorized");
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    if (!user) throw new Error("User not found in Clerk's Database");

    return { clerk, userId, user };
}

export async function getAccountSessions() {
    try {
        const { userId, clerk } = await getClerkAndUser();

        const sessionsResponse = await clerk.sessions.getSessionList({
            userId,
        });

        const activeSessions = sessionsResponse.data.filter(
            (session) => session.status === "active"
        );

        const typedSessions: FetchUserSession[] = activeSessions.map(
            (session: any) => ({
                id: session.id,
                status: session.status,
                lastActiveAt: session.lastActiveAt
                    ? new Date(session.lastActiveAt).toISOString()
                    : null,
                createdAt: session.createdAt
                    ? new Date(session.createdAt).toISOString()
                    : undefined,
                updatedAt: session.updatedAt
                    ? new Date(session.updatedAt).toISOString()
                    : undefined,
                latestActivity: session.latestActivity
                    ? {
                          isMobile: session.latestActivity.isMobile ?? false,
                          ipAddress: session.latestActivity.ipAddress ?? "",
                          city: session.latestActivity.city ?? "",
                          country: session.latestActivity.country ?? "",
                          browserVersion:
                              session.latestActivity.browserVersion ?? "",
                          browserName: session.latestActivity.browserName ?? "",
                          deviceType: session.latestActivity.deviceType ?? "",
                      }
                    : undefined,
            })
        );
        return typedSessions;
    } catch (e: any) {
        if (e.errors) {
            const errorMessage =
                e.errors[0]?.message || "Failed to update name";
            throw new Error(errorMessage);
        }
        throw new Error("An error has occurred.");
    }
}

export async function updateDetails(data: UpdateDetailsSchema) {
    try {
        const { userId, clerk } = await getClerkAndUser();
        const results = await clerk.users.updateUser(userId, {
            firstName: data.firstName,
            lastName: data.lastName,
        });

        if (data.avatar) {
            await clerk.users.updateUserProfileImage(userId, {
                file: data.avatar as File,
            });
        }

        await db
            .update(users)
            .set({
                name: `${(data.firstName, data.lastName)}`,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(users.clerkId, userId));
    } catch (e: any) {
        if (e.errors) {
            const errorMessage =
                e.errors[0]?.message || "Failed to update name";
            throw new Error(errorMessage);
        }
        throw new Error("An error has occurred.");
    }
}

export async function updatePassword(data: UpdatePasswordInput) {
    try {
        const { userId, clerk } = await getClerkAndUser();

        try {
            await clerk.users.verifyPassword({
                userId,
                password: data.currentPassword,
            });
        } catch {
            throw new Error("Your current old password is incorrect.");
        }

        const results = await clerk.users.updateUser(userId, {
            password: data.password,
        });
    } catch (e: any) {
        if (e.errors) {
            const errorMessage =
                e.errors[0]?.message || "Failed to update password";
            throw new Error(errorMessage);
        }
        throw new Error("An error has occurred.");
    }
}

export async function updateEmail(data: UpdateEmailInput) {
    try {
        const { userId, clerk, user } = await getClerkAndUser();

        const currentPrimaryEmailId = user.primaryEmailAddressId;
        const emailCreationResults =
            await clerk.emailAddresses.createEmailAddress({
                userId,
                emailAddress: data.email,
                verified: true,
                primary: true,
            });

        if (currentPrimaryEmailId) {
            try {
                await clerk.emailAddresses.updateEmailAddress(
                    currentPrimaryEmailId
                );
            } catch (deleteError) {
                console.warn("Failed to delete old email:", deleteError);
            }
        }

        await clerk.emailAddresses.updateEmailAddress(emailCreationResults.id, {
            verified: false,
        });

        await db
            .update(users)
            .set({ email: data.email, updatedAt: new Date().toISOString() })
            .where(eq(users.clerkId, userId));
    } catch (e: any) {
        if (e.errors) {
            const errorMessage =
                e.errors[0]?.message || "Failed to update email";
            throw new Error(errorMessage);
        }
        throw new Error("An error has occurred.");
    }
}

export async function deleteAccount() {
    try {
        const { userId, clerk, user } = await getClerkAndUser();

        const results = await clerk.users.deleteUser(userId);
    } catch (e: any) {
        if (e.errors) {
            const errorMessage =
                e.errors[0]?.message || "Failed to update email";
            throw new Error(errorMessage);
        }
        throw new Error("An error has occurred.");
    }
}
export async function revokeUserSession(sessionId: string) {
    try {
        const { userId, clerk, user } = await getClerkAndUser();

        const results = await clerk.sessions.revokeSession(sessionId);
    } catch (e: any) {
        if (e.errors) {
            const errorMessage =
                e.errors[0]?.message || "Failed to update email";
            throw new Error(errorMessage);
        }
        throw new Error("An error has occurred.");
    }
}
