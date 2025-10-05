export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  assignedUser: {
    _id: string;
    name: string;
    email: string;
  };
  dueDate: string;
  createdAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  assignedUser: string;
  dueDate: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}
