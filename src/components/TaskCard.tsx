import React from 'react';
import { useAppContext } from '../context/AppProvider';
import type { Task } from '../context/TasksContext';
import { ADHDView, AutismView, DyslexiaView, DefaultView } from './TaskViews';

export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { mode } = useAppContext();

  if (mode === 'ADHD') return <ADHDView task={task} />;
  if (mode === 'Autism') return <AutismView task={task} />;
  if (mode === 'Dyslexia') return <DyslexiaView task={task} />;
  return <DefaultView task={task} />;
};
