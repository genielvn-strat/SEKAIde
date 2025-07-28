"use server";

import { queries } from "@/lib/db";
import { createUserSchema } from "@/lib/validations";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import z from "zod";

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

    const eventType = evt.type;

    console.log(eventType);

    if (eventType === "user.created") {
        const { id, email_addresses, username, first_name, last_name } =
            evt.data;

        try {
            const validatedData = createUserSchema.parse({
                clerkId: id,
                username: String(username),
                name: `${first_name} ${last_name}`,
                email: email_addresses[0].email_address,
            });

            await queries.users.create(validatedData);

            console.log(
                `User created: ${id} - ${email_addresses[0]?.email_address}`
            );
            console.log(evt.data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error(
                    "Error saving user to database:",
                    error.issues[0].message
                );
                return new Response(error.issues[0].message, { status: 400 });
            }
            if (error instanceof Error) {
                console.error("Error saving user to database:", error.message);
                return new Response(error.message, { status: 400 });
            }
            return new Response("Server error", { status: 500 });
        }
    }

    // // Handle other events like 'user.updated' or 'user.deleted' as needed
    // if (eventType === "user.updated") {
    //     const {
    //         id,
    //         email_addresses,
    //         first_name,
    //         last_name,
    //         image_url,
    //         username,
    //     } = evt.data;
    //     // Update user in your database
    //     console.log(
    //         `User updated: ${id} - ${email_addresses[0]?.email_address}`
    //     );
    // }

    // if (eventType === "user.deleted") {
    //     const { id } = evt.data;
    //     // Delete user from your database or mark as deleted
    //     console.log(`User deleted: ${id}`);
    // }

    return new Response("Webhook received", { status: 200 });
}
