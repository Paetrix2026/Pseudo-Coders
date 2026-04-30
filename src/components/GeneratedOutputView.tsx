import React, { useState, useEffect } from 'react';
import { useTasksContext } from '../context/TasksContext';
import { useAppContext } from '../context/AppProvider';
import type { AccessibilityMode } from '../logic/taskGenerator';
import { ADHDView, AutismView, DyslexiaView, DefaultView } from './TaskViews';
import { FileText, Image, AlignLeft, Brain, Eye, Layers, Sparkles, X, RefreshCw } from 'lucide-react';

// ─────────────────────────────────────────────
// Mode tab configuration
// ─────────────────────────────────────────────

interface ModeTab {
  key: AccessibilityMode;
  label: string;
  icon: React.ReactNode;
  colour: string;       // Tailwind border/text accent
  bg: string;           // Active tab background
}

const TABS: ModeTab[] = [
  {
    key: 'ADHD',
    label: 'ADHD',
    icon: <Brain size={15} />,
    colour: 'text-primary border-primary',
    bg: 'bg-primary/10',
  },
  {
    key: 'Dyslexia',
    label: 'Dyslexia',
    icon: <Eye size={15} />,
    colour: 'text-amber-600 border-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    key: 'Autism',
    label: 'Autism',
    icon: <Layers size={15} />,
    colour: 'text-emerald-600 border-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    key: 'None',
    label: 'Standard',
    icon: <AlignLeft size={15} />,
    colour: 'text-gray-600 border-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
  },
];

// ─────────────────────────────────────────────
// Input type badge
// ─────────────────────────────────────────────

const INPUT_BADGE: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
  pdf: {
    icon: <FileText size={13} />,
    label: 'PDF',
    cls: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  },
  image: {
    icon: <Image size={13} />,
    label: 'Image',
    cls: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  },
  text: {
    icon: <AlignLeft size={13} />,
    label: 'Text',
    cls: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
  },
};

// ─────────────────────────────────────────────
// GeneratedOutputView
// ─────────────────────────────────────────────

export const GeneratedOutputView: React.FC = () => {
  const { generatedOutput, setGeneratedOutput } = useTasksContext();
  const { mode } = useAppContext();

  // Default active tab = user's current accessibility mode
  const defaultTab: AccessibilityMode = mode === 'None' ? 'None' : mode;
  const [activeTab, setActiveTab] = useState<AccessibilityMode>(defaultTab);
  const [isNew, setIsNew] = useState(false);     // brief "replaced" flash

  // When a new output arrives, flash "replaced" banner & snap to user's mode tab
  useEffect(() => {
    if (generatedOutput) {
      setActiveTab(mode === 'None' ? 'None' : mode);
      setIsNew(true);
      const t = setTimeout(() => setIsNew(false), 2200);
      return () => clearTimeout(t);
    }
  }, [generatedOutput?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!generatedOutput) return null;

  // Pick the correct Task for the active tab
  const taskMap: Record<AccessibilityMode, typeof generatedOutput.adhd> = {
    ADHD:     generatedOutput.adhd,
    Dyslexia: generatedOutput.dyslexia,
    Autism:   generatedOutput.autism,
    None:     generatedOutput.standard,
  };
  const activeTask = taskMap[activeTab];

  const badge = INPUT_BADGE[generatedOutput.inputType];
  const ts = new Date(generatedOutput.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <section aria-label="Generated Task Output" className="space-y-4">

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Generated Output</h2>

          {/* Input type badge */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${badge.cls}`}>
            {badge.icon}
            {badge.label}
          </span>

          {/* File name */}
          {generatedOutput.fileName && (
            <span className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[160px]" title={generatedOutput.fileName}>
              {generatedOutput.fileName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Timestamp */}
          <span className="text-xs text-gray-400 dark:text-gray-500">Generated {ts}</span>

          {/* Dismiss */}
          <button
            onClick={() => setGeneratedOutput(null)}
            title="Dismiss output"
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── "Replaced" flash banner ── */}
      {isNew && (
        <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 animate-pulse">
          <RefreshCw size={13} />
          Previous output replaced — showing new result below.
        </div>
      )}

      {/* ── Mode tab switcher ── */}
      <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 w-fit flex-wrap">
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                transition-all duration-200
                ${isActive
                  ? `${tab.colour} ${tab.bg} border shadow-sm`
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-700 border border-transparent'
                }
              `}
            >
              {tab.icon}
              {tab.label} Mode
            </button>
          );
        })}
      </div>

      {/* ── Single task view — ONE output, determined by active tab ── */}
      <div key={`${generatedOutput.id}-${activeTab}`}>
        {activeTab === 'ADHD'     && <ADHDView     task={activeTask} />}
        {activeTab === 'Dyslexia' && <DyslexiaView task={activeTask} />}
        {activeTab === 'Autism'   && <AutismView   task={activeTask} />}
        {activeTab === 'None'     && <DefaultView  task={activeTask} />}
      </div>
    </section>
  );
};
