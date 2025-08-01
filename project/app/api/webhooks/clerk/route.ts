"use server";

import { queries } from "@/lib/db";
import { User } from "@/types/User";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error(
            "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to your .env.local or .env file."
        );
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }

    // Get the ID and type
    const eventType = evt.type;

    console.log(eventType);

    if (eventType === "user.created") {
        const { id, email_addresses, username, first_name, last_name } =
            evt.data;

        try {
            const data: Partial<User> = {
                clerkId: id,
                username: String(username),
                name: `${first_name} ${last_name}`,
                email: email_addresses[0].email_address,
            };

            const user = await queries.users.create(data);

            console.log(
                `User created: ${id} - ${email_addresses[0]?.email_address}`
            );
            console.log(evt.data);
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
        const { id, email_addresses, first_name, last_name, username } =
            evt.data;

        const data: Partial<User> = {
            clerkId: id,
            username: String(username),
            name: `${first_name} ${last_name}`,
            email: email_addresses[0].email_address,
        };

        await queries.users.update(data);
    }

    return new Response("Webhook received", { status: 200 });
}
