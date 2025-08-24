import { FetchTask } from "@/types/ServerResponses";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, CalendarCheck2 } from "lucide-react";
import { TypographyH2 } from "./typography/TypographyH2";

interface ProjectOverviewProps {
    tasks: FetchTask[];
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ tasks }) => {
    const totalFinished = tasks.filter((t) => t.finished).length;
    const totalUnfinished = tasks.filter((t) => !t.finished).length;

    // Count finished tasks per week (using ISO week number)
    const finishedPerWeek: Record<string, number> = {};
    tasks.forEach((t) => {
        if (t.finishedAt) {
            const date = new Date(t.finishedAt);
            const year = date.getUTCFullYear();
            const week = getWeekNumber(date);
            const key = `${year}-W${week}`;
            finishedPerWeek[key] = (finishedPerWeek[key] || 0) + 1;
        }
    });

    const latestWeek = Object.entries(finishedPerWeek).sort().pop();
    const latestWeekCount = latestWeek ? latestWeek[1] : 0;

    return (
        <div className="flex flex-col gap-2">
            <TypographyH2>Project Summary</TypographyH2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {/* Finished tasks per latest week */}
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">
                            Finished (this week)
                        </CardTitle>
                        <CalendarCheck2 className="text-blue-500 w-6 h-6" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{latestWeekCount}</p>
                    </CardContent>
                </Card>
                {/* Finished tasks */}
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Finished</CardTitle>
                        <CheckCircle2 className="text-green-500 w-6 h-6" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totalFinished}</p>
                    </CardContent>
                </Card>
                {/* Unfinished tasks */}
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Unfinished</CardTitle>
                        <Circle className="text-gray-400 w-6 h-6" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totalUnfinished}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Helper to get ISO week number
function getWeekNumber(date: Date): number {
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

export default ProjectOverview;
