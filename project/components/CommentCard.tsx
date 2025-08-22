import { FetchComment } from "@/types/ServerResponses";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { TypographyP } from "@/components/typography/TypographyP";
interface CommentCardProps {
    comment: FetchComment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-4 flex flex-col gap-3">
                {/* Avatar */}
                <div className="flex flex-row align-center gap-4">
                    <Avatar>
                        <AvatarImage
                            src={comment.authorDisplayPicture}
                            alt={comment.authorName}
                        />
                        <AvatarFallback>
                            {comment.authorName?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-row justify-between items-center align-center w-full">
                        <div>
                            <p className="font-medium text-sm">
                                {comment.authorName}
                            </p>
                            <TypographyMuted>
                                {comment.authorUsername} •{" "}
                                {comment.createdAt
                                    ? new Date(
                                          comment.createdAt
                                      ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                      })
                                    : "just now"}
                            </TypographyMuted>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Comment body */}
                <div className="flex-1">
                    {/* Actions (only if it's the user's own comment) */}

                    {/* Comment content */}
                    <TypographyP>{comment.content}</TypographyP>
                </div>
            </CardContent>
        </Card>
    );
};

export default CommentCard;
