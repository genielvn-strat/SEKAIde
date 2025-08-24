import React from "react";
import { Skeleton } from "./ui/skeleton";

const LoadingSkeletonCards: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap flex-row  gap-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
            </div>
        </div>
    );
};

export default LoadingSkeletonCards;
