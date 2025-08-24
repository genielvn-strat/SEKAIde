import React from "react";
import { Badge } from "../ui/badge";

interface PriorityProps {
    priority?: string;
}

const Priority: React.FC<PriorityProps> = ({ priority }) => {
    return (
        <Badge
            className={`capitalize ${
                priority === "high"
                    ? "bg-red-100 text-red-700"
                    : priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
            }`}
        >
            {priority}
        </Badge>
    );
};

export default Priority;
