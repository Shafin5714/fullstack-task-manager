import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Task, TaskFormData } from "@/types";
import { useTasks } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

export function TaskForm({
  open,
  onOpenChange,
  task,
  onSubmit,
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "Pending",
    assignedUser: "",
    dueDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showDueDateError, setShowDueDateError] = useState(false);
  // hooks
  const { users } = useTasks();

  useEffect(() => {
    setShowDueDateError(false);

    if (task) {
      const existingDueDate = new Date(task.dueDate);

      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        assignedUser: task.assignedUser._id,
        dueDate: Number.isNaN(existingDueDate.getTime())
          ? ""
          : format(existingDueDate, "yyyy-MM-dd"),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Pending",
        assignedUser: "",
        dueDate: "",
      });
    }
  }, [task, open]);

  useEffect(() => {
    if (isSubmitting) {
      setIsCalendarOpen(false);
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (!open) {
      setIsCalendarOpen(false);
      setShowDueDateError(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dueDate) {
      setShowDueDateError(true);
      setIsCalendarOpen(true);
      return;
    }

    setShowDueDateError(false);
    setIsSubmitting(true);

    console.log(formData.dueDate);

    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedDueDate = formData.dueDate
    ? new Date(formData.dueDate)
    : undefined;
  const calendarSelectedDate =
    selectedDueDate && !Number.isNaN(selectedDueDate.getTime())
      ? selectedDueDate
      : undefined;

  const handleDueDateSelect = (date: Date | undefined) => {
    handleChange("dueDate", date ? format(date, "yyyy-MM-dd") : "");
    setShowDueDateError(!date);
    if (date) {
      setIsCalendarOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update the task details below."
              : "Fill in the details to create a new task."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter task title"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter task description"
              rows={3}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="status">Assigned User</Label>
              <Select
                value={formData.assignedUser}
                onValueChange={(value) => handleChange("assignedUser", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem value={user._id} key={user._id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate-trigger">Due Date</Label>
            <Popover
              open={isCalendarOpen}
              onOpenChange={(openState) => {
                if (!isSubmitting) {
                  setIsCalendarOpen(openState);
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  id="dueDate-trigger"
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !calendarSelectedDate && "text-muted-foreground",
                    showDueDateError &&
                      !formData.dueDate &&
                      "border-destructive"
                  )}
                  aria-invalid={showDueDateError && !formData.dueDate}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {calendarSelectedDate
                    ? format(calendarSelectedDate, "PPP")
                    : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={calendarSelectedDate}
                  onSelect={handleDueDateSelect}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                    isSubmitting
                  }
                />
              </PopoverContent>
            </Popover>
            {showDueDateError && !formData.dueDate && (
              <p className="text-sm text-destructive">Select a due date.</p>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 space-x-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto cursor-pointer"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {task ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
