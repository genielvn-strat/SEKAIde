import { useEffect, useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useSearchStore } from "@/stores/searchStore";
import { useRecentStore } from "@/stores/recentStores";
import Link from "next/link";
import { Circle, FolderOpen, LayoutList, Users } from "lucide-react";

export function AppCommandBar() {
    const { open, setOpen } = useSearchStore();
    const { recents } = useRecentStore();

    // useEffect(() => {
    //     const down = (e: KeyboardEvent) => {
    //         if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
    //             e.preventDefault();
    //             setOpen(!open);
    //         }
    //     };
    //     document.addEventListener("keydown", down);
    //     return () => document.removeEventListener("keydown", down);
    // }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen} >
            <CommandInput placeholder="Search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {recents.length != 0 && (
                    <CommandGroup heading="Recents">
                        {recents.map((item) => (
                            <Link
                                href={item.link}
                                onClick={() => setOpen(false)}
                            >
                                <CommandItem key={item.link}>
                                    {item.type == "project" ? (
                                        <FolderOpen />
                                    ) : item.type == "task" ? (
                                        <LayoutList />
                                    ) : item.type == "team" ? (
                                        <Users />
                                    ) : (
                                        <Circle />
                                    )}
                                    <span>{item.title}</span>
                                </CommandItem>
                            </Link>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandDialog>
    );
}
