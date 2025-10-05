import { Task, TaskFormData, User } from "@/types";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

import { toast } from "sonner";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
    getAllUsers();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await axios.get("/tasks");
      setTasks(fetchedTasks.data.data);
    } catch (err) {
      setError("Failed to load tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await axios.get("/user");
      setUsers(fetchedTasks.data.data);
    } catch (err) {
      setError("Failed to load Users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: TaskFormData) => {
    try {
      const newTask = await axios.post("/tasks", data);

      setTasks((prev) => [newTask.data.data as any, ...prev]);
      toast.success("task created");
      return newTask;
    } catch (err) {
      toast.error("Failed to create task. Please try again.");
      throw err;
    }
  };

  const updateTask = async () => {};
  const deleteTask = async () => {};
  const updateTaskStatus = async () => {};

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    users,
  };
}
