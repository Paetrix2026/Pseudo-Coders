import React, { useState, useRef } from 'react';
import { useTasksContext } from '../context/TasksContext';
import { useAppContext } from '../context/AppProvider';
import { generateTask } from '../logic/taskGenerator';
import type { InputType } from '../logic/taskGenerator';
import { Sparkles, Upload, FileText, Image, X, CheckCircle2 } from 'lucide-react';

const ACCEPTED = '.pdf,image/png,image/jpeg,image/jpg,image/webp,image/gif';

export const TaskGenerator: React.FC = () => {
  const { addTask } = useTasksContext();
  const { mode } = useAppContext();

  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<InputType>('text');
  const [success, setSuccess] = useState(false);
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── File pick ──────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) return;
    setFile(picked);
    setTextInput('');
    const type = picked.type === 'application/pdf' ? 'pdf' : 'image';
    setInputType(type);
  };

  const clearFile = () => {
    setFile(null);
    setInputType('text');
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Generate ───────────────────────────────
  const handleGenerate = () => {
    if (!textInput.trim() && !file) return;

    setGenerating(true);

    // Tiny artificial delay so button feels responsive
    setTimeout(() => {
      const task = generateTask(
        inputType,
        textInput,
        file?.name ?? null,
        mode as any
      );
      addTask(task);
      setSuccess(true);
      setTextInput('');
      clearFile();
      setGenerating(false);

      // Auto-dismiss success message
      setTimeout(() => setSuccess(false), 3500);
    }, 400);
  };

  const canGenerate = !generating && (textInput.trim().length > 0 || file !== null);

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold leading-tight">Generate a Task</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Describe an assignment or upload a file — we'll build a structured plan.
          </p>
        </div>
      </div>

      {/* Text input */}
      {!file && (
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Describe your task or assignment
          </label>
          <textarea
            value={textInput}
            onChange={e => { setTextInput(e.target.value); setInputType('text'); }}
            placeholder='e.g. "Write a 500-word essay on climate change" or "Study for my maths exam"'
            rows={3}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm resize-none"
          />
        </div>
      )}

      {/* Divider */}
      {!file && (
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span>or upload a file</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>
      )}

      {/* File upload area */}
      {file ? (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            {inputType === 'pdf'
              ? <FileText size={20} className="text-primary shrink-0" />
              : <Image size={20} className="text-amber-500 shrink-0" />}
            <div>
              <div className="text-sm font-medium truncate max-w-[200px]">{file.name}</div>
              <div className="text-xs text-gray-400 capitalize">{inputType}</div>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
        >
          <Upload size={18} />
          Upload PDF or Image
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Mode badge */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Adapting for:</span>
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
          {mode === 'None' ? 'Default' : `${mode} Mode`}
        </span>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Sparkles size={16} />
        {generating ? 'Generating…' : 'Generate Task'}
      </button>

      {/* Success feedback */}
      {success && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl px-4 py-3">
          <CheckCircle2 size={18} className="shrink-0" />
          Task generated from your input — it now appears in your task list below.
        </div>
      )}
    </div>
  );
};
