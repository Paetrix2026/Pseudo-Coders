import React, { useState } from 'react';
import type { Task } from '../context/TasksContext';
import { CheckCircle2, Circle, CheckSquare, Square, ArrowRight, ArrowLeft } from 'lucide-react';

interface TaskViewProps {
  task: Task;
  onToggleMain: () => void;
  onToggleSub: (subtaskId: string) => void;
}

export const ADHDView: React.FC<TaskViewProps> = ({ task, onToggleMain, onToggleSub }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = Math.max(task.subtasks.length, 1);
  const progress = Math.round((currentStep / totalSteps) * 100);

  const handleNext = () => {
    if (currentStep < task.subtasks.length) {
      if (!task.subtasks[currentStep].completed) {
        onToggleSub(task.subtasks[currentStep].id);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold leading-tight">{task.title}</h3>
      </div>
      
      <div className="mb-6 bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {currentStep < task.subtasks.length ? (
        <div className="text-center py-6">
          <span className="text-sm font-bold text-primary uppercase tracking-widest mb-4 block">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <h4 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-100 min-h-[4rem] flex items-center justify-center">
            {task.subtasks[currentStep].text}
          </h4>
          <button 
            onClick={handleNext} 
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-1"
          >
            Complete & Next <ArrowRight size={20} />
          </button>
        </div>
      ) : (
        <div className="text-center py-6 animate-in zoom-in duration-300">
          <CheckCircle2 size={56} className="mx-auto text-green-500 mb-4 drop-shadow-sm" />
          <h4 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">All steps completed!</h4>
          <button 
            onClick={onToggleMain} 
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-sm ${
              task.completed 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:-translate-y-1'
            }`}
          >
            {task.completed ? 'Task is Done' : 'Mark Full Task Done'}
          </button>
        </div>
      )}
    </div>
  );
};

export const AutismView: React.FC<TaskViewProps> = ({ task, onToggleMain }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden font-mono shadow-sm">
      <div className="bg-gray-50 dark:bg-gray-950 p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <h3 className={`text-lg font-bold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
          {task.title}
        </h3>
        <button onClick={onToggleMain} className="text-primary hover:scale-110 transition-transform">
          {task.completed ? <CheckSquare size={28} /> : <Square size={28} />}
        </button>
      </div>
      <div className="p-6 space-y-8">
        {task.sections && task.sections.length > 0 ? (
          task.sections.map((sec, i) => (
            <div key={i}>
              <div className="text-sm font-bold text-primary mb-3 tracking-widest">
                [{sec.heading.toUpperCase()}]
              </div>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-2 space-y-2 text-base">
                <li>{sec.content}</li>
              </ul>
            </div>
          ))
        ) : (
          <div>
            <div className="text-sm font-bold text-primary mb-3 tracking-widest">[EXECUTION]</div>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-2 space-y-2 text-base">
              {task.subtasks.map(st => (
                <li key={st.id} className={st.completed ? 'line-through text-gray-400' : ''}>{st.text}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export const DyslexiaView: React.FC<TaskViewProps> = ({ task, onToggleMain }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const chunks = task.subtasks.length > 0 ? task.subtasks : [{ id: '1', text: task.description, completed: task.completed }];
  
  return (
    <div className="bg-[#FFFDF8] dark:bg-gray-900 p-8 rounded-[2rem] shadow-md border-2 border-amber-100 dark:border-gray-800 text-center relative">
      <div className="absolute top-8 right-8">
        <button onClick={onToggleMain} className="text-amber-600 dark:text-amber-500 hover:scale-110 transition-transform">
          {task.completed ? <CheckCircle2 size={36} /> : <Circle size={36} />}
        </button>
      </div>
      <h3 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 tracking-wider leading-relaxed pr-16 text-left">
        {task.title}
      </h3>
      
      <div className="bg-amber-50 dark:bg-gray-800 p-10 rounded-3xl shadow-inner mb-8 min-h-[200px] flex items-center justify-center border border-amber-200/50 dark:border-gray-700">
        <p className="text-3xl leading-[2] tracking-widest text-gray-900 dark:text-gray-50 font-medium">
          {chunks[cardIndex].text}
        </p>
      </div>

      <div className="flex justify-between items-center px-2">
        <button 
          disabled={cardIndex === 0}
          onClick={() => setCardIndex(prev => prev - 1)}
          className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-bold text-xl transition-all ${
            cardIndex === 0 
              ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed' 
              : 'text-amber-800 dark:text-amber-200 bg-amber-100/50 dark:bg-amber-900/30 hover:bg-amber-200 hover:-translate-x-1 dark:hover:bg-amber-900/50'
          }`}
        >
          <ArrowLeft size={24} /> Previous
        </button>
        <span className="text-amber-900/40 dark:text-amber-100/40 font-bold tracking-widest text-lg">
          Card {cardIndex + 1} / {chunks.length}
        </span>
        <button 
          disabled={cardIndex === chunks.length - 1}
          onClick={() => setCardIndex(prev => prev + 1)}
          className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-bold text-xl transition-all ${
            cardIndex === chunks.length - 1 
              ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed' 
              : 'text-amber-800 dark:text-amber-200 bg-amber-100/50 dark:bg-amber-900/30 hover:bg-amber-200 hover:translate-x-1 dark:hover:bg-amber-900/50'
          }`}
        >
          Next <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export const DefaultView: React.FC<TaskViewProps> = ({ task, onToggleMain, onToggleSub }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md relative">
      <button onClick={onToggleMain} className="absolute top-6 right-6 text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>
      <h3 className={`text-lg font-bold mb-2 pr-12 ${task.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
        {task.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{task.description}</p>
      
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h4 className="font-medium mb-3 text-sm text-gray-500 uppercase tracking-wider">Steps to complete:</h4>
          <ul className="space-y-2">
            {task.subtasks.map((subtask) => (
              <li 
                key={subtask.id} 
                className="flex items-start gap-3 cursor-pointer hover:bg-white dark:hover:bg-gray-800 p-2 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700" 
                onClick={() => onToggleSub(subtask.id)}
              >
                <div className="mt-0.5 text-primary">
                  {subtask.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </div>
                <span className={`text-sm font-medium ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {subtask.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
