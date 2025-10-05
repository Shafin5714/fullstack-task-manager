import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { TaskList } from "@/components/task/task-list";
import { TaskStatusFilter } from "@/components/task/task-status-filter";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { Task, TaskFormData } from "@/types";
import { useMemo, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  AdvancedFilters,
  type FilterOptions,
} from "@/components/task/advance-filers";
import { useTasks } from "@/hooks/use-tasks";
import { TaskForm } from "@/components/task/task-form";

const DashboardPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    assignedUser: "",
    dueDateFrom: undefined,
    dueDateTo: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    users,
    loading,
  } = useTasks();

  const filteredTasks = useTaskFilters(
    tasks,
    searchQuery,
    activeFilter,
    advancedFilters
  );

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = async (formData: TaskFormData) => {
    if (editingTask) {
      await updateTask(editingTask._id, formData);
    } else {
      await createTask(formData);
    }
  };

  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "Pending").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      completed: tasks.filter((t) => t.status === "Completed").length,
    };
  }, [tasks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        onCreateTask={handleCreateTask}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebar={() => setIsSidebarOpen(true)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="max-w-7xl mx-auto px-4">
        <DashboardStats taskCounts={taskCounts} />

        <div className="flex justify-between">
          <TaskStatusFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            taskCounts={taskCounts}
          />

          <AdvancedFilters
            filters={advancedFilters}
            onFiltersChange={setAdvancedFilters}
            assignedUsers={users.map((user) => user.name)}
          />
        </div>

        <TaskList
          tasks={filteredTasks}
          onEdit={handleEditTask}
          onDelete={deleteTask}
          onStatusChange={updateTaskStatus}
        />

        <TaskForm
          open={isTaskFormOpen}
          onOpenChange={setIsTaskFormOpen}
          task={editingTask}
          onSubmit={handleTaskSubmit}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
