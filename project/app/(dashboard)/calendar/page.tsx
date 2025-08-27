"use client";

import { useState } from "react";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyMuted } from "@/components/typography/TypographyMuted";

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState("December 2024");
    const [view, setView] = useState("month");

    // Sample events
    const events = [
        {
            title: "Website Redesign",
            date: "2024-12-15",
            type: "Project Deadline",
        },
        { title: "Team Meeting", date: "2024-12-18", type: "Meeting" },
        { title: "Mobile App Launch", date: "2024-12-22", type: "Milestone" },
    ];

    return (
        <>
            {/* Header */}
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

            {/* Calendar Controls */}
            <div className="flex flex-col gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>{currentMonth}</CardTitle>
                            <Button variant="ghost" size="icon">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <Select value={view} onValueChange={setView}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="View" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="month">Month</SelectItem>
                                <SelectItem value="week">Week</SelectItem>
                                <SelectItem value="day">Day</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72 flex flex-col items-center justify-center text-muted-foreground border rounded-md">
                            <CalendarIcon className="h-10 w-10 mb-2" />
                            <p>Calendar grid placeholder ({view} view)</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Agenda / Upcoming Events */}
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
                                <div>
                                    <div className="font-medium">
                                        {event.title}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {event.type}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(event.date).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
