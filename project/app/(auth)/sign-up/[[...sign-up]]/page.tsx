"use client";

import { SignUp } from "@clerk/nextjs";

// TODO: Task 2.3 - Create sign-in and sign-up pages
export default function SignUpPage() {
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
