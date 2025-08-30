"use server";

import { queries } from "@/lib/db";
import { CreateUser, UpdateUser, User } from "@/types/User";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error(
            "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to your .env.local or .env file."
        );
    }
    try {
        const evt = await verifyWebhook(req);

        const { id } = evt.data;
        const eventType = evt.type;

        console.log(
            `Received webhook with ID ${id} and event type of ${eventType}`
        );
        if (eventType === "user.created") {
            const {
                id,
                email_addresses,
                username,
                first_name,
                last_name,
                image_url,
            } = evt.data;

            try {
                const data: CreateUser = {
                    clerkId: id,
                    username: String(username),
                    name: `${first_name} ${last_name}`,
                    email: email_addresses[0].email_address,
                    displayPictureLink: image_url,
                };

                const user = await queries.users.create(data);

                console.log(
                    `User created: ${id} - ${email_addresses[0]?.email_address}`
                );
            } catch (dbError) {
                console.error("Error saving user to database:", dbError);
                return new Response("Database error", { status: 500 });
            }
        }

        if (eventType === "user.deleted") {
            const { id } = evt.data;

            if (!id)
                throw new Response("No Clerk ID is provided when deleting.", {
                    status: 500,
                });
            await queries.users.delete(id);
        }

        if (eventType === "user.updated") {
            const {
                id,
                email_addresses,
                first_name,
                last_name,
                username,
                image_url,
            } = evt.data;

            const data: UpdateUser = {
                username: String(username),
                name: `${first_name} ${last_name}`,
                email: email_addresses[0].email_address,
                displayPictureLink: image_url,
            };

            await queries.users.update(data, id);
        }

        return new Response("Webhook received", { status: 200 });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }

    // Get the ID and type
}
