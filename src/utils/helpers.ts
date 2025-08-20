let idCounter = 0;

export const generateId = (): string => {
  idCounter++;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 12);
  const counter = idCounter.toString(36);

  // Use crypto.randomUUID if available for even better uniqueness
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    const uuid = crypto.randomUUID().replace(/-/g, '').substr(0, 8);
    return `${timestamp}-${random}-${counter}-${uuid}`;
  }

  return `${timestamp}-${random}-${counter}`;
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

