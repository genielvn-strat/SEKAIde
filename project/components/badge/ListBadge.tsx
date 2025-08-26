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
    return (
        <Badge
            className={`capitalize border ${
                listColor ? `bg-${listColor}-100 text-${listColor}-700` : ""
            }`}
        >
            {listName}
        </Badge>
    );
};

export default ListBadge;
