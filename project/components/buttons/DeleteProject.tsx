"use client";
import { FetchProject, FetchTeamDetails } from "@/types/ServerResponses";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    AlertDialog,
    AlertDialogAction,
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
import { useProjectActions } from "@/hooks/useProjects";

interface DeleteProjectProps {
    projectDetails: FetchProject;
}

const DeleteProject: React.FC<DeleteProjectProps> = ({ projectDetails }) => {
    const [confirmationText, setConfirmationText] = useState("");
    const router = useRouter();

    const { deleteProject, isDeleting } = useProjectActions();
    const handleDelete = async () => {
        try {
            const result = await deleteProject({ id: projectDetails.id });
            if (!result.success) throw new Error(result.message);
            toast.success("Project has been deleted successfully.");
            router.push(`/projects/`);
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
                <Button variant="destructive">Delete Project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {projectDetails.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. All tasks on this project
                        will be permanently deleted.
                        <br />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Alert variant="destructive">
                    <AlertTitle className="flex flex-row items-center gap-2">
                        You're also going to do the following:
                    </AlertTitle>
                    <AlertDescription>
                        {projectDetails.totalTaskCount != 0 && (
                            <TypographyP>
                                <LayoutList /> {projectDetails.totalTaskCount}{" "}
                                {projectDetails.totalTaskCount == 1
                                    ? "task"
                                    : "tasks"}{" "}
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
                            Type "I am sure to delete this project" to confirm.
                        </strong>
                    </TypographyMuted>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive dark:bg-destructive"
                        onClick={handleDelete}
                        disabled={
                            confirmationText !==
                                "I am sure to delete this project" || isDeleting
                        }
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteProject;
