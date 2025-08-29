import React from "react";
import { TypographyP } from "@/components/typography/TypographyP";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    CheckCircle2,
    Clock,
    FolderClock,
    FolderOpen,
    LayoutList,
    Users,
} from "lucide-react";
import Link from "next/link";
import { FetchProject, FetchTask } from "@/types/ServerResponses";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import Priority from "../badge/Priority";
import TaskDetails from "../modals/TaskDetails";
import ListBadge from "../badge/ListBadge";

interface TaskCardProps {
    task: FetchTask;
    showProject?: boolean;

    small?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task: task,
    showProject,
    small,
}) => {
    return (
        <Card className={small ? "w-full max-w-sm" : "w-full"} key={task.id}>
            <CardHeader>
                <TaskDetails task={task}>
                    <CardTitle className="text-2xl truncate">
                        {task.title}
                    </CardTitle>
                </TaskDetails>
                <CardDescription className="truncate">
                    {task.description ?? "No description"}
                </CardDescription>
                <div className="flex flex-row gap-2">
                    {task.listName && (
                        <ListBadge
                            listColor={task.listColor}
                            listName={task.listName}
                        />
                    )}
                    <Priority priority={task.priority} />

                    <div className="flex items-center gap-2 text-sm">
                        {task.finished && (
                            <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">Finished</span>
                            </>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
                <div
                    className={`flex flex-row items-center gap-4 ${
                        task.dueDate &&
                        !task.finished &&
                        new Date(task.dueDate) < new Date()
                            ? "text-red-600 font-semibold"
                            : ""
                    }`}
                >
                    <Clock />
                    <TypographyP>
                        {!task.dueDate
                            ? "No due date"
                            : `Due ${new Date(
                                  task.dueDate
                              ).toLocaleDateString()}`}
                    </TypographyP>
                </div>
                <div className={`flex flex-row items-center gap-4`}>
                    <FolderOpen />
                    <TypographyP>{task.projectName}</TypographyP>
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
