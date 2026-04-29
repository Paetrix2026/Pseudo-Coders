import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import { selectQuestions, calculateQuizResult } from '../logic/quizScoring';
import type { QuizQuestion, QuizResult } from '../logic/quizScoring';
import { saveAssessment } from '../services/assessmentService';
import { auth } from '../firebase/config';
import { Brain, ArrowRight, Info } from 'lucide-react';

// ─────────────────────────────────────────────
// Result Screen Component
// ─────────────────────────────────────────────
const ResultScreen: React.FC<{
  result: QuizResult;
  onContinue: () => void;
}> = ({ result, onContinue }) => {
  const { percentages, dominantMode, secondaryMode } = result;
  const modeColors: Record<string, string> = {
    ADHD: 'bg-blue-500',
    Autism: 'bg-purple-500',
    Dyslexia: 'bg-amber-500',
  };
  const modeDescriptions: Record<string, string> = {
    ADHD: 'ADHD-style thinking',
    Autism: 'Structured / Autism-style thinking',
    Dyslexia: 'Dyslexia-style thinking',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark p-4 transition-colors duration-300">
      <div className="w-full max-w-xl p-10 bg-card-light dark:bg-card-dark rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 text-center space-y-8">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Brain size={32} className="text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">Your Thinking Profile</h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            You most closely relate to:{' '}
            <span className="font-bold text-primary">
              {modeDescriptions[dominantMode] ?? dominantMode}
            </span>
          </p>
          {secondaryMode && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Secondary tendency:{' '}
              <span className="font-semibold">{modeDescriptions[secondaryMode] ?? secondaryMode}</span>
            </p>
          )}
        </div>

        {/* Score bars */}
        <div className="space-y-4 text-left">
          {(['ADHD', 'Autism', 'Dyslexia'] as const).map((trait) => (
            <div key={trait}>
              <div className="flex justify-between text-sm font-semibold mb-1.5">
                <span className={trait === dominantMode ? 'text-primary font-bold' : 'text-gray-700 dark:text-gray-300'}>
                  {trait} {trait === dominantMode && '★'}{trait === secondaryMode && ' ·'}
                </span>
                <span>{percentages[trait]}%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${modeColors[trait]}`}
                  style={{ width: `${percentages[trait]}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dominant mode badge */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ClearMind will adapt for</p>
          <p className="text-xl font-bold text-primary">{dominantMode} Mode</p>
          {secondaryMode && (
            <p className="text-xs text-gray-500 mt-1">
              with some {secondaryMode} considerations
            </p>
          )}
        </div>

        {/* Disclaimer + Reassurance */}
        <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-5 text-left space-y-3">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-600 dark:text-gray-300">Not a clinical diagnosis.</span>{' '}
              This is based on your responses to help personalise your experience on ClearMind.
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-6">
            Everyone processes information differently. ClearMind adapts to your style to make tasks easier, clearer, and less overwhelming.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onContinue}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-0.5"
        >
          Continue to Dashboard <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Onboarding Page
// ─────────────────────────────────────────────
export const Onboarding: React.FC = () => {
  const { setMode, user } = useAppContext();
  const navigate = useNavigate();

  // Balanced category selection — stable per session via useMemo
  const questions: QuizQuestion[] = useMemo(() => selectQuestions(), []);

  const [currentStep, setCurrentStep] = useState(0);
  // answers: questionId → chosen option index
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const currentQuestion = questions[currentStep];
  const totalQuestions = questions.length;

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: optionIndex };
    setAnswers(newAnswers);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Quiz done — calculate result
      const quizResult = calculateQuizResult(questions, newAnswers);
      setResult(quizResult);
    }
  };

  const handleContinue = () => {
    if (!result) return;
    
    if (auth.currentUser) {
      localStorage.setItem(`onboarding_${auth.currentUser.uid}`, 'true');
      localStorage.setItem(`mode_${auth.currentUser.uid}`, result.dominantMode);
    }
    
    if (user?.email) {
      saveAssessment(user.email, {
        mode: result.dominantMode,
        secondaryMode: result.secondaryMode,
      });
    }

    setMode(result.dominantMode);
    navigate('/dashboard', { replace: true });
  };

  // Show result screen after all questions answered
  if (result) {
    return <ResultScreen result={result} onContinue={handleContinue} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark p-4 transition-colors duration-300">
      <div className="w-full max-w-xl p-10 bg-card-light dark:bg-card-dark rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 text-center">

        {/* Progress label */}
        <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">
          Question {currentStep + 1} of {totalQuestions}
        </h2>

        {/* Question text */}
        <h1 className="text-2xl md:text-3xl font-semibold mb-10 min-h-[6rem] flex items-center justify-center leading-snug">
          {currentQuestion.text}
        </h1>

        {/* Option buttons */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionSelect(i)}
              className="w-full py-4 px-6 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl font-semibold text-lg border-2 border-transparent hover:border-primary hover:bg-primary/5 transition-all text-left"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Progress dots */}
        <div className="mt-10 flex justify-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 max-w-[36px] rounded-full transition-colors duration-300 ${
                i < currentStep
                  ? 'bg-primary'
                  : i === currentStep
                  ? 'bg-primary/50'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
