"use client";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { updateEmail, updatePassword } from "@/actions/accountActions";
import UpdatePassword from "@/components/account/UpdatePassword";
import UpdateDetails from "@/components/account/UpdateDetails";
import UpdateEmail from "@/components/account/UpdateEmail";
import DangerZone from "@/components/account/DangerZone";
import AccountSessions from "@/components/account/AccountSessions";

export default function SettingsPage() {
    const session = useAuth();

    if (!session) return notFound();
    return (
        <>
            <div className="doc-header flex flex-row justify-between items-center">
                <div className="left">
                    <TypographyH1>Account Settings</TypographyH1>
                    <TypographyMuted>Manage your account</TypographyMuted>
                </div>
                <div className="right"></div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-4">
                <UpdateDetails />
                <UpdateEmail />
                <UpdatePassword />
                <AccountSessions />
                <DangerZone />
            </div>
        </>
    );
}
