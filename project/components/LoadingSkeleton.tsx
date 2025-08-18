import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "@radix-ui/react-separator";

const LoadingSkeleton: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="doc-header flex flex-row justify-between items-center">
                <div className="left space-y-2">
                    <Skeleton className="h-8 w-48" /> {/* Title */}
                    <Skeleton className="h-4 w-32" /> {/* Subtitle */}
                </div>
                <div className="right">
                    <Skeleton className="h-10 w-24 rounded-md" />{" "}
                    {/* Button / Action */}
                </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
            </div>
        </div>
    );
};

export default LoadingSkeleton;
