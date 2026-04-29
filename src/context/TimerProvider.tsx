import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAppContext } from './AppProvider';

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

  useEffect(() => {
    if (user?.email) {
      const savedStr = localStorage.getItem(`timer_${user.email}`);
      if (savedStr) {
        try {
          const parsed = JSON.parse(savedStr);
          setDurationState(parsed.duration || 25);
          setTimeLeft(parsed.timeLeft !== undefined ? parsed.timeLeft : 25 * 60);
        } catch (e) {
          setDurationState(25);
          setTimeLeft(25 * 60);
        }
      } else {
        setDurationState(25);
        setTimeLeft(25 * 60);
      }
    } else {
      setDurationState(25);
      setTimeLeft(25 * 60);
      setIsRunning(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`timer_${user.email}`, JSON.stringify({ duration, timeLeft }));
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
