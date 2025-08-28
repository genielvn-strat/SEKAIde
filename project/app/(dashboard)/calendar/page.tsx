"use client";

import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Separator } from "@/components/ui/separator";
import ShadcnBigCalendar from "@/components/shadcn-big-calendar/ShadcnBigCalendar";
import { useCalendarTasks } from "@/hooks/useTasks";
import LoadingSkeletonCards from "@/components/LoadingSkeletonCards";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorAlert from "@/components/ErrorAlert";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    createPermissions,
    createRolePermissions,
    createRoles,
} from "@/actions/createActions";
import { useProjects } from "@/hooks/useProjects";
import { Circle, FolderOpen, LayoutList } from "lucide-react";

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales,
});
export default function CalendarPage() {
    const {
        tasks,
        isLoading: tasksIsLoading,
        isError: tasksIsError,
        error: tasksError,
    } = useCalendarTasks();
    const {
        projects,
        isLoading: projectsIsLoading,
        isError: projectsIsError,
        error: projectsError,
    } = useProjects();
    const tasksEvents = useMemo(() => {
        const filteredTask = tasks?.filter((task) => task.dueDate);

        return filteredTask
            ? filteredTask.map((task) => {
                  return {
                      type: "task",
                      title: task.title,
                      description: task.description,
                      start: new Date(task.dueDate!),
                      end: new Date(task.dueDate!),
                      allDay: true,
                  };
              })
            : [];
    }, [tasks]);
    const projectsEvents = useMemo(() => {
        const projectTasks = projects?.filter((project) => project.dueDate);

        return projectTasks
            ? projectTasks.map((project) => {
                  return {
                      type: "project",
                      title: project.name,
                      description: project.description,
                      start: new Date(project.dueDate!),
                      end: new Date(project.dueDate!),
                      allDay: true,
                  };
              })
            : [];
    }, [projects]);

    const events = useMemo(() => {
        return [...tasksEvents, ...projectsEvents].sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );
    }, [tasksEvents, projectsEvents]);

    if (tasksIsLoading || projectsIsLoading) return <LoadingSkeleton />;
    if (tasksIsError || projectsIsError)
        return (
            <ErrorAlert
                message={tasksError?.message || projectsError?.message}
            />
        );

    // const sampleEvents = [
    //     {
    //         title: "Website Redesign",
    //         start: new Date("2025-12-15"),
    //         end: new Date("2025-12-15"),
    //         allDay: true,
    //     },
    //     {
    //         title: "Website Redesign",
    //         start: new Date("2025-12-15"),
    //         end: new Date("2025-12-15"),
    //         allDay: true,
    //     },
    //     {
    //         title: "Website Redesign",
    //         start: new Date("2025-12-15"),
    //         end: new Date("2025-12-15"),
    //         allDay: true,
    //     },
    //     {
    //         title: "Team Meeting",
    //         start: new Date("2025-12-18"),
    //         end: new Date("2025-12-18"),
    //         allDay: true,
    //     },
    //     {
    //         title: "Mobile App Launch",
    //         start: new Date("2025-12-22"),
    //         end: new Date("2025-12-22"),
    //         allDay: true,
    //     },
    // ];

    return (
        <>
            <div className="doc-header flex flex-row justify-between items-center">
                <div className="left">
                    <TypographyH1>Calendar</TypographyH1>
                    <TypographyMuted>
                        View team project and task deadlines
                    </TypographyMuted>
                </div>
                <div className="right"></div>
            </div>
            <Separator className="my-4" />

            <div className="flex flex-col gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[600px]">
                            <ShadcnBigCalendar
                                localizer={localizer}
                                events={events}
                                style={{ height: "100%" }}
                                views={["month", "agenda"]}
                                step={60}
                                showMultiDayTimes={false}
                                formats={{
                                    timeGutterFormat: () => "",
                                    eventTimeRangeFormat: () => "",
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {events.map((event, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-md"
                            >
                                <div className="flex flex-row items-center gap-4">
                                    {event.type == "task" ? (
                                        <LayoutList />
                                    ) : event.type == "project" ? (
                                        <FolderOpen />
                                    ) : (
                                        <Circle />
                                    )}
                                    <div>
                                        <div className="font-medium">
                                            {event.title}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {event.description}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {event.start.toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

{
    /* <Button
                onClick={async () => {
                    await createRoles();
                    await createPermissions();
                    await createRolePermissions();
                }}
            ></Button> */
}
