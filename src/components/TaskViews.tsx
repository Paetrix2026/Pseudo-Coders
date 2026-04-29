import React, { useState } from 'react';
import type { Task, Step, RichSubtask } from '../context/TasksContext';
import { useTasksContext } from '../context/TasksContext';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, CheckSquare, Square, ChevronDown, ChevronRight } from 'lucide-react';

interface TaskViewProps {
  task: Task;
}

// ─────────────────────────────────────────────
// SHARED: Microtask row
// ─────────────────────────────────────────────
const MicrotaskRow: React.FC<{
  text: string; completed: boolean; onClick: () => void;
}> = ({ text, completed, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-start gap-3 p-3 rounded-xl ml-6 border transition-all ${
      completed
        ? 'border-primary/20 bg-primary/5 line-through text-gray-400'
        : 'border-transparent bg-white/60 dark:bg-gray-800/60 hover:bg-primary/5 hover:border-primary/20'
    }`}
  >
    <div className={`mt-0.5 shrink-0 ${completed ? 'text-primary' : 'text-gray-400'}`}>
      {completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
    </div>
    <span className="text-sm font-medium">{text}</span>
  </button>
);

// ─────────────────────────────────────────────
// ADHD VIEW — One step at a time, microtasks on first 2 steps
// ─────────────────────────────────────────────
export const ADHDView: React.FC<TaskViewProps> = ({ task }) => {
  const { toggleTask, toggleStep, toggleSubtask, toggleMicrotask } = useTasksContext();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const steps = task.steps || [];
  const totalSteps = steps.length;
  const progress = totalSteps > 0
    ? Math.round((steps.filter(s => s.completed).length / totalSteps) * 100)
    : 0;

  const activeStep: Step | undefined = steps[currentStepIndex];
  const showMicrotasks = currentStepIndex < 2; // First 2 steps get microtasks

  const handleNextStep = () => {
    if (activeStep && !activeStep.completed) {
      toggleStep(task.id, activeStep.id);
    }
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <h3 className="text-xl font-bold leading-tight flex-1 pr-4">{task.title}</h3>
        <button onClick={() => toggleTask(task.id)} className={`shrink-0 transition-transform hover:scale-110 ${task.completed ? 'text-green-500' : 'text-gray-400'}`}>
          {task.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold mb-1.5 text-gray-500">
          <span className="text-primary uppercase tracking-widest">Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-gray-400 mt-1.5 text-right">
          Step {currentStepIndex + 1} of {totalSteps}
        </div>
      </div>

      {/* Active step */}
      {activeStep ? (
        steps.filter(s => s.completed).length === totalSteps ? (
          /* All done */
          <div className="text-center py-8">
            <CheckCircle2 size={56} className="mx-auto text-green-500 mb-4 drop-shadow-sm" />
            <h4 className="text-2xl font-bold mb-6">All steps done! 🎉</h4>
            <button
              onClick={() => toggleTask(task.id)}
              className="w-full py-4 rounded-2xl font-bold text-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:-translate-y-1 transition-all shadow-sm"
            >
              {task.completed ? '✅ Task is Done' : 'Mark Full Task Done'}
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <span className="text-sm font-bold text-primary uppercase tracking-widest mb-3 block">
              {activeStep.completed ? '✓ Done —' : 'Now:'} {activeStep.title}
            </span>

            {/* Subtasks for this step */}
            <div className="space-y-2 text-left mb-6">
              {activeStep.subtasks.map((st: RichSubtask) => (
                <div key={st.id}>
                  <button
                    onClick={() => toggleSubtask(task.id, activeStep.id, st.id)}
                    className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all ${
                      st.completed
                        ? 'border-primary bg-primary/5 line-through text-gray-400'
                        : 'border-transparent bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="mt-0.5 text-primary shrink-0">
                      {st.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </div>
                    <span className="font-medium text-base">{st.text}</span>
                  </button>

                  {/* Microtasks shown for first 2 steps */}
                  {showMicrotasks && st.microtasks.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {st.microtasks.map(m => (
                        <MicrotaskRow
                          key={m.id}
                          text={m.text}
                          completed={m.completed}
                          onClick={() => toggleMicrotask(task.id, activeStep.id, st.id, m.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              Complete & Next Step <ArrowRight size={20} />
            </button>
          </div>
        )
      ) : (
        <p className="text-center text-gray-400 py-8">No steps available.</p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// AUTISM VIEW — Full structured roadmap
// ─────────────────────────────────────────────
export const AutismView: React.FC<TaskViewProps> = ({ task }) => {
  const { toggleTask, toggleStep, toggleSubtask } = useTasksContext();
  const sectionLabels = ['PREPARATION', 'UNDERSTANDING', 'EXECUTION', 'REVIEW', 'COMPLETION'];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden font-mono shadow-sm">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-950 p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <h3 className={`text-lg font-bold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
          {task.title}
        </h3>
        <button onClick={() => toggleTask(task.id)} className="text-primary hover:scale-110 transition-transform">
          {task.completed ? <CheckSquare size={28} /> : <Square size={28} />}
        </button>
      </div>

      <div className="p-6 space-y-8">
        {task.steps.map((step, i) => (
          <div key={step.id}>
            {/* Section bracket header */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-primary tracking-widest">
                [{sectionLabels[i] || step.title.toUpperCase()}]
              </div>
              <button
                onClick={() => toggleStep(task.id, step.id)}
                className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${
                  step.completed
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary/30'
                }`}
              >
                {step.completed ? '✓ Done' : 'Mark Done'}
              </button>
            </div>

            {/* Step title */}
            <p className={`text-base font-semibold mb-3 ${step.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
              {step.title}
            </p>

            {/* Subtasks */}
            <ul className="space-y-2 ml-2">
              {step.subtasks.map((st: RichSubtask) => (
                <li
                  key={st.id}
                  onClick={() => toggleSubtask(task.id, step.id, st.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                    st.completed
                      ? 'text-gray-400 line-through'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className={`shrink-0 ${st.completed ? 'text-primary' : 'text-gray-400'}`}>
                    {st.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </div>
                  <span className="text-sm">{st.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// DYSLEXIA VIEW — Card/slide format
// ─────────────────────────────────────────────
export const DyslexiaView: React.FC<TaskViewProps> = ({ task }) => {
  const { toggleTask, toggleStep, toggleSubtask } = useTasksContext();
  const [cardIndex, setCardIndex] = useState(0);
  const steps = task.steps || [];
  const activeStep: Step | undefined = steps[cardIndex];

  return (
    <div className="bg-[#FFFDF8] dark:bg-gray-900 p-8 rounded-[2rem] shadow-md border-2 border-amber-100 dark:border-gray-800 relative">
      {/* Task complete toggle */}
      <div className="absolute top-8 right-8">
        <button onClick={() => toggleTask(task.id)} className="text-amber-600 dark:text-amber-500 hover:scale-110 transition-transform">
          {task.completed ? <CheckCircle2 size={36} /> : <Circle size={36} />}
        </button>
      </div>

      <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100 tracking-wide leading-relaxed pr-16">
        {task.title}
      </h3>

      {/* Pill indicator */}
      <div className="flex gap-1.5 mb-8 flex-wrap">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === cardIndex ? 'bg-amber-500 w-8' : s.completed ? 'bg-amber-300 w-4' : 'bg-gray-200 dark:bg-gray-700 w-4'
            }`}
          />
        ))}
      </div>

      {/* Active card */}
      {activeStep && (
        <div className="bg-amber-50 dark:bg-gray-800 p-8 rounded-3xl shadow-inner mb-8 border border-amber-200/50 dark:border-gray-700 min-h-[220px]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">{activeStep.title}</h4>
            <button
              onClick={() => toggleStep(task.id, activeStep.id)}
              className={`shrink-0 transition-colors ${activeStep.completed ? 'text-amber-500' : 'text-gray-400 hover:text-amber-400'}`}
            >
              {activeStep.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
            </button>
          </div>

          <ul className="space-y-4">
            {activeStep.subtasks.map((st: RichSubtask) => (
              <li
                key={st.id}
                onClick={() => toggleSubtask(task.id, activeStep.id, st.id)}
                className={`flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all text-xl leading-relaxed tracking-wide ${
                  st.completed
                    ? 'line-through text-amber-400'
                    : 'text-gray-800 dark:text-gray-100 hover:bg-amber-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="mt-1 shrink-0 text-amber-500">
                  {st.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <span>{st.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          disabled={cardIndex === 0}
          onClick={() => setCardIndex(prev => prev - 1)}
          className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-bold text-lg transition-all ${
            cardIndex === 0
              ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
              : 'text-amber-800 dark:text-amber-200 bg-amber-100/50 dark:bg-amber-900/30 hover:bg-amber-200 hover:-translate-x-1'
          }`}
        >
          <ArrowLeft size={22} /> Back
        </button>
        <span className="text-amber-900/50 dark:text-amber-100/40 font-bold tracking-widest">
          {cardIndex + 1} / {steps.length}
        </span>
        <button
          disabled={cardIndex === steps.length - 1}
          onClick={() => setCardIndex(prev => prev + 1)}
          className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-bold text-lg transition-all ${
            cardIndex === steps.length - 1
              ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
              : 'text-amber-800 dark:text-amber-200 bg-amber-100/50 dark:bg-amber-900/30 hover:bg-amber-200 hover:translate-x-1'
          }`}
        >
          Next <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// DEFAULT VIEW — Steps + Subtasks, accordion expand
// ─────────────────────────────────────────────
export const DefaultView: React.FC<TaskViewProps> = ({ task }) => {
  const { toggleTask, toggleStep, toggleSubtask } = useTasksContext();
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set([task.steps?.[0]?.id]));

  const toggleExpand = (stepId: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      next.has(stepId) ? next.delete(stepId) : next.add(stepId);
      return next;
    });
  };

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className={`text-lg font-bold pr-12 ${task.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
          {task.title}
        </h3>
        <button onClick={() => toggleTask(task.id)} className="absolute top-6 right-6 text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
          {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm">{task.description}</p>

      <div className="space-y-3">
        {task.steps.map((step, i) => {
          const isExpanded = expandedSteps.has(step.id);
          return (
            <div key={step.id} className={`rounded-xl border transition-colors ${step.completed ? 'border-primary/20 bg-primary/5' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50'}`}>
              {/* Step row */}
              <div className="flex items-center gap-3 p-3.5">
                <button onClick={() => toggleStep(task.id, step.id)} className={`shrink-0 ${step.completed ? 'text-primary' : 'text-gray-400 hover:text-primary'} transition-colors`}>
                  {step.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <span className={`flex-1 font-semibold text-sm ${step.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                  <span className="text-primary font-bold mr-2">{i + 1}.</span>{step.title}
                </span>
                <button onClick={() => toggleExpand(step.id)} className="text-gray-400 hover:text-primary transition-colors">
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>

              {/* Subtasks (expanded) */}
              {isExpanded && step.subtasks.length > 0 && (
                <div className="px-4 pb-3 space-y-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                  {step.subtasks.map((st: RichSubtask) => (
                    <button
                      key={st.id}
                      onClick={() => toggleSubtask(task.id, step.id, st.id)}
                      className={`w-full text-left flex items-start gap-3 p-2.5 rounded-lg text-sm transition-colors ${
                        st.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className={`mt-0.5 shrink-0 ${st.completed ? 'text-primary' : 'text-gray-400'}`}>
                        {st.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </div>
                      {st.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
