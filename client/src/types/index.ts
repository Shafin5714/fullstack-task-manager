export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignedUser: string;
  dueDate: string;
  createdAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignedUser: string;
  dueDate: string;
}
