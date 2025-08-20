export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: Date;
  updatedAt: Date;
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
  draggedTaskId: string | null;

  // Actions
  addTask: (
    title: string,
    description?: string,
    initialStatus?: Task['status']
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
  setDraggedTask: (taskId: string | null) => void;
  reorderTasks: (columnId: string, taskIds: string[]) => void;
  resetStore: () => void;
}

