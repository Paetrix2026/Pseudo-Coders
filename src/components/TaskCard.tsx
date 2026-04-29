import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { useTasksContext } from '../context/TasksContext';
import type { Task } from '../context/TasksContext';
import { ADHDView, AutismView, DyslexiaView, DefaultView } from './TaskViews';

export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { mode } = useAppContext();
  const { toggleTask, toggleSubtask } = useTasksContext();

  const handleToggleMain = () => toggleTask(task.id);
  const handleToggleSub = (subtaskId: string) => toggleSubtask(task.id, subtaskId);

  if (mode === 'ADHD') {
    return <ADHDView task={task} onToggleMain={handleToggleMain} onToggleSub={handleToggleSub} />;
  }

  if (mode === 'Autism') {
    return <AutismView task={task} onToggleMain={handleToggleMain} onToggleSub={handleToggleSub} />;
  }

  if (mode === 'Dyslexia') {
    return <DyslexiaView task={task} onToggleMain={handleToggleMain} onToggleSub={handleToggleSub} />;
  }

  return <DefaultView task={task} onToggleMain={handleToggleMain} onToggleSub={handleToggleSub} />;
};
