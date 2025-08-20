"use client";
import { FetchTeamDetails } from "@/types/ServerResponses";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { useTeamActions } from "@/hooks/useTeams";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FolderOpen, LayoutList, TriangleAlert, Users } from "lucide-react";
import { TypographyP } from "../typography/TypographyP";

interface DeleteTeamProps {
    teamDetails: FetchTeamDetails;
}

const DeleteTeam: React.FC<DeleteTeamProps> = ({ teamDetails }) => {
    const [confirmationText, setConfirmationText] = useState("");
    const router = useRouter();

    const { deleteTeam, isDeleting } = useTeamActions();
    const handleDelete = async () => {
        try {
            const result = await deleteTeam(teamDetails.id);
            if (!result.success) throw new Error(result.message);
            toast.success("Team has been deleted successfully.");
            router.push(`/teams/`);
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                return;
            }
        }
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Team</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {teamDetails.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. All projects and tasks
                        will be permanently deleted.
                        <br />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Alert variant="destructive">
                    <AlertTitle className="flex flex-row items-center gap-2">
                        You're also going to do the following:
                    </AlertTitle>
                    <AlertDescription>
                        {teamDetails.memberCount != 0 && (
                            <TypographyP>
                                <Users /> {teamDetails.memberCount}{" "}
                                {teamDetails.memberCount == 1
                                    ? "member"
                                    : "members"}{" "}
                                will be removed from the team.
                            </TypographyP>
                        )}
                        {teamDetails.projectCount != 0 && (
                            <TypographyP>
                                <FolderOpen /> {teamDetails.projectCount}{" "}
                                {teamDetails.projectCount == 1
                                    ? "project"
                                    : "projects"}{" "}
                                will be deleted.
                            </TypographyP>
                        )}
                        {teamDetails.taskCount != 0 && (
                            <TypographyP>
                                <LayoutList /> {teamDetails.taskCount}{" "}
                                {teamDetails.taskCount == 1 ? "task" : "tasks"}{" "}
                                will be deleted.
                            </TypographyP>
                        )}
                    </AlertDescription>
                </Alert>
                <div className="py-2 flex flex-col gap-2">
                    <Input
                        placeholder="Type confirmation text..."
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                    />
                    <TypographyMuted>
                        <strong>
                            Type "I am sure to delete this team" to confirm.
                        </strong>
                    </TypographyMuted>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={
                            confirmationText !==
                                "I am sure to delete this team" || isDeleting
                        }
                    >
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteTeam;
