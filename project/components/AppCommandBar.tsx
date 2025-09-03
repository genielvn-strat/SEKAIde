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
import { useSearch } from "@/hooks/useSearch";

export function AppCommandBar() {
    const { open, setOpen } = useSearchStore();
    const { recents } = useRecentStore();
    const { items, isLoading, isError } = useSearch({ enabled: open });

    const teams = items?.data?.teams ?? [];
    const projects = items?.data?.projects ?? [];
    const tasks = items?.data?.tasks ?? [];

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                {recents.length > 0 && (
                    <CommandGroup heading="Recents">
                        {recents.map((item) => (
                            <Link
                                key={item.link}
                                href={item.link}
                                onClick={() => setOpen(false)}
                            >
                                <CommandItem>
                                    {item.type === "project" ? (
                                        <FolderOpen />
                                    ) : item.type === "task" ? (
                                        <LayoutList />
                                    ) : item.type === "team" ? (
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

                {/* 🔹 Teams */}
                {teams.length > 0 && (
                    <CommandGroup heading="Teams">
                        {teams.map((team) => (
                            <Link
                                key={team.id}
                                href={team.slug}
                                onClick={() => setOpen(false)}
                            >
                                <CommandItem>
                                    <Users />
                                    <span>{team.name}</span>
                                </CommandItem>
                            </Link>
                        ))}
                    </CommandGroup>
                )}

                {/* 🔹 Projects */}
                {projects.length > 0 && (
                    <CommandGroup heading="Projects">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={project.slug}
                                onClick={() => setOpen(false)}
                            >
                                <CommandItem>
                                    <FolderOpen />
                                    <span>{project.name}</span>
                                </CommandItem>
                            </Link>
                        ))}
                    </CommandGroup>
                )}

                {/* 🔹 Tasks */}
                {tasks.length > 0 && (
                    <CommandGroup heading="Tasks">
                        {tasks.map((task) => (
                            <Link
                                key={task.id}
                                href={task.slug}
                                onClick={() => setOpen(false)}
                            >
                                <CommandItem>
                                    <LayoutList />
                                    <span>{task.title}</span>
                                </CommandItem>
                            </Link>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandDialog>
    );
}
