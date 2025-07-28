import {
    ArrowLeft,
    Settings,
    Users,
    Calendar,
    MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

export default function ProjectPage({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-6">
            {/* Project Header */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    🎯 Kanban Board Implementation Tasks
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Task 5.1: Design responsive Kanban board layout</li>
                    <li>
                        • Task 5.2: Implement drag-and-drop functionality with
                        dnd-kit
                    </li>
                    <li>
                        • Task 5.4: Implement optimistic UI updates for smooth
                        interactions
                    </li>
                    <li>
                        • Task 5.6: Create task detail modals and editing
                        interfaces
                    </li>
                </ul>
            </div>

            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    🛠️ Components & Features to Implement
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                        <strong className="block mb-2">Core Components:</strong>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>components/kanban-board.tsx</li>
                            <li>components/task-card.tsx</li>
                            <li>components/modals/create-task-modal.tsx</li>
                            <li>stores/board-store.ts (Zustand)</li>
                        </ul>
                    </div>
                    <div>
                        <strong className="block mb-2">
                            Advanced Features:
                        </strong>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>Drag & drop with @dnd-kit/core</li>
                            <li>Real-time updates</li>
                            <li>Task assignments & due dates</li>
                            <li>Comments & activity history</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
