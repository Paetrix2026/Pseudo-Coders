type Trait = 'ADHD' | 'Dyslexia' | 'Autism';

export const calculateMode = (
  questions: { id: number; text: string; trait: Trait }[],
  answers: Record<number, boolean>
): 'ADHD' | 'Dyslexia' | 'Autism' | 'None' => {
  const scores = { ADHD: 0, Dyslexia: 0, Autism: 0, None: 0 };
  
  questions.forEach((q, index) => {
    if (answers[index]) {
      scores[q.trait]++;
    }
  });
  
  let maxScore = 0;
  let finalMode: 'ADHD' | 'Dyslexia' | 'Autism' | 'None' = 'None';
  
  Object.entries(scores).forEach(([trait, score]) => {
    if (score > maxScore) {
      maxScore = score as number;
      finalMode = trait as any;
    }
  });

  return finalMode;
};
