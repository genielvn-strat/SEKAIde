"use client";

import {
    DashboardRecent,
    DashboardRecentComment,
    DashboardRecentFinishedTask,
    DashboardRecentProject,
    DashboardRecentTask,
    DashboardRecentTeamMembers,
} from "@/types/Dashboard";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
    CircleCheck,
    FolderOpen,
    LayoutList,
    MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Priority from "./badge/Priority";

interface FeedProp {
    feed: DashboardRecent;
}

const FeedCard: React.FC<FeedProp> = ({ feed }) => {
    const card = (details: DashboardRecent) => {
        switch (details.type) {
            case "project":
                const project = details.data as DashboardRecentProject;
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex flex-row items-center gap-4">
                                <FolderOpen />{" "}
                                <span>
                                    {project.teamName} has made a new project.
                                </span>
                            </CardTitle>
                            <CardDescription>
                                {details.date &&
                                    format(new Date(details.date), "PPP p")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Card className="w-full max-w-lg">
                                <CardHeader>
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        className="underline"
                                    >
                                        <CardTitle>{project.name}</CardTitle>
                                    </Link>
                                    <CardDescription>
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </CardContent>
                    </Card>
                );

            case "task":
                const task = details.data as DashboardRecentTask;
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex flex-row items-center gap-4">
                                <LayoutList />{" "}
                                <span>{task.projectName} has a new task.</span>
                            </CardTitle>
                            <CardDescription>
                                {details.date &&
                                    format(new Date(details.date), "PPP p")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Card className="w-full max-w-lg">
                                <CardHeader>
                                    <Link
                                        href={`/projects/${task.projectSlug}/${task.slug}`}
                                        className="underline"
                                    >
                                        <CardTitle>{task.title}</CardTitle>
                                    </Link>
                                    {task.description && (
                                        <CardDescription>
                                            {task.description}
                                        </CardDescription>
                                    )}
                                    <div className="flex justify-between items-center mt-3 text-xs ">
                                        <Priority priority={task.priority} />
                                    </div>
                                </CardHeader>
                            </Card>
                        </CardContent>
                    </Card>
                );
            case "finished":
                const finished = details.data as DashboardRecentFinishedTask;
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex flex-row items-center gap-4">
                                <CircleCheck />{" "}
                                <span>
                                    {finished.assigneeName} has finished a task.
                                </span>
                            </CardTitle>
                            <CardDescription>
                                {details.date &&
                                    format(new Date(details.date), "PPP p")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Card className="w-full max-w-lg">
                                <CardHeader>
                                    <Link
                                        href={`/projects/${finished.projectSlug}/${finished.slug}`}
                                        className="underline"
                                    >
                                        <CardTitle>{finished.title}</CardTitle>
                                    </Link>
                                    {finished.description && (
                                        <CardDescription>
                                            {finished.description}
                                        </CardDescription>
                                    )}
                                    <div className="flex justify-between items-center mt-3 text-xs ">
                                        <Priority
                                            priority={finished.priority}
                                        />
                                    </div>
                                </CardHeader>
                            </Card>
                        </CardContent>
                    </Card>
                );

            case "comment":
                const comment = details.data as DashboardRecentComment;
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex flex-row items-center gap-4">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage
                                        className="object-cover"
                                        src={comment.authorDisplayPicture}
                                    />
                                    <AvatarFallback>
                                        {comment.authorName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <span>
                                    {comment.authorName} commented on a task.
                                </span>
                            </CardTitle>
                            <CardDescription>
                                {details.date &&
                                    format(new Date(details.date), "PPP p")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <Card>
                                <CardHeader>
                                    <Link
                                        href={`/projects/${comment.projectSlug}/${comment.taskSlug}`}
                                        className="underline"
                                    >
                                        <CardTitle className="flex flex-row items-center gap-2">
                                            <MessageCircle />
                                            <span>
                                                {comment.projectName} /{" "}
                                                {comment.taskName}
                                            </span>
                                        </CardTitle>
                                    </Link>
                                    <CardDescription>
                                        {comment.content}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </CardContent>
                    </Card>
                );

            case "teamMember":
                const member = details.data as DashboardRecentTeamMembers;
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex flex-row items-center gap-4">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage
                                        className="object-cover"
                                        src={member.userDisplayPicture}
                                    />
                                    <AvatarFallback>
                                        {member.userName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <span>
                                    {member.userName} joined {member.teamName}.
                                </span>
                            </CardTitle>
                            <CardDescription>
                                {details.date &&
                                    format(new Date(details.date), "PPP p")}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                );

            default:
                return null;
        }
    };

    return <div className="w-full">{card(feed)}</div>;
};

export default FeedCard;
