"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = useAuth();

    if (session.isSignedIn) redirect("/dashboard");

    return (
        <>
            <div className="flex flex-col w-full min-h-screen overflow-x-auto">
                {/* Header */}
                <header className="sticky top-0 z-10 flex items-center justify-center py-2 px-4 sm:px-4 lg:px-4 bg-background border-b">
                    <Link
                        href="/"
                        className="text-2xl font-bold hover:opacity-80 transition"
                    >
                        SEKAIde
                    </Link>
                    <div className="flex items-center gap-3"></div>
                </header>

                {/* Main content */}
                <main className="h-full overflow-x-auto ">
                    <div className="relative flex flex-col items-center justify-center h-full text-center overflow-hidden">
                        {/* Background image placeholder */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-100 via-background to-blue-100 dark:from-purple-950 dark:via-background dark:to-blue-950" />

                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}
