"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isSignedIn } = useAuth();

    return (
        <>
            <div className="flex flex-col w-full min-h-screen overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-10 flex justify-between items-center py-2 px-4 sm:px-32 lg:px-64 bg-background border-b">
                    <Link
                        href="/"
                        className="text-2xl font-bold hover:opacity-80 transition"
                    >
                        SEKAIde
                    </Link>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {isSignedIn ? (
                            <Button
                                onClick={() => {
                                    redirect("/dashboard");
                                }}
                            >
                                Dashboard
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    redirect("/sign-in");
                                }}
                            >
                                Get Started
                            </Button>
                        )}
                    </div>
                </header>

                <main className="h-full ">
                    <Suspense>{children}</Suspense>
                </main>
            </div>
        </>
    );
}
