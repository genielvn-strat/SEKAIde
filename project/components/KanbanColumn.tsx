import { FetchList, FetchTask } from "@/types/ServerResponses";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { KanbanTask } from "./KanbanTask";

export function KanbanColumn({
    list,
    tasks,
}: {
    list: FetchList;
    tasks: FetchTask[];
}) {
    const { setNodeRef } = useDroppable({
        id: list.id,
    });

    return (
        <div 
            ref={setNodeRef} 
            className="flex-shrink-0 w-80 p-4 rounded-lg border bg-gray-50 dark:bg-outer_space-400"
        >
            {/* Column Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {list.name}
                </h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {tasks.length}
                </span>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-3 p-3 overflow-y-auto max-h-[70vh]">
                <SortableContext items={tasks.map(task => task.id)}>
                    {tasks.map((task) => (
                        <KanbanTask key={task.id} task={task} />
                    ))}
                </SortableContext>

                {/* Empty state */}
                {tasks.length === 0 && (
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-6">
                        No tasks
                    </div>
                )}
            </div>
        </div>
    );
}