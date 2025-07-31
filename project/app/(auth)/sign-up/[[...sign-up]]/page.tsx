"use client";

import { SignUp, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// TODO: Task 2.3 - Create sign-in and sign-up pages
export default function SignUpPage() {
    const session = useAuth();

    if (session.userId) redirect("/dashboard");

    return <SignUp />;
}

/*
TODO: Task 2.3 Implementation Notes:
- Import SignUp from @clerk/nextjs
- Configure sign-up redirects
- Style to match design system
- Add proper error handling
- Set up webhook for user data sync (Task 2.5)
*/
