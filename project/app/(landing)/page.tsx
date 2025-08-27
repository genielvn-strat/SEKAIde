"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };
        checkOrientation();
        window.addEventListener("resize", checkOrientation);
        return () => window.removeEventListener("resize", checkOrientation);
    }, []);
    useEffect(() => {
        // disable scroll
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";

        return () => {
            // restore scroll on unmount
            document.body.style.overflow = originalStyle;
        };
    }, []);
    return (
        <div className="relative flex flex-col h-full min-h-full text-center overflow-x-hidden overflow-y-hidden p-4">
            {/* Background */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-100 via-background to-blue-100 dark:from-purple-950 dark:via-background dark:to-blue-950" />

            {/* Message */}
            <div className="py-4 sm:py-8 lg:py-12 xl:py-16 z-10">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-2 sm:mb-4 lg:mb-6">
                    Make your task world manageable.
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-2 sm:mb-4 lg:mb-8">
                    A simple, open-source Kanban board to organize your tasks
                    with ease.
                </p>
                <Button
                    size="lg"
                    onClick={() => {
                        redirect("/sign-in");
                    }}
                    className="px-8 py-6 text-lg rounded-2xl shadow-lg"
                >
                    Get Started
                </Button>
            </div>

            {/* Device mockups */}
            <div className="flex justify-center items-end w-full h-full max-h-full px-8">
                {/* Laptop Screen */}
                <div
                    className={`${
                        isPortrait ? "hidden" : "hidden sm:block"
                    } aspect-[16/10] w-full max-w-6xl rounded-2xl border-8 border-gray-800 dark:border-gray-200 bg-black overflow-hidden shadow-xl`}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src="/laptop-light.png"
                            alt="laptop-light"
                            fill
                            className="object-cover dark:hidden"
                        />
                        <Image
                            src="/laptop-dark.png"
                            alt="laptop-dark"
                            fill
                            className="object-cover hidden dark:block"
                        />
                    </div>
                </div>

                {/* Phone Screen */}
                <div
                    className={`${
                        isPortrait ? "block" : "block sm:hidden"
                    } aspect-[9/19] w-full rounded-2xl border-4 border-gray-800 dark:border-gray-200 bg-black overflow-hidden shadow-md`}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src="/phone-light.png"
                            alt="phone-light"
                            fill
                            className="object-cover object-top dark:hidden"
                        />
                        <Image
                            src="/phone-dark.png"
                            alt="phone-dark"
                            fill
                            className="object-cover object-top hidden dark:block"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
