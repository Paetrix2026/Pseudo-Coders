import React, { useState, useRef } from 'react';
import { useTasksContext } from '../context/TasksContext';
import { useAppContext } from '../context/AppProvider';
import { generateFromAI } from '../logic/taskGenerator';
import type { InputType } from '../logic/taskGenerator';
import { Sparkles, Upload, FileText, Image, X, RefreshCw, AlertTriangle } from 'lucide-react';

const ACCEPTED = '.pdf,image/png,image/jpeg,image/jpg,image/webp,image/gif';

type GenerateState = 'idle' | 'loading' | 'done' | 'fallback' | 'error';

export const TaskGenerator: React.FC = () => {
  const { generatedOutput, setGeneratedOutput } = useTasksContext();
  const { mode } = useAppContext();

  const [textInput, setTextInput]     = useState('');
  const [file, setFile]               = useState<File | null>(null);
  const [inputType, setInputType]     = useState<InputType>('text');
  const [genState, setGenState]       = useState<GenerateState>('idle');
  const [errorMsg, setErrorMsg]       = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // ── File pick: clears text ──────────────────
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

  // ── Text change: clears file ────────────────
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    if (file) clearFile();
    setInputType('text');
  };

  // ── Generate ────────────────────────────────
  const handleGenerate = async () => {
    if (!textInput.trim() && !file) return;

    setGenState('loading');
    setErrorMsg('');
    setGeneratedOutput(null);   // clear previous output immediately

    try {
      const output = await generateFromAI(inputType, textInput, file?.name ?? null);
      setGeneratedOutput(output);
      if (output.usedFallback) {
        setGenState('fallback');
        setErrorMsg(output.errorReason || 'Unknown AI error');
      } else {
        setGenState('done');
      }
      setTextInput('');
      clearFile();
      // Auto-dismiss status after 4 s
      setTimeout(() => setGenState('idle'), 4000);
    } catch (err: unknown) {
      setGenState('error');
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      console.error('[ClearMind] generateFromAI error:', msg);
    }
  };

  const isLoading = genState === 'loading';
  const canGenerate = !isLoading && (textInput.trim().length > 0 || file !== null);
  const hasExistingOutput = generatedOutput !== null;

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold leading-tight">AI Task Generator</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Describe an assignment or upload a file — AI will build a structured plan for all modes.
          </p>
        </div>
      </div>

      {/* Text input — hidden when file staged */}
      {!file && (
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Describe your task or assignment
          </label>
          <textarea
            value={textInput}
            onChange={handleTextChange}
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
              <div className="text-xs text-gray-400 uppercase tracking-wide">{inputType}</div>
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
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <span className="text-gray-400 dark:text-gray-500">All 4 modes generated simultaneously</span>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            AI is thinking…
          </>
        ) : hasExistingOutput ? (
          <>
            <RefreshCw size={16} />
            Replace with New AI Output
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generate with AI
          </>
        )}
      </button>

      {/* Loading shimmer */}
      {isLoading && (
        <div className="space-y-2">
          <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary/60 rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]"
                 style={{ width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
          <p className="text-xs text-center text-gray-400 dark:text-gray-500">
            Calling Gemini AI — generating ADHD · Dyslexia · Autism · Standard outputs…
          </p>
        </div>
      )}

      {/* Fallback notice */}
      {genState === 'fallback' && (
        <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>AI unavailable — showing structured template output. ({errorMsg})</span>
        </div>
      )}

      {/* Error notice */}
      {genState === 'error' && (
        <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Replace notice */}
      {hasExistingOutput && canGenerate && genState === 'idle' && (
        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
          <RefreshCw size={12} />
          Generating will replace the current output below.
        </p>
      )}
    </div>
  );
};
