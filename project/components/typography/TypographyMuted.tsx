import { ReactNode } from "react";

interface TypographyMutedProps {
    children?: ReactNode;
}

export function TypographyMuted({ children }: TypographyMutedProps) {
    return <p className="text-muted-foreground text-sm">{children}</p>;
}
