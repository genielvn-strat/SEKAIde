"use client";
import { FetchTask } from "@/types/ServerResponses";
import React, { useMemo } from "react";
import { TypographyH2 } from "./typography/TypographyH2";
import TaskCard from "./TaskCard";
import { useUser } from "@/hooks/useUser";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { MessageCircleQuestion } from "lucide-react";

interface AssignedTasksProps {
    tasks: FetchTask[];
}

const AssignedTasks: React.FC<AssignedTasksProps> = ({ tasks }) => {
    const { id } = useUser();

    const assignedTasks = useMemo(
        () => tasks.filter((t) => t.assigneeId === id),
        [tasks, id]
    );

    return (
        <div className="flex flex-col gap-2">
            <TypographyH2>Your Assigned Tasks</TypographyH2>
            <div className="flex flex-wrap gap-4">
                {assignedTasks.length == 0 ? (
                    <Alert variant="default">
                        <MessageCircleQuestion />
                        <AlertTitle>No assigned tasks yet</AlertTitle>
                        <AlertDescription>
                            Go to Boards or Task List to see other tasks.
                        </AlertDescription>
                    </Alert>
                ) : (
                    assignedTasks.map((t) => (
                        <TaskCard task={t} small key={t.id} />
                    ))
                )}
            </div>
        </div>
    );
};

export default AssignedTasks;
