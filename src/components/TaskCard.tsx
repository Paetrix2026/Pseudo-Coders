import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { useTasksContext } from '../context/TasksContext';
import type { Task } from '../context/TasksContext';
import { CheckCircle2, Circle } from 'lucide-react';

export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { mode } = useAppContext();
  const { toggleTask, toggleSubtask } = useTasksContext();

  const handleToggleMain = () => {
    toggleTask(task.id);
  };

  const handleToggleSub = (subtaskId: string) => {
    toggleSubtask(task.id, subtaskId);
  };

  // 1. ADHD Mode: Step-by-step breakdown, numbered list, progress indicator
  if (mode === 'ADHD') {
    const completedCount = task.subtasks.filter(st => st.completed).length;
    const progress = Math.round((completedCount / (task.subtasks.length || 1)) * 100) || 0;
    
    return (
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
        <div className="flex items-start justify-between mb-4">
          <h3 className={`text-xl font-bold ${task.completed ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h3>
          <button onClick={handleToggleMain} className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
            {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-primary">Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <div className="space-y-3">
          {task.subtasks.map((subtask, index) => {
            const isDone = subtask.completed;
            return (
              <button
                key={subtask.id}
                onClick={() => handleToggleSub(subtask.id)}
                className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                  isDone 
                    ? 'border-primary bg-primary/5 text-gray-500 dark:text-gray-400 line-through' 
                    : 'border-transparent bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="mt-0.5 text-primary">
                  {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>
                <span className="font-medium text-lg leading-tight flex-1">
                  <span className="mr-2 text-primary font-bold">{index + 1}.</span>
                  {subtask.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Dyslexia Mode: Short sentences, bullet points, increased spacing
  if (mode === 'Dyslexia') {
    return (
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all relative">
        <button onClick={handleToggleMain} className="absolute top-8 right-8 text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
          {task.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
        </button>
        <h3 className={`text-2xl font-bold mb-6 leading-relaxed tracking-wide pr-12 ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
        
        <p className="text-lg leading-[2] tracking-wide mb-8 bg-amber-50 dark:bg-amber-900/10 text-gray-800 dark:text-gray-200 p-6 rounded-xl border border-amber-100 dark:border-amber-900/30">
          {task.description}
        </p>

        <ul className="space-y-6">
          {task.subtasks.map((subtask) => (
            <li key={subtask.id} className="flex items-center gap-4 text-lg leading-relaxed tracking-wide cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg" onClick={() => handleToggleSub(subtask.id)}>
              <div className="text-primary shrink-0">
                {subtask.completed ? <CheckCircle2 size={24} /> : <div className="h-3 w-3 rounded-full bg-primary mx-1.5" />}
              </div>
              <span className={subtask.completed ? 'line-through text-gray-400' : ''}>{subtask.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 3. Autism Mode: Structured sections, clear headings, minimal clutter
  if (mode === 'Autism') {
    return (
      <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative">
        <button onClick={handleToggleMain} className="absolute top-5 right-6 text-primary hover:bg-primary/10 p-2 rounded-full transition-colors z-10">
          {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 pr-16">
          <h3 className={`text-xl font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
        </div>
        
        <div className="p-6">
          <div className="grid gap-6">
            {task.sections.map((section, index) => (
              <div key={index} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {section.heading}
                </h4>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default mode
  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md relative">
      <button onClick={handleToggleMain} className="absolute top-6 right-6 text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>
      <h3 className={`text-lg font-bold mb-2 pr-12 ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{task.description}</p>
      
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
        <h4 className="font-medium mb-2 text-sm text-gray-500">Steps to complete:</h4>
        <ul className="space-y-2 text-sm">
          {task.subtasks.map((subtask) => (
            <li key={subtask.id} className="flex items-start gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded" onClick={() => handleToggleSub(subtask.id)}>
              <div className="mt-0.5 text-primary">
                {subtask.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </div>
              <span className={subtask.completed ? 'line-through text-gray-400' : ''}>{subtask.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
