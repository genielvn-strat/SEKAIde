import React from "react";
import { Badge } from "../ui/badge";

interface ListBadgeProps {
    listName: string;
    listColor?:
        | "red"
        | "orange"
        | "yellow"
        | "green"
        | "blue"
        | "violet"
        | null;
}

const ListBadge: React.FC<ListBadgeProps> = ({ listName, listColor }) => {
    const colorVariants = {
        red: "bg-red-100 text-red-700",
        orange: "bg-orange-100 text-orange-700",
        yellow: "bg-yellow-100 text-yellow-700",
        green: "bg-green-100 text-green-700",
        blue: "bg-blue-100 text-blue-700",
        violet: "bg-violet-100 text-violet-700",
    };

    return (
        <Badge className={`capitalize border ${listColor ? colorVariants[listColor] : ""}`}>
            {listName}
        </Badge>
    );
};

export default ListBadge;
