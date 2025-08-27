import Image from "next/image";
import NotFound from "@/public/404.png";
import { auth } from "@clerk/nextjs/server";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Not Found",
    description: "The page you are looking for does not exist.",
};

const quote404 = [
    "Maybe the real page was the friends we made along the way...",
    "Aw, snap!",
    "It's not on our database, sorry.",
    "We will never gonna give you up, though.",
    "お探しのページが見つかりません。",
    "The page you are looking for could not be found.",
];

export default async function Custom404() {
    const { userId } = await auth();

    return (
        <div className="flex w-full min-h-screen flex-col items-center justify-center text-center p-6 gap-4">
            <Image
                src={NotFound}
                alt="not-found-logo"
                height={200}
                className="mb-6"
                priority
            />
            <div>
                <TypographyH1>Page not found!</TypographyH1>
                <TypographyMuted>
                    {quote404[Math.floor(Math.random() * quote404.length)]}
                </TypographyMuted>
            </div>

            {userId ? (
                <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                </Link>
            ) : (
                <Link href="/">
                    <Button>Home</Button>
                </Link>
            )}
        </div>
    );
}
