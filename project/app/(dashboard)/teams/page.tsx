"use client";

import { useTeams } from "@/hooks/useTeams";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Separator } from "@/components/ui/separator";
import CreateTeam from "@/components/buttons/CreateTeam";
import TeamCard from "@/components/TeamCard";
import { useState, useMemo } from "react"; // 👈 Add useMemo here
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter, MessageCircleQuestion } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function TeamPage() {
    const { joinedTeams, isLoading, isError } = useTeams();

    const [searchQuery, setSearchQuery] = useState("");
    const [sortCriteria, setSortCriteria] = useState("createdAt");

    const filteredAndSortedTeams = useMemo(() => {
        return joinedTeams
            .filter((team) =>
                team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                if (sortCriteria === "teamName") {
                    return a.teamName.localeCompare(b.teamName);
                }
                if (sortCriteria === "memberCount") {
                    return b.memberCount - a.memberCount;
                }
                if (sortCriteria === "projectCount") {
                    return b.projectCount - a.projectCount;
                }
                return (
                    new Date(b.createdAt!).getTime() -
                    new Date(a.createdAt!).getTime()
                );
            });
    }, [joinedTeams, searchQuery, sortCriteria]);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!joinedTeams || isError) {
        return "Error loading teams";
    }

    return (
        <>
            <div className="doc-header flex flex-row justify-between items-center">
                <div className="left">
                    <TypographyH1>Teams</TypographyH1>
                    <TypographyMuted>
                        Manage and view your teams
                    </TypographyMuted>
                </div>
                <div className="right">
                    <CreateTeam />
                </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-row gap-4 mb-4 items-center">
                <Input
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <ListFilter className="mr-2 h-4 w-4" /> Sort
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={sortCriteria}
                            onValueChange={setSortCriteria}
                        >
                            <DropdownMenuRadioItem value="createdAt">
                                Creation date
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="teamName">
                                Name
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="memberCount">
                                Members
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="projectCount">
                                Projects
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex flex-wrap gap-4">
                {filteredAndSortedTeams.length !== 0 ? (
                    filteredAndSortedTeams.map((team) => (
                        <TeamCard key={team.id} team={team} />
                    ))
                ) : (
                    <Alert variant="default">
                        <MessageCircleQuestion />
                        <AlertTitle>No teams found</AlertTitle>
                        <AlertDescription>
                            Looks like you are not part of any teams yet. Create
                            one or ask someone to invite you.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </>
    );
}
