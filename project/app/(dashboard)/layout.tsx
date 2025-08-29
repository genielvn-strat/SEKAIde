"use client";

import React, { Suspense } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { toggleSidebar } = useSidebar();

    return (
        <>
            <AppSidebar />
            <div className="flex flex-col w-full min-h-screen overflow-x-auto">
                {/* Header */}
                <header className="sticky top-0 z-10 flex items-center justify-between py-2 px-4 sm:px-4 lg:px-4 bg-background border-b">
                    <Menu onClick={toggleSidebar} scale={48} />
                    {/* Example right-side actions */}
                    <div className="flex items-center gap-3"></div>
                </header>

                {/* Main content */}
                <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 overflow-x-auto">
                    <Suspense>{children}</Suspense>
                </main>
            </div>
        </>
    );
}

