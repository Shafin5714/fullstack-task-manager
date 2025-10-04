import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { TaskList } from "@/components/task/task-list";
import { TaskStatusFilter } from "@/components/task/task-status-filter";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { Task, TaskFormData } from "@/types";
import { useState } from "react";
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
    loading: tasksLoading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
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
      await updateTask(editingTask.id, formData);
    } else {
      await createTask(formData);
    }
  };

  return (
    <div>
      <DashboardHeader
        onCreateTask={handleCreateTask}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
      <div className="max-w-7xl mx-auto px-4">
        <DashboardStats
          taskCounts={{
            all: 10,
            pending: 10,
            inProgress: 10,
            completed: 10,
          }}
        />
        <TaskStatusFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          taskCounts={{
            all: 10,
            pending: 10,
            inProgress: 10,
            completed: 10,
          }}
        />

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
