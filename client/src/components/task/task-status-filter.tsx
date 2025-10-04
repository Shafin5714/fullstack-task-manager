"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, BarChart3 } from "lucide-react";

interface TaskStatusFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  taskCounts: {
    all: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

export function TaskStatusFilter({
  activeFilter,
  onFilterChange,
  taskCounts,
}: TaskStatusFilterProps) {
  const filters = [
    {
      id: "all",
      label: "All Tasks",
      shortLabel: "All",
      icon: BarChart3,
      count: taskCounts.all,
    },
    {
      id: "pending",
      label: "Pending",
      shortLabel: "Pending",
      icon: Clock,
      count: taskCounts.pending,
    },
    {
      id: "in-progress",
      label: "In Progress",
      shortLabel: "Progress",
      icon: AlertCircle,
      count: taskCounts.inProgress,
    },
    {
      id: "completed",
      label: "Completed",
      shortLabel: "Done",
      icon: CheckCircle,
      count: taskCounts.completed,
    },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;

        return (
          <Button
            key={filter.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "gap-2 shrink-0 whitespace-nowrap cursor-pointer",
              isActive && "bg-primary text-primary-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{filter.label}</span>
            <span className="sm:hidden">{filter.shortLabel}</span>
            <Badge
              variant={isActive ? "secondary" : "outline"}
              className="ml-1"
            >
              {filter.count}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
}
