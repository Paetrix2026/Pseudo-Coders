import React from 'react';
import { useTimerContext } from '../context/TimerProvider';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const Focus: React.FC = () => {
  const { timeLeft, isRunning, startTimer, pauseTimer, resetTimer, duration, setDuration } = useTimerContext();
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">Focus Mode</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Stay concentrated on your task.</p>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-12 rounded-full shadow-[0_0_50px_rgba(107,175,146,0.1)] border-4 border-primary/20 dark:border-primary/10 mb-12 w-96 h-96 flex items-center justify-center flex-col relative transition-all">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-[spin_60s_linear_infinite]" style={{ animationPlayState: isRunning ? 'running' : 'paused' }} />
        
        <div className="text-7xl font-bold font-mono tracking-wider mb-8 text-primary drop-shadow-sm">
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

      <div className="flex items-center gap-4 bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <span className="font-medium text-gray-600 dark:text-gray-400 px-2">Duration:</span>
        {[15, 25, 50].map((min) => (
          <button
            key={min}
            onClick={() => setDuration(min)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              duration === min
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {min} min
          </button>
        ))}
      </div>
    </div>
  );
};
