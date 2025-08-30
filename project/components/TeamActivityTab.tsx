"use client";

import React from "react";
import { DataTable } from "./DataTable";
import { FetchTeamActivity } from "@/types/ServerResponses";
import ErrorAlert from "./ErrorAlert";
import { TeamActivityColumns } from "./columns/TeamActivityColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, LineChart, CartesianGrid, Line } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart";

interface TeamActivityTabProps {
    activity?: FetchTeamActivity[] | null;
    teamSlug: string;
}
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TeamActivityTab: React.FC<TeamActivityTabProps> = ({
    activity: activity,
    teamSlug,
}) => {
    if (!activity) return <ErrorAlert />;
    const today = new Date();

    // Count activities per day (last 7 days)
    const activitiesPerDay = Array(7)
        .fill(0)
        .map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            const dayKey = d.toISOString().slice(0, 10);
            const count = activity.filter(
                (a) =>
                    a.createdAt &&
                    new Date(a.createdAt).toISOString().slice(0, 10) === dayKey
            ).length;
            return {
                day: days[d.getDay()],
                count,
            };
        });

    const activitiesPerDayConfig = {
        count: {
            label: "Count",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <div className="flex flex-col gap-4">
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">
                        Activity Log (Last 7 Days)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={activitiesPerDayConfig}
                        className="w-full h-[200px]"
                    >
                        <LineChart data={activitiesPerDay}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="day" />
                            <YAxis allowDecimals={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                                dataKey="count"
                                type="linear"
                                stroke="var(--color-count)"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <DataTable
                columns={TeamActivityColumns(teamSlug)}
                data={activity}
            />
        </div>
    );
};

export default TeamActivityTab;
