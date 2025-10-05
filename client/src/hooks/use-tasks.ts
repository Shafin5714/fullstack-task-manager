"use client";

import { Task, TaskFormData } from "@/types";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

import { toast } from "sonner";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
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

  const createTask = async () => {};
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
  };
}
