import { FetchUserSession } from "@/types/ServerResponses";
import React from "react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { useAccountSettingsActions } from "@/hooks/useAccountSettings";
import { toast } from "sonner";
interface SessionCardProps {
    session: FetchUserSession;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
    const { revokeSession } = useAccountSettingsActions();
    const handleRevoke = async () => {
        try {
            await revokeSession({ sessionId: session.id });
            toast.success("Session has been revoked");
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                return;
            }
            toast.error("An error has occurred.");
        }
    };
    return (
        <Card key={session.id}>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>
                        <span>
                            {session.latestActivity?.browserName}{" "}
                            {session.latestActivity?.browserVersion}
                        </span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                        {session.latestActivity?.city},{" "}
                        {session.latestActivity?.country} •{" "}
                        {session.latestActivity?.ipAddress}
                        <p className="">
                            Last active:{" "}
                            {session.lastActiveAt
                                ? new Date(
                                      session.lastActiveAt
                                  ).toLocaleString()
                                : "N/A"}
                        </p>
                    </CardDescription>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            Revoke
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogTitle>
                            Revoke this session?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {
                                "This session's device will be signed out. You'll have to sign in again on that device."
                            }
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive dark:bg-destructive"
                                onClick={handleRevoke}
                            >
                                Revoke
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
        </Card>
    );
};

export default SessionCard;
