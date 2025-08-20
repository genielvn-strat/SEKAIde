import { ReactNode } from "react";

interface TypographyPProps {
    children?: ReactNode;
    margin?: boolean;
}

export function TypographyP({ children, margin = true }: TypographyPProps) {
    return (
        <p className={`${margin ?? "leading-7 [&:not(:first-child)]:mt-6"}`}>
            {children}
        </p>
    );
}
