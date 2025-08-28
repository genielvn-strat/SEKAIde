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
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorAlert from "@/components/ErrorAlert";
import { useMemo, useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Circle, FolderOpen, LayoutList } from "lucide-react";
import { FetchProject, FetchTask } from "@/types/ServerResponses";
import TaskDetails from "@/components/dialog/TaskDetails";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";

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
    const [selectedTask, setSelectedTask] = useState<FetchTask | null>(null);
    const [showTask, setShowTask] = useState<boolean>(false);
    const [userTask, setUserTask] = useState<boolean>(false);
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
    const { id } = useUser();
    const tasksEvents = useMemo(() => {
        let filteredTask = tasks?.filter((task) => task.dueDate);
        // .filter((task) => task.assigneeId == user.id);

        if (userTask && id)
            filteredTask = filteredTask?.filter((task) => task.assigneeId == id);

        return filteredTask
            ? filteredTask.map((task) => {
                  return {
                      type: "task",
                      title: task.title,
                      description: task.description,
                      start: new Date(task.dueDate!),
                      end: new Date(task.dueDate!),
                      allDay: true,
                      finished: task.finished,
                      data: task,
                  };
              })
            : [];
    }, [tasks, userTask]);
    const projectsEvents = useMemo(() => {
        const filteredProjects = projects?.filter((project) => project.dueDate);

        return filteredProjects
            ? filteredProjects.map((project) => {
                  return {
                      type: "project",
                      title: project.name,
                      description: project.description,
                      start: new Date(project.dueDate!),
                      end: new Date(project.dueDate!),
                      allDay: true,
                      finished:
                          project.finishedTaskCount! /
                              project.totalTaskCount! ==
                          1,
                      data: project,
                  };
              })
            : [];
    }, [projects]);

    const events = useMemo(() => {
        return [...tasksEvents, ...projectsEvents].sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );
    }, [tasksEvents, projectsEvents]);

    const unfinishedEvents = events.filter((e) => !e.finished);

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
                <div className="right">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="my-task"
                            onCheckedChange={setUserTask}
                            checked={userTask}
                        />
                        <Label htmlFor="my-task">Show my tasks</Label>
                    </div>
                </div>
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
                                onSelectEvent={(e) => {
                                    if (e.type == "task") {
                                        setSelectedTask(e.data as FetchTask);
                                        setShowTask(true);
                                    }
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
                        {unfinishedEvents.length == 0 ? (
                            <div className="flex items-center justify-center">
                                <TypographyMuted>
                                    No due tasks and projects across your whole
                                    team.
                                </TypographyMuted>
                            </div>
                        ) : (
                            unfinishedEvents.map((event, index) => {
                                if (event.finished) return;
                                return (
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
                                                {event.type == "task" ? (
                                                    <TaskDetails
                                                        task={
                                                            event.data as FetchTask
                                                        }
                                                    >
                                                        <div className="font-medium">
                                                            {event.title}
                                                        </div>
                                                    </TaskDetails>
                                                ) : (
                                                    event.type == "project" && (
                                                        <Link
                                                            href={`/projects/${
                                                                (
                                                                    event.data as FetchProject
                                                                ).slug
                                                            }`}
                                                        >
                                                            <div className="font-medium">
                                                                {event.title}
                                                            </div>
                                                        </Link>
                                                    )
                                                )}
                                                <div className="text-sm text-muted-foreground">
                                                    {event.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`flex flex-row items-center gap-4 ${
                                                event.start &&
                                                !event.finished &&
                                                new Date(event.start) <
                                                    new Date()
                                                    ? "text-red-600 font-semibold"
                                                    : ""
                                            }`}
                                        >
                                            <div>
                                                {!event.start
                                                    ? "No due date"
                                                    : `${new Date(
                                                          event.start
                                                      ).toLocaleDateString()}`}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>
                {showTask && selectedTask && (
                    <TaskDetails
                        task={selectedTask}
                        onOpenChange={setShowTask}
                    />
                )}
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
