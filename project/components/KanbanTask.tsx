import { FetchTask } from "@/types/ServerResponses";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function KanbanTask({ task }: { task: FetchTask }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            key={task.id}
            className="bg-white dark:bg-outer_space-300 border border-gray-200 dark:border-gray-500 rounded-md p-3 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="font-medium text-sm text-gray-800 dark:text-gray-100">
                {task.title}
            </div>
            {task.description && (
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    {task.description}
                </p>
            )}
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                <span
                    className={`px-2 py-0.5 rounded capitalize ${
                        task.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {task.priority}
                </span>
                {task.dueDate && (
                    <span>
                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                )}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {task.assigneeName} ({task.assigneeUsername})
            </div>
        </div>
    );
}
