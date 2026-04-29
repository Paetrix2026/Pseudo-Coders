// ─────────────────────────────────────────────
// Question Bank (15 questions)
// ─────────────────────────────────────────────

export type Mode = 'ADHD' | 'Autism' | 'Dyslexia' | 'None';

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  scores: {
    ADHD: number;
    Autism: number;
    Dyslexia: number;
  };
}

export const questionBank: QuizQuestion[] = [
  {
    id: 1,
    text: "How often do you find it hard to start a task even when you want to?",
    options: ["Almost always", "Often", "Sometimes", "Rarely"],
    scores: { ADHD: 3, Autism: 1, Dyslexia: 0 },
  },
  {
    id: 2,
    text: "Do large blocks of text feel overwhelming or hard to follow?",
    options: ["Almost always", "Often", "Sometimes", "Rarely"],
    scores: { ADHD: 0, Autism: 0, Dyslexia: 3 },
  },
  {
    id: 3,
    text: "Do you prefer following a strict, predictable routine each day?",
    options: ["Strongly agree", "Agree", "Neutral", "Disagree"],
    scores: { ADHD: 0, Autism: 3, Dyslexia: 0 },
  },
  {
    id: 4,
    text: "Do you often lose track of time while working on something?",
    options: ["Almost always", "Often", "Sometimes", "Rarely"],
    scores: { ADHD: 3, Autism: 0, Dyslexia: 0 },
  },
  {
    id: 5,
    text: "Does wider spacing between lines or bigger fonts help you read?",
    options: ["Yes, a lot", "Yes, somewhat", "Neutral", "Not really"],
    scores: { ADHD: 0, Autism: 0, Dyslexia: 3 },
  },
  {
    id: 6,
    text: "Do sudden changes in plans cause you significant stress?",
    options: ["Almost always", "Often", "Sometimes", "Rarely"],
    scores: { ADHD: 0, Autism: 3, Dyslexia: 0 },
  },
  {
    id: 7,
    text: "Do you find it easier to focus when tasks are broken into very small steps?",
    options: ["Strongly agree", "Agree", "Neutral", "Disagree"],
    scores: { ADHD: 3, Autism: 1, Dyslexia: 1 },
  },
  {
    id: 8,
    text: "Do you sometimes mix up similar-looking letters or words (e.g. b/d, was/saw)?",
    options: ["Often", "Sometimes", "Rarely", "Never"],
    scores: { ADHD: 0, Autism: 0, Dyslexia: 3 },
  },
  {
    id: 9,
    text: "Do you feel more comfortable when you know exactly what to expect in an activity?",
    options: ["Strongly agree", "Agree", "Neutral", "Disagree"],
    scores: { ADHD: 0, Autism: 3, Dyslexia: 0 },
  },
  {
    id: 10,
    text: "Do you tend to jump between tasks frequently instead of finishing one first?",
    options: ["Almost always", "Often", "Sometimes", "Rarely"],
    scores: { ADHD: 3, Autism: 0, Dyslexia: 0 },
  },
  {
    id: 11,
    text: "Does reading aloud help you understand text better than reading silently?",
    options: ["Yes, much better", "Somewhat", "No difference", "Prefer silent reading"],
    scores: { ADHD: 0, Autism: 0, Dyslexia: 3 },
  },
  {
    id: 12,
    text: "Do bright or flickering lights and loud sounds distract or bother you?",
    options: ["A lot", "Somewhat", "A little", "Not at all"],
    scores: { ADHD: 1, Autism: 3, Dyslexia: 0 },
  },
  {
    id: 13,
    text: "Do you find it hard to keep track of multiple instructions given at once?",
    options: ["Almost always", "Often", "Sometimes", "Rarely"],
    scores: { ADHD: 2, Autism: 1, Dyslexia: 2 },
  },
  {
    id: 14,
    text: "Do you notice patterns, details, or rules that others tend to miss?",
    options: ["Almost always", "Often", "Sometimes", "Rarely"],
    scores: { ADHD: 0, Autism: 3, Dyslexia: 0 },
  },
  {
    id: 15,
    text: "Do you need to re-read a sentence several times before it makes sense?",
    options: ["Almost always", "Often", "Sometimes", "Rarely"],
    scores: { ADHD: 1, Autism: 0, Dyslexia: 3 },
  },
];

// ─────────────────────────────────────────────
// Randomly select N unique questions, stable per session
// ─────────────────────────────────────────────
export function selectQuestions(count: number = 10): QuizQuestion[] {
  const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ─────────────────────────────────────────────
// Score weights per option index (0 = most, 3 = least)
// ─────────────────────────────────────────────
const OPTION_WEIGHTS = [1.0, 0.67, 0.33, 0.0];

export interface QuizScores {
  ADHD: number;
  Autism: number;
  Dyslexia: number;
}

export interface QuizResult {
  scores: QuizScores;
  percentages: { ADHD: number; Autism: number; Dyslexia: number };
  dominantMode: Mode;
}

export function calculateQuizResult(
  questions: QuizQuestion[],
  answers: Record<number, number> // questionId → optionIndex
): QuizResult {
  const raw: QuizScores = { ADHD: 0, Autism: 0, Dyslexia: 0 };

  questions.forEach((q) => {
    const optionIndex = answers[q.id];
    if (optionIndex === undefined) return;
    const weight = OPTION_WEIGHTS[optionIndex] ?? 0;
    raw.ADHD += q.scores.ADHD * weight;
    raw.Autism += q.scores.Autism * weight;
    raw.Dyslexia += q.scores.Dyslexia * weight;
  });

  const total = raw.ADHD + raw.Autism + raw.Dyslexia;

  const percentages = {
    ADHD: total > 0 ? Math.round((raw.ADHD / total) * 100) : 0,
    Autism: total > 0 ? Math.round((raw.Autism / total) * 100) : 0,
    Dyslexia: total > 0 ? Math.round((raw.Dyslexia / total) * 100) : 0,
  };

  // Dominant mode: highest percentage
  const dominantMode: Mode =
    percentages.ADHD >= percentages.Autism && percentages.ADHD >= percentages.Dyslexia
      ? 'ADHD'
      : percentages.Autism >= percentages.Dyslexia
      ? 'Autism'
      : 'Dyslexia';

  return { scores: raw, percentages, dominantMode };
}
