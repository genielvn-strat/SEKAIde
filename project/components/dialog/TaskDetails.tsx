import { FetchTask } from "@/types/ServerResponses";
import React from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { TypographyH1 } from "../typography/TypographyH1";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckCircle2, Circle } from "lucide-react";
import TaskDropDown from "../dropdown/TaskDropDown";
import Priority from "../badge/Priority";
import ListBadge from "../badge/ListBadge";

interface TaskDetailsProps {
    task: FetchTask;
    children: React.ReactNode;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, children }) => {
    const router = useRouter();

    return (
        <Drawer>
            <DrawerTrigger className="text-left p-0">{children}</DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-3xl">
                    <DrawerHeader className="text-left">
                        <DrawerTitle className="flex flex-col gap-2">
                            <div className="flex flex-row justify-between">
                                <TypographyH1>{task.title}</TypographyH1>
                                {task.allowUpdate && (
                                    <TaskDropDown task={task} />
                                )}
                            </div>
                            <div className="flex justify-between items-center">
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
                                                <span className="text-green-600">
                                                    Finished
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {task.dueDate && (
                                    <span
                                        className={`text-sm text-muted-foreground ${
                                            task.dueDate &&
                                            !task.finished &&
                                            new Date(task.dueDate) < new Date()
                                                ? "text-red-600 font-semibold"
                                                : ""
                                        }`}
                                    >
                                        Due{" "}
                                        {new Date(
                                            task.dueDate
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                )}
                            </div>
                        </DrawerTitle>
                        {task.description && (
                            <DrawerDescription>
                                {task.description}
                            </DrawerDescription>
                        )}
                        {task.assigneeName && (
                            <div className="grid py-2 gap-1">
                                <span className="text-sm font-medium">
                                    Assigned to:
                                </span>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={task.assigneeDisplayPicture}
                                            alt={task.assigneeName}
                                        />
                                        <AvatarFallback>
                                            {task.assigneeName
                                                ?.charAt(0)
                                                ?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {task.assigneeName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {task.assigneeUsername}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DrawerHeader>

                    {/* Footer */}
                    <DrawerFooter>
                        <Button
                            onClick={() =>
                                router.push(
                                    `/projects/${task.projectSlug}/${task.slug}`
                                )
                            }
                        >
                            Go To Task
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default TaskDetails;
