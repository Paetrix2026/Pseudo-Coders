import React, { createContext, useContext, useState, useEffect } from 'react';
import tasksData from '../data/tasks.json';
import { useAppContext } from './AppProvider';

// --- Deep Type Hierarchy ---

export interface Microtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface RichSubtask {
  id: string;
  text: string;
  completed: boolean;
  microtasks: Microtask[];
}

export interface Step {
  id: string;
  title: string;
  completed: boolean;
  subtasks: RichSubtask[];
}

// Legacy flat subtask — kept for backward compatibility
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
  // New deep structure
  steps: Step[];
  sections: { heading: string; content: string }[];
  // Legacy flat subtasks kept for backward compatibility
  subtasks: Subtask[];
}

interface TasksContextType {
  tasks: Task[];
  toggleTask: (taskId: string) => void;
  toggleStep: (taskId: string, stepId: string) => void;
  toggleSubtask: (taskId: string, stepId: string, subtaskId: string) => void;
  toggleMicrotask: (taskId: string, stepId: string, subtaskId: string, microtaskId: string) => void;
  importDummyTasks: () => void;
  addTask: (task: Task) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

// --- Helper: derive parent completion from children ---
function allDone<T extends { completed: boolean }>(items: T[]): boolean {
  return items.length > 0 && items.every(i => i.completed);
}

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
    const formattedTasks = (tasksData as any[]).map(t => {
      const steps: Step[] = (t.steps || []).map((s: any) => ({
        id: s.id,
        title: s.title,
        completed: false,
        subtasks: (s.subtasks || []).map((st: any) => ({
          id: st.id,
          text: st.text,
          completed: false,
          microtasks: (st.microtasks || []).map((m: any) => ({
            id: m.id,
            text: m.text,
            completed: false,
          })),
        })),
      }));

      // Legacy flat subtasks derived from step titles for backward-compat
      const subtasks: Subtask[] = steps.map(s => ({
        id: s.id,
        text: s.title,
        completed: false,
      }));

      return {
        id: t.id,
        title: t.title,
        description: t.description,
        completed: false,
        sections: t.sections || [],
        steps,
        subtasks,
      };
    });
    setTasks(formattedTasks);
  };

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  // Toggle entire task (and all children)
  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const next = !task.completed;
      return {
        ...task,
        completed: next,
        subtasks: task.subtasks.map(st => ({ ...st, completed: next })),
        steps: task.steps.map(s => ({
          ...s,
          completed: next,
          subtasks: s.subtasks.map(st => ({
            ...st,
            completed: next,
            microtasks: st.microtasks.map(m => ({ ...m, completed: next })),
          })),
        })),
      };
    }));
  };

  // Toggle a step and cascade up/down
  const toggleStep = (taskId: string, stepId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const updatedSteps = task.steps.map(s => {
        if (s.id !== stepId) return s;
        const next = !s.completed;
        return {
          ...s,
          completed: next,
          subtasks: s.subtasks.map(st => ({
            ...st,
            completed: next,
            microtasks: st.microtasks.map(m => ({ ...m, completed: next })),
          })),
        };
      });
      return {
        ...task,
        steps: updatedSteps,
        subtasks: task.subtasks.map(st => {
          const matchingStep = updatedSteps.find(s => s.id === st.id);
          return matchingStep ? { ...st, completed: matchingStep.completed } : st;
        }),
        completed: allDone(updatedSteps),
      };
    }));
  };

  // Toggle a subtask within a step and cascade
  const toggleSubtask = (taskId: string, stepId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const updatedSteps = task.steps.map(s => {
        if (s.id !== stepId) return s;
        const updatedSubs = s.subtasks.map(st => {
          if (st.id !== subtaskId) return st;
          const next = !st.completed;
          return {
            ...st,
            completed: next,
            microtasks: st.microtasks.map(m => ({ ...m, completed: next })),
          };
        });
        return { ...s, subtasks: updatedSubs, completed: allDone(updatedSubs) };
      });
      return {
        ...task,
        steps: updatedSteps,
        completed: allDone(updatedSteps),
      };
    }));
  };

  // Toggle a microtask and cascade up
  const toggleMicrotask = (taskId: string, stepId: string, subtaskId: string, microtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const updatedSteps = task.steps.map(s => {
        if (s.id !== stepId) return s;
        const updatedSubs = s.subtasks.map(st => {
          if (st.id !== subtaskId) return st;
          const updatedMicros = st.microtasks.map(m =>
            m.id === microtaskId ? { ...m, completed: !m.completed } : m
          );
          return { ...st, microtasks: updatedMicros, completed: allDone(updatedMicros) };
        });
        return { ...s, subtasks: updatedSubs, completed: allDone(updatedSubs) };
      });
      return { ...task, steps: updatedSteps, completed: allDone(updatedSteps) };
    }));
  };

  return (
    <TasksContext.Provider value={{ tasks, toggleTask, toggleStep, toggleSubtask, toggleMicrotask, importDummyTasks, addTask }}>
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
