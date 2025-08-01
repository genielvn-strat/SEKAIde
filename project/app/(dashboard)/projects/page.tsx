import { Plus, Search, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import Link from "next/link";

export default function ProjectsPage() {
    return (
        <>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    📋 Projects Page Implementation Tasks
                </h3>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Task 4.1: Implement project CRUD operations</li>
                    <li>
                        • Task 4.2: Create project listing and dashboard
                        interface
                    </li>
                    <li>
                        • Task 4.5: Design and implement project cards and
                        layouts
                    </li>
                    <li>
                        • Task 4.6: Add project and task search/filtering
                        capabilities
                    </li>
                </ul>
            </div>
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    📁 Components to Implement
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                        <strong>components/project-card.tsx</strong>
                        <p>
                            Project display component with progress, members,
                            and actions
                        </p>
                    </div>
                    <div>
                        <strong>
                            components/modals/create-project-modal.tsx
                        </strong>
                        <p>
                            Modal for creating new projects with form validation
                        </p>
                    </div>
                    <div>
                        <strong>hooks/use-projects.ts</strong>
                        <p>
                            Custom hook for project data fetching and mutations
                        </p>
                    </div>
                    <div>
                        <strong>lib/db/schema.ts</strong>
                        <p>Database schema for projects, lists, and tasks</p>
                    </div>
                </div>
            </div>
            Projects
            <div>list project here</div>
            <div>add project form</div>
            <Link href="/projects/sample">sample id</Link>
        </>
    );
}
