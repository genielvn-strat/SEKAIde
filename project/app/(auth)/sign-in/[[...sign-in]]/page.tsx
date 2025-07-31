"use client"
import { SignIn, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// TODO: Task 2.3 - Create sign-in and sign-up pages
export default function SignInPage() {
    const session = useAuth();

    if (session.userId) redirect("/dashboard");

    return <SignIn afterSignInUrl={"/dashboard"} />;
}

/*
TODO: Task 2.3 Implementation Notes:
- Import SignIn from @clerk/nextjs
- Configure sign-in redirects
- Style to match design system
- Add proper error handling
*/
