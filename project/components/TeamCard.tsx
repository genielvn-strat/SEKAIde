import React from "react";
import { TypographyP } from "@/components/typography/TypographyP";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Users } from "lucide-react";
import Link from "next/link";
import { FetchJoinedTeams } from "@/types/ServerResponses";

interface TeamCardProps {
    team: FetchJoinedTeams;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
    return (
        <Card className="w-full max-w-sm" key={team.id}>
            <CardHeader>
                <Link href={`/teams/${team.slug}`}>
                    <CardTitle className="text-2xl">{team.teamName}</CardTitle>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row items-center gap-4">
                    <FolderOpen />
                    <TypographyP>
                        {team.projectCount}{" "}
                        {team.projectCount === 1 ? "project" : "projects"}
                    </TypographyP>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <Users />
                    <TypographyP>
                        {team.memberCount}{" "}
                        {team.memberCount === 1 ? "member" : "members"}
                    </TypographyP>
                </div>
            </CardContent>
        </Card>
    );
};

export default TeamCard;
