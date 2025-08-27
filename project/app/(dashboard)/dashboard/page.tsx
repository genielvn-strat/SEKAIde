"use client";
import {
    createPermissions,
    createRolePermissions,
} from "@/actions/createActions";
import FeedCard from "@/components/Feed";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyH2 } from "@/components/typography/TypographyH2";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Separator } from "@/components/ui/separator";
import { useAssignedTasks, useFeed } from "@/hooks/useDashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageCircleQuestion } from "lucide-react";
import LoadingSkeletonCards from "@/components/LoadingSkeletonCards";
import { useProjects } from "@/hooks/useProjects";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import ErrorAlert from "@/components/ErrorAlert";

export default function DashboardPage() {
    const {
        feed,
        isLoading: feedLoading,
        isError: feedIsError,
        error: feedError,
    } = useFeed();

    const {
        tasks,
        isLoading: tasksLoading,
        isError: tasksIsError,
        error: tasksError,
    } = useAssignedTasks();

    const {
        projects,
        isLoading: projectsLoading,
        isError: projectsIsError,
        error: projectsError,
    } = useProjects();

    return (
        <>
            <div className="doc-header flex flex-row justify-between items-center">
                <div className="left">
                    <TypographyH1>Dashboard</TypographyH1>
                    <TypographyMuted>
                        Welcome back! Here are the recent activities across your
                        teams.
                    </TypographyMuted>
                </div>
                <div className="right"></div>
            </div>
            <Separator className="my-4" />
            <div className="flex gap-8 flex-col-reverse md:flex-row">
                <div className="space-y-4 w-full">
                    <TypographyH2>Feed</TypographyH2>
                    {feedLoading ? (
                        <LoadingSkeletonCards />
                    ) : feedIsError ? (
                        <ErrorAlert message={feedError?.message} />
                    ) : feed?.length == 0 ? (
                        <Alert variant="default">
                            <MessageCircleQuestion />
                            <AlertTitle>No recent activity</AlertTitle>
                            <AlertDescription>
                                Looks like nothing has happened here yet. Check
                                back later for updates.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        feed?.map((m, idx) => <FeedCard feed={m} key={idx} />)
                    )}
                </div>

                <div className="w-full flex flex-col gap-4">
                    <div className="space-y-4 w-full">
                        <TypographyH2>Assigned Tasks</TypographyH2>
                        {tasksLoading ? (
                            <LoadingSkeletonCards />
                        ) : tasksIsError ? (
                            <ErrorAlert message={tasksError?.message} />
                        ) : tasks?.length == 0 ? (
                            <Alert variant="default">
                                <MessageCircleQuestion />
                                <AlertTitle>No tasks assigned</AlertTitle>
                                <AlertDescription>
                                    Horray! Let's wait for more tasks to get
                                    assigned for you.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            tasks
                                ?.slice(0, 7)
                                .map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))
                        )}
                    </div>
                    <div className="space-y-4 w-full">
                        <TypographyH2>Recently Updated Projects</TypographyH2>
                        {projectsLoading ? (
                            <LoadingSkeletonCards />
                        ) : projectsIsError ? (
                            <ErrorAlert message={projectsError?.message} />
                        ) : projects?.length == 0 ? (
                            <Alert variant="default">
                                <MessageCircleQuestion />
                                <AlertTitle>No projects found</AlertTitle>
                                <AlertDescription>
                                    There are no projects available right now.
                                    Please wait for one to be assigned, or
                                    create a new project if you're a Project
                                    Manager.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            projects
                                ?.slice(0, 3)
                                .map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                    />
                                ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
// <Button
//     onClick={async () => {
//         createPermissions();
//     }}
// >
//     Create Permissions
// </Button>
// <Button
//     onClick={async () => {
//         createRolePermissions();
//     }}
// >
//     Create Role Permission
// </Button>

// <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//     <div className="flex items-start">
//         <div className="flex-shrink-0">
//             <div className="w-8 h-8 bg-blue_munsell-500 rounded-full flex items-center justify-center">
//                 <TrendingUp className="text-white" size={16} />
//             </div>
//         </div>
//         <div className="ml-3">
//             <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
//                 Dashboard Implementation Tasks
//             </h3>
//             <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
//                 <ul className="list-disc list-inside space-y-1">
//                     <li>
//                         Task 4.2: Create project listing and
//                         dashboard interface
//                     </li>
//                     <li>
//                         Task 5.3: Set up client-side state
//                         management with Zustand
//                     </li>
//                     <li>
//                         Task 6.6: Optimize performance and implement
//                         loading states
//                     </li>
//                 </ul>
//             </div>
//         </div>
//     </div>
// </div>
