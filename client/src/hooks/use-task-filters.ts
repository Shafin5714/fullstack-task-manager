import { useMemo } from "react";
import type { FilterOptions } from "@/components/task/advance-filers";
import { Task } from "@/types";

export function useTaskFilters(
  tasks: Task[],
  searchQuery: string,
  statusFilter: string,
  advancedFilters: FilterOptions
) {
  return useMemo(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.assignedUser.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => {
        if (statusFilter === "in-progress")
          return task.status === "in-progress";
        return task.status === statusFilter;
      });
    }

    // Apply assigned user filter
    if (advancedFilters.assignedUser) {
      filtered = filtered.filter(
        (task) => task.assignedUser === advancedFilters.assignedUser
      );
    }

    // Apply due date range filter
    if (advancedFilters.dueDateFrom) {
      filtered = filtered.filter(
        (task) => new Date(task.dueDate) >= advancedFilters.dueDateFrom!
      );
    }

    if (advancedFilters.dueDateTo) {
      filtered = filtered.filter(
        (task) => new Date(task.dueDate) <= advancedFilters.dueDateTo!
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (advancedFilters.sortBy) {
        case "dueDate":
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "status":
          // Custom status order: pending, in-progress, completed
          const statusOrder = { pending: 0, "in-progress": 1, completed: 2 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (aValue < bValue) return advancedFilters.sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return advancedFilters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tasks, searchQuery, statusFilter, advancedFilters]);
}
