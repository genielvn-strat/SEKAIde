import { ReactNode } from "react";

interface TypographyPProps {
    children?: ReactNode;
    margin?: boolean;
}

export function TypographyP({ children, margin = true }: TypographyPProps) {
    return (
        <p className={`leading-7 ${margin ?? "[&:not(:first-child)]:mt-6"}`}>
            {children}
        </p>
    );
}
