"use client";

import {
    DashboardRecent,
    DashboardRecentComment,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { FolderOpen, LayoutList } from "lucide-react";
import Link from "next/link";
import Priority from "./badge/Priority";

interface FeedProp {
    feed: DashboardRecent;
}

const Feed: React.FC<FeedProp> = ({ feed }) => {
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
                        <CardContent className="flex justify-between detailss-center text-sm text-muted-foreground">
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

            case "comment":
                const comment = details.data as DashboardRecentComment;
                return (
                    <Card>
                        <CardHeader>
                            <div className="flex detailss-center space-x-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage
                                        src={comment.authorDisplayPicture}
                                    />
                                    <AvatarFallback>
                                        {comment.authorName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle>
                                    {comment.authorName} commented on{" "}
                                    {comment.taskName}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground flex justify-between">
                            <span>{comment.content}</span>
                            {comment.createdAt && (
                                <span>
                                    {format(
                                        new Date(comment.createdAt),
                                        "PPP p"
                                    )}
                                </span>
                            )}
                        </CardContent>
                    </Card>
                );

            case "teamMember":
                const member = details.data as DashboardRecentTeamMembers;
                return (
                    <Card>
                        <CardHeader>
                            <div className="flex detailss-center space-x-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage
                                        src={member.userDisplayPicture}
                                    />
                                    <AvatarFallback>
                                        {member.userName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle>
                                    {member.userName} joined {member.teamName}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        {member.createdAt && (
                            <CardContent className="text-sm text-muted-foreground">
                                Joined at:{" "}
                                {format(new Date(member.createdAt), "PPP p")}
                            </CardContent>
                        )}
                    </Card>
                );

            default:
                return null;
        }
    };

    return card(feed);
};

export default Feed;
