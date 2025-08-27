import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Helper to get ISO week number
export function getWeekNumber(date: Date): number {
    const tmp = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    );
    const dayNum = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil(
        ((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
}

export const toKebab = (str: string) => str.toLowerCase().replace(/\s+/g, "-");
