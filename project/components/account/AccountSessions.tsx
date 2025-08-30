import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "../typography/TypographyH2";
import { useAccountSessions } from "@/hooks/useAccountSettings"; // assume revokeSession exists
import { Separator } from "@/components/ui/separator";
import ErrorAlert from "../ErrorAlert";
import SessionCard from "../cards/SessionCard";

const AccountSessions: React.FC = () => {
    const { sessions, isError, isLoading, error } = useAccountSessions();

    if (isLoading) {
        return (
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <p className="text-sm text-muted-foreground">
                        Loading sessions…
                    </p>
                </CardHeader>
            </Card>
        );
    }

    if (isError || !sessions) {
        return (
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <ErrorAlert message={error?.message} />
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>
                    <TypographyH2>Sessions</TypographyH2>
                </CardTitle>
                <CardDescription>
                    Manage your active sessions across devices.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {sessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                ))}
            </CardContent>
        </Card>
    );
};

export default AccountSessions;
