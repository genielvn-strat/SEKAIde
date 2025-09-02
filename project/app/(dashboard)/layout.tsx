"use client";

import React, { Suspense } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu, Search } from "lucide-react";
import { useSearchStore } from "@/stores/searchStore";
import { AppCommandBar } from "@/components/AppCommandBar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { toggleSidebar } = useSidebar();
    const { setOpen } = useSearchStore();

    return (
        <>
            <AppSidebar />
            <AppCommandBar />
            <div className="flex flex-col w-full min-h-screen overflow-x-auto">
                <header className="sticky top-0 z-10 flex items-center justify-between py-2 px-4 sm:px-4 lg:px-4 bg-background border-b">
                    <Menu onClick={toggleSidebar} scale={48} />
                    <div
                        onClick={() => setOpen(true)}
                        className="flex flex-row gap-4 items-center w-full max-w-64 sm:max-w-96  px-4 py-1 shrink-0 border rounded-full bg-secondary dark:bg-secondary"
                    >
                        <Search />
                        <p>Search...</p>
                    </div>
                    <div></div>
                </header>

                <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 overflow-x-auto">
                    <Suspense>{children}</Suspense>
                </main>
            </div>
        </>
    );
}
