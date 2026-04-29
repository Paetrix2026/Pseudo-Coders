import React, { createContext, useContext, useState, useEffect } from 'react';
import tasksData from '../data/tasks.json';
import { useAppContext } from './AppProvider';

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
  const { user } = useAppContext();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`tasks_${user.email}`);
      if (saved) {
        setTasks(JSON.parse(saved));
      } else {
        setTasks([]);
      }
    } else {
      setTasks([]);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`tasks_${user.email}`, JSON.stringify(tasks));
    }
  }, [tasks, user?.email]);

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
