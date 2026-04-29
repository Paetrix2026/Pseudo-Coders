import React, { createContext, useContext, useState, useEffect } from 'react';
import tasksData from '../data/tasks.json';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  subtasks: Subtask[];
  sections: { heading: string; content: string }[];
  steps: string[]; // Kept for backward compatibility with Autism/Dyslexia modes
}

interface TasksContextType {
  tasks: Task[];
  toggleTask: (taskId: string, completed?: boolean) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  importDummyTasks: () => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks_v2');
    if (saved) return JSON.parse(saved);
    
    const savedV1 = localStorage.getItem('tasks');
    if (savedV1) {
      const v1Tasks = JSON.parse(savedV1);
      return v1Tasks.map((t: any) => ({
        ...t,
        completed: false,
        subtasks: t.steps.map((step: string, i: number) => ({
          id: `${t.id}-sub-${i}`,
          text: step,
          completed: false
        }))
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  const importDummyTasks = () => {
    const formattedTasks = (tasksData as any[]).map(t => ({
      ...t,
      completed: false,
      subtasks: t.steps.map((step: string, i: number) => ({
        id: `${t.id}-sub-${i}`,
        text: step,
        completed: false
      }))
    }));
    setTasks(formattedTasks);
  };

  const toggleTask = (taskId: string, completedOverride?: boolean) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const isCompleted = completedOverride !== undefined ? completedOverride : !task.completed;
        return {
          ...task,
          completed: isCompleted,
          subtasks: task.subtasks.map(st => ({ ...st, completed: isCompleted }))
        };
      }
      return task;
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const allCompleted = updatedSubtasks.every(st => st.completed);
        return {
          ...task,
          subtasks: updatedSubtasks,
          completed: allCompleted
        };
      }
      return task;
    }));
  };

  return (
    <TasksContext.Provider value={{ tasks, toggleTask, toggleSubtask, importDummyTasks }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
};
