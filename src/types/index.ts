export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: Date;
  updatedAt: Date;
  tag?: string;
  assignedUsers?: string[];
  dueDate?: string;
  comments?: number;
  attachments?: number;
}

export interface Column {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  tasks: Task[];
}

export interface Board {
  columns: Column[];
  tasks: Task[];
}

export interface TaskHistory {
  id: string;
  action: 'created' | 'moved' | 'edited' | 'deleted';
  taskId: string;
  taskTitle: string;
  fromStatus?: string;
  toStatus?: string;
  timestamp: Date;
}

export interface KanbanStore {
  // State
  tasks: Task[];
  columns: Column[];
  taskHistory: TaskHistory[];

  // Actions
  addTask: (
    title: string,
    description?: string,
    tag?: string,
    dueDate?: string
  ) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, fromStatus: string, toStatus: string) => void;
  addToHistory: (
    action: TaskHistory['action'],
    taskId: string,
    taskTitle: string,
    fromStatus?: string,
    toStatus?: string
  ) => void;
}

