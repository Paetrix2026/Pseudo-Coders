import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import { calculateMode } from '../logic/quizScoring';

const questions = [
  { id: 1, text: "Do you often find it difficult to start or finish long tasks?", trait: "ADHD" as const },
  { id: 2, text: "Do large blocks of text feel overwhelming to read?", trait: "Dyslexia" as const },
  { id: 3, text: "Do you prefer having a very clear, structured environment without distractions?", trait: "Autism" as const },
  { id: 4, text: "Do you benefit from having tasks broken down into small, actionable steps?", trait: "ADHD" as const },
  { id: 5, text: "Does increased spacing and clear bullet points help you read better?", trait: "Dyslexia" as const },
  { id: 6, text: "Do you find comfort in strict routines and predictable UI layouts?", trait: "Autism" as const }
];

export const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const { setMode } = useAppContext();
  const navigate = useNavigate();

  const handleAnswer = (yes: boolean) => {
    const newAnswers = { ...answers, [currentStep]: yes };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const finalMode = calculateMode(questions, newAnswers);
      setMode(finalMode);
      navigate('/');
    }
  };

  const question = questions[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark p-4 transition-colors duration-300">
      <div className="w-full max-w-xl p-10 bg-card-light dark:bg-card-dark rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 text-center">
        <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">
          Question {currentStep + 1} of {questions.length}
        </h2>
        <h1 className="text-2xl md:text-3xl font-semibold mb-10 min-h-[6rem] flex items-center justify-center">
          {question.text}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 py-4 px-6 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5"
          >
            Yes, that's me
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 py-4 px-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5"
          >
            Not really
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-12 flex justify-center gap-2">
          {questions.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 flex-1 max-w-[40px] rounded-full transition-colors duration-300 ${
                i <= currentStep ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
