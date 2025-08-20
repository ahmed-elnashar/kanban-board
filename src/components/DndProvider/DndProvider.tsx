import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useKanbanStore } from '../../store/kanbanStore';

interface DndProviderProps {
  children: React.ReactNode;
}

export const DndProvider: React.FC<DndProviderProps> = ({ children }) => {
  const { handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop();
  const { draggedTaskId, tasks } = useKanbanStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 16, // Increased from 8 to prevent accidental drag when typing
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const draggedTask = draggedTaskId
    ? tasks.find((task) => task.id === draggedTaskId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}

      <DragOverlay>
        {draggedTask ? (
          <div
            style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '2px solid #3b82f6',
              transform: 'rotate(5deg)',
              cursor: 'grabbing',
            }}
          >
            <h3
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              {draggedTask.title}
            </h3>
            {draggedTask.description && (
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                {draggedTask.description}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

