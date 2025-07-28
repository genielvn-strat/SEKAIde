import { UserPlus, Mail, MoreHorizontal } from "lucide-react";

export default function TeamPage() {
    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    📋 Team Management Implementation Tasks
                </h3>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>
                        • Task 6.1: Implement task assignment and user
                        collaboration features
                    </li>
                    <li>
                        • Task 6.4: Implement project member management and
                        permissions
                    </li>
                </ul>
            </div>
            <p>see list of teams owned</p>
            <p>see list of teams joined from other users</p>
            <p>clickable teams</p>
        </div>
    );
}
