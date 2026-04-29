import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAppContext } from './AppProvider';
import { getTimerState, saveTimerState } from '../services/assessmentService';

interface TimerContextType {
  timeLeft: number; // in seconds
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setDuration: (minutes: number) => void;
  duration: number; // default duration in minutes
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  
  const [duration, setDurationState] = useState<number>(25); // default 25 minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Load timer state via service on user change
  useEffect(() => {
    if (user?.email) {
      getTimerState(user.email).then(saved => {
        if (saved) {
          setDurationState(saved.duration || 25);
          setTimeLeft(saved.timeLeft !== undefined ? saved.timeLeft : 25 * 60);
        } else {
          setDurationState(25);
          setTimeLeft(25 * 60);
        }
      }).catch(() => {
        setDurationState(25);
        setTimeLeft(25 * 60);
      });
    } else {
      setDurationState(25);
      setTimeLeft(25 * 60);
      setIsRunning(false);
    }
  }, [user?.email]);

  // Persist timer state via service
  useEffect(() => {
    if (user?.email) {
      saveTimerState(user.email, { duration, timeLeft });
    }
  }, [duration, timeLeft, user?.email]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };
  const setDuration = (minutes: number) => {
    setDurationState(minutes);
    setIsRunning(false);
    setTimeLeft(minutes * 60);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  return (
    <TimerContext.Provider value={{ timeLeft, isRunning, startTimer, pauseTimer, resetTimer, setDuration, duration }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};
