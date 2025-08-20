"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            variant="ghost"
            className="h-full"
        >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
    );
}
