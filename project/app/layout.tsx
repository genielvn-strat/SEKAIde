import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { TanstackProvider } from "@/lib/tanstack-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SEKAIde",
    description: "Team collaboration and project management platform",
    generator: "v0.dev",
};
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <ClerkProvider
                appearance={{
                    layout: {
                        unsafe_disableDevelopmentModeWarnings: true,
                    },
                }}
            >
                <TanstackProvider>
                    <html lang="en" suppressHydrationWarning>
                        <body>
                            <ThemeProvider>{children}</ThemeProvider>
                            <Toaster richColors={true} />
                        </body>
                    </html>
                </TanstackProvider>
            </ClerkProvider>
        </SidebarProvider>
    );
}
