"use client";

import React from "react";
import {
    FetchProject,
    FetchTask,
    FetchTeamMember,
} from "@/types/ServerResponses";
import { TypographyH2 } from "./typography/TypographyH2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ListChecks, FolderOpen } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart";
import { toKebab } from "@/lib/utils";
import ErrorAlert from "./ErrorAlert";

interface TeamOverviewTabProps {
    projects?: FetchProject[] | null;
    tasks?: FetchTask[] | null;
    members?: FetchTeamMember[] | null;
    teamSlug: string;
}

const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#fbbf24"];

const TeamOverviewTab: React.FC<TeamOverviewTabProps> = ({
    members,
    tasks,
    projects,
}) => {
    if (!projects || !tasks || !members) return <ErrorAlert />;

    const totalMembers = members.length;
    const totalProjects = projects.length;

    // --- Finished vs unfinished tasks
    const finishedCount = tasks.filter((t) => t.finished).length;
    const unfinishedCount = tasks.length - finishedCount;

    const finishedUnfinishedData = [
        {
            status: "finished",
            tasks: finishedCount,
            fill: "var(--color-finished)",
        },
        {
            status: "unfinished",
            tasks: unfinishedCount,
            fill: "var(--color-unfinished)",
        },
    ];
    const finishedUnfinishedConfig = {
        status: {
            label: "Status",
        },
        finished: {
            label: "Finished",
            color: "hsl(var(--chart-1))",
        },
        unfinished: {
            label: "Unfinished",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    // --- Tasks finished per day (last 7 days)
    const today = new Date();
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const tasksPerDay = Array(7)
        .fill(0)
        .map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i)); // go back 6..0 days
            const dayKey = d.toISOString().slice(0, 10);
            const count = tasks.filter(
                (t) =>
                    t.finished &&
                    t.finishedAt &&
                    new Date(t.finishedAt).toISOString().slice(0, 10) === dayKey
            ).length;
            return {
                day: days[d.getDay()],
                count,
            };
        });
    const taskPerDayConfig = {
        count: {
            label: "Count",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;
    const avgTasksPerDay =
        tasksPerDay.reduce((sum, d) => sum + d.count, 0) / tasksPerDay.length;

    // --- Task distribution by listName
    const listCounts: Record<string, number> = {};
    tasks.forEach((t) => {
        const key = t.listName || "Unassigned";
        listCounts[key] = (listCounts[key] || 0) + 1;
    });

    const sortedLists = Object.entries(listCounts).sort((a, b) => b[1] - a[1]);

    const topThree = sortedLists.slice(0, 3);
    const otherCount = sortedLists.slice(3).reduce((acc, [, v]) => acc + v, 0);

    const listData = [
        ...topThree.map(([name, value]) => ({
            key: toKebab(name),
            name,
            value,
            fill: `var(--color-${toKebab(name)})`,
        })),
        ...(otherCount > 0
            ? [
                  {
                      key: "other",
                      name: "Other Lists",
                      value: otherCount,
                      fill: "var(--color-other)",
                  },
              ]
            : []),
    ];

    console.log(listData);
    // Generate config dynamically from listData
    const listConfig: ChartConfig = Object.fromEntries(
        listData.map((d, i) => [
            d.key,
            {
                label: d.name,
                color: `hsl(var(--chart-${(i % 5) + 1}))`, // cycle through chart vars
            },
        ])
    );
    console.log(listConfig);

    return (
        <div className="flex flex-col gap-4">
            <TypographyH2>Team Summary</TypographyH2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Members */}
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Team Members</CardTitle>
                        <Users className="text-purple-500 w-6 h-6" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totalMembers}</p>
                    </CardContent>
                </Card>

                {/* Total Projects */}
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Projects</CardTitle>
                        <FolderOpen className="text-blue-500 w-6 h-6" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totalProjects}</p>
                    </CardContent>
                </Card>

                {/* Total Tasks */}
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Tasks</CardTitle>
                        <ListChecks className="text-green-500 w-6 h-6" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{tasks.length}</p>
                    </CardContent>
                </Card>
                {/* Average finished tasks per day */}
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">
                            Avg Finished / Day (7d)
                        </CardTitle>
                        <ListChecks className="text-orange-500 w-6 h-6" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {avgTasksPerDay.toFixed(1)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Bar chart - tasks finished in 7 days */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">
                        Tasks Finished (Last 7 Days)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={taskPerDayConfig}
                        className="w-full h-[200px]"
                    >
                        <BarChart data={tasksPerDay}>
                            <XAxis dataKey="day" />
                            <YAxis allowDecimals={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                                dataKey="count"
                                fill="var(--color-count)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pie chart - Finished vs unfinished */}
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Task Status Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="w-full flex items-center justify-center">
                        <ChartContainer
                            config={finishedUnfinishedConfig}
                            className="h-[250px] "
                        >
                            <PieChart>
                                <Pie
                                    data={finishedUnfinishedData}
                                    label
                                    dataKey="tasks"
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent nameKey="status" />
                                    }
                                />

                                <ChartLegend
                                    content={
                                        <ChartLegendContent nameKey="status" />
                                    }
                                />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Pie chart - Lists */}
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Task Distribution by Lists
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="w-full flex items-center justify-center">
                        <ChartContainer
                            config={listConfig}
                            className="h-[250px]"
                        >
                            <PieChart>
                                <Pie
                                    data={listData}
                                    dataKey="value"
                                    label
                                    nameKey={"name"}
                                />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />

                                <ChartLegend
                                    content={
                                        <ChartLegendContent nameKey="key" />
                                    }
                                />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TeamOverviewTab;
