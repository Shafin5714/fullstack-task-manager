import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Check,
  CheckCircle2,
  Circle,
  Loader2,
  MoreHorizontal,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
  onStatusChange: (taskId: string, status: Task["status"]) => Promise<void>;
}

interface StatusOption {
  value: Task["status"];
  label: string;
  description: string;
  icon: LucideIcon;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions: StatusOption[] = [
    {
      value: "Pending",
      label: "Mark as Pending",
      description: "Move task back to the backlog",
      icon: Circle,
    },
    {
      value: "In Progress",
      label: "Mark In Progress",
      description: "Highlight that work is underway",
      icon: Loader2,
    },
    {
      value: "Completed",
      label: "Mark Complete",
      description: "Celebrate a finished task",
      icon: CheckCircle2,
    },
  ];

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "In Progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "Pending":
        return "Pending";
      case "In Progress":
        return "In Progress";
      case "Completed":
        return "Completed";
      default:
        return status;
    }
  };

  const handleStatusChange = async (newStatus: Task["status"]) => {
    if (newStatus === task.status) {
      return;
    }

    setIsUpdating(true);
    try {
      await onStatusChange(task._id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(task._id);
    setShowDeleteDialog(false);
  };

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "Completed";

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow mt-3">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <h3 className="font-semibold text-sm sm:text-base leading-tight break-words flex-1">
                  {task.title}
                </h3>
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs shrink-0">
                    Overdue
                  </Badge>
                )}
              </div>
              <Badge
                className={cn("text-xs w-fit", getStatusColor(task.status))}
              >
                {getStatusLabel(task.status)}
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-100 sm:group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onEdit(task)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center cursor-pointer">
                    <Loader2 className="mr-2 h-4 w-4" />
                    Update status
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-[220px]">
                    {statusOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = task.status === option.value;

                      return (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => handleStatusChange(option.value)}
                          disabled={isUpdating || isActive}
                          className="flex items-start gap-3 cursor-pointer"
                        >
                          <Icon className="mt-0.5 h-4 w-4" />
                          <div className="flex flex-col gap-0.5 text-left">
                            <span className="text-sm font-medium">
                              {option.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          </div>
                          {isActive && (
                            <Check className="ml-auto h-4 w-4 text-primary" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 break-words">
            {task.description}
          </p>

          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 shrink-0" />
                <span className="truncate">{task.assignedUser.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 shrink-0" />
                <span className="whitespace-nowrap">
                  {format(new Date(task.dueDate), "dd/MM/yyyy")}
                </span>
              </div>
            </div>

            <Avatar className="h-6 w-6 shrink-0">
              <AvatarFallback className="text-xs">
                {task.assignedUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>

      <DeleteTaskDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        taskTitle={task.title}
      />
    </>
  );
}
