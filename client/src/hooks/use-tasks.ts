"use client";

import { Task } from "@/types";
import { useState, useEffect, useCallback } from "react";
// import { taskApi, initializeSampleData } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

import { toast } from "sonner";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = useCallback(async () => {
    // try {
    //   setLoading(true);
    //   setError(null);
    //   //   const fetchedTasks = await taskApi.getTasks();
    //   //   setTasks(fetchedTasks);
    // } catch (err) {
    //   setError("Failed to load tasks");
    //   toast({
    //     title: "Error",
    //     description: "Failed to load tasks. Please try again.",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setLoading(false);
    // }
  }, [toast]);

  const createTask = useCallback();
  // async (data: TaskFormData) => {
  //   try {
  //     const newTask = await taskApi.createTask(data);
  //     setTasks((prev) => [newTask, ...prev]);
  //     toast({
  //       title: "Task created",
  //       description: "A new task has been successfully created.",
  //     });
  //     return newTask;
  //   } catch (err) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to create task. Please try again.",
  //       variant: "destructive",
  //     });
  //     throw err;
  //   }
  // },
  // [toast]

  const updateTask = useCallback(
    // async (id: string, data: TaskFormData) => {
    //   try {
    //     const updatedTask = await taskApi.updateTask(id, data);
    //     setTasks((prev) =>
    //       prev.map((task) => (task.id === id ? updatedTask : task))
    //     );
    //     toast({
    //       title: "Task updated",
    //       description: "The task has been successfully updated.",
    //     });
    //     return updatedTask;
    //   } catch (err) {
    //     toast({
    //       title: "Error",
    //       description: "Failed to update task. Please try again.",
    //       variant: "destructive",
    //     });
    //     throw err;
    //   }
    // },
    [toast]
  );

  const deleteTask = useCallback();
  // async (id: string) => {
  //   try {
  //     await taskApi.deleteTask(id);
  //     setTasks((prev) => prev.filter((task) => task.id !== id));
  //     toast({
  //       title: "Task deleted",
  //       description: "The task has been successfully deleted.",
  //     });
  //   } catch (err) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to delete task. Please try again.",
  //       variant: "destructive",
  //     });
  //     throw err;
  //   }
  // },
  // [toast]

  const updateTaskStatus = useCallback(
    async (id: string, status: Task["status"]) => {
      try {
        const updatedTask = await taskApi.updateTaskStatus(id, status);
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
        toast({
          title: "Task updated",
          description: `Task status changed to ${status}.`,
        });
        return updatedTask;
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to update task status. Please try again.",
          variant: "destructive",
        });
        throw err;
      }
    },
    [toast]
  );

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
}
