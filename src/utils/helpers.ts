export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getInitialColumns = () => [
  {
    id: 'todo',
    title: 'To Do',
    status: 'todo' as const,
    tasks: [],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    status: 'in-progress' as const,
    tasks: [],
  },
  {
    id: 'done',
    title: 'Done',
    status: 'done' as const,
    tasks: [],
  },
];

