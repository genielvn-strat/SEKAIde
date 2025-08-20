"use client";
import { createPermissions, createRolePermissions } from "@/actions/createActions";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, CheckCircle, Clock, Plus } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <Button
                onClick={async () => {
                    createPermissions();
                }}
            >
                Create Permissions
            </Button>
            <Button
                onClick={async () => {
                    createRolePermissions();
                }}
            >
                Create Role Permission
            </Button>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue_munsell-500 rounded-full flex items-center justify-center">
                            <TrendingUp className="text-white" size={16} />
                        </div>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Dashboard Implementation Tasks
                        </h3>
                        <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                            <ul className="list-disc list-inside space-y-1">
                                <li>
                                    Task 4.2: Create project listing and
                                    dashboard interface
                                </li>
                                <li>
                                    Task 5.3: Set up client-side state
                                    management with Zustand
                                </li>
                                <li>
                                    Task 6.6: Optimize performance and implement
                                    loading states
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
