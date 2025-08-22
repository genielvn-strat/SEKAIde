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

interface TaskDetailsProps {
    task: FetchTask;
    children: React.ReactNode;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, children }) => {
    const router = useRouter();

    return (
        <Drawer>
            <DrawerTrigger className="underline text-left p-0">
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-3xl">
                    <DrawerHeader className="text-left">
                        <DrawerTitle className="flex flex-col gap-2">
                            <TypographyH1>{task.title}</TypographyH1>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-row gap-2">
                                    {task.listName && (
                                        <Badge
                                            className={`capitalize border ${
                                                task.listColor
                                                    ? `bg-${task.listColor}-100 text-${task.listColor}-700`
                                                    : ""
                                            }`}
                                        >
                                            {task.listName}
                                        </Badge>
                                    )}
                                    <Badge
                                        className={`capitalize ${
                                            task.priority === "high"
                                                ? "bg-red-100 text-red-700"
                                                : task.priority === "medium"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                        }`}
                                    >
                                        {task.priority}
                                    </Badge>
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
                                    <span className="text-sm text-muted-foreground">
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
