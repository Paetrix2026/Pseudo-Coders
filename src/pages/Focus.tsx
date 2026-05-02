import React, { useState } from 'react';
import { useTimerContext } from '../context/TimerProvider';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const Focus: React.FC = () => {
  const { timeLeft, isRunning, startTimer, pauseTimer, resetTimer, duration, setDuration } = useTimerContext();
  const [customMinutes, setCustomMinutes] = useState<number | ''>(25);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCustomSet = () => {
    const mins = Number(customMinutes);
    if (mins > 0) {
      setDuration(mins);
    }
  };

  const radius = 184;
  const circumference = 2 * Math.PI * radius;
  const percentage = duration > 0 ? (timeLeft / (duration * 60)) : 0;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative z-40">
      <div className={`text-center mb-12 transition-opacity duration-700 z-10 ${isRunning ? 'opacity-30' : 'opacity-100'}`}>
        <h1 className="text-4xl font-bold mb-4 text-primary">Focus Mode</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Stay concentrated on your task.</p>
      </div>

      <div className={`bg-card-light dark:bg-card-dark rounded-full flex items-center justify-center flex-col relative transition-all duration-700 ease-out mb-12 w-96 h-96 ${isRunning ? 'z-50 scale-105 shadow-[0_0_100px_rgba(107,175,146,0.3)] bg-white dark:bg-gray-800' : 'z-10 scale-100 shadow-[0_0_50px_rgba(107,175,146,0.1)]'}`}>

        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 384 384">
          <circle
            cx="192"
            cy="192"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-700 transition-colors duration-700"
          />
          <circle
            cx="192"
            cy="192"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-linear"
          />
        </svg>

        <div className="text-7xl font-bold font-mono tracking-wider mb-8 text-primary drop-shadow-sm z-10">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex gap-4 relative z-10">
          {isRunning ? (
            <button
              onClick={pauseTimer}
              className="p-5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <Pause size={32} />
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="p-5 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-md shadow-primary/30 hover:-translate-y-0.5"
            >
              <Play size={32} className="ml-1" />
            </button>
          )}

          <button
            onClick={resetTimer}
            className="p-5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 shadow-sm"
          >
            <RotateCcw size={32} />
          </button>
        </div>
      </div>

      <div className={`flex flex-wrap items-center justify-center gap-4 bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-700 ${isRunning ? 'z-50 opacity-90' : 'z-10 opacity-100'}`}>
        <span className="font-medium text-gray-600 dark:text-gray-400 px-2">Duration:</span>
        {[15, 25, 50].map((min) => (
          <button
            key={min}
            onClick={() => {
              setDuration(min);
              setCustomMinutes(min);
            }}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${duration === min
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {min} min
          </button>
        ))}

        <div className="flex items-center gap-2 ml-2 pl-4 border-l border-gray-200 dark:border-gray-700">
          <input
            type="number"
            min="1"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
            className="w-20 px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-center font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white"
            aria-label="Custom duration in minutes"
          />
          <button
            onClick={handleCustomSet}
            className="px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-medium transition-colors"
          >
            Set Time
          </button>
        </div>
      </div>
    </div>
  );
};
