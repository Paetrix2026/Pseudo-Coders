// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type Mode = 'ADHD' | 'Autism' | 'Dyslexia' | 'None';
export type Category = 'ADHD' | 'Dyslexia' | 'Autism' | 'General';

export interface QuizQuestion {
  id: number;
  category: Category;
  text: string;
  // Options are always: Never / Sometimes / Often / Almost always → scores 0–3
  options: [string, string, string, string];
  // Which trait(s) this question scores for
  traits: { ADHD: number; Autism: number; Dyslexia: number };
}

export interface QuizScores {
  ADHD: number;
  Autism: number;
  Dyslexia: number;
}

export interface QuizResult {
  scores: QuizScores;
  percentages: { ADHD: number; Autism: number; Dyslexia: number };
  dominantMode: Mode;
  secondaryMode: Mode | null; // set when runner-up is within 3 points
}

// ─────────────────────────────────────────────
// 25-Question Bank
// ─────────────────────────────────────────────

const STANDARD_OPTIONS: [string, string, string, string] = [
  'Never',
  'Sometimes',
  'Often',
  'Almost always',
];

export const questionBank: QuizQuestion[] = [
  // ── ADHD (Q1–Q8) ──────────────────────────
  {
    id: 1,
    category: 'ADHD',
    text: 'I find it hard to start a task even when I genuinely want to get it done.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 3, Autism: 0, Dyslexia: 0 },
  },
  {
    id: 2,
    category: 'ADHD',
    text: 'I lose track of time and suddenly realise hours have passed.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 3, Autism: 0, Dyslexia: 0 },
  },
  {
    id: 3,
    category: 'ADHD',
    text: 'I jump from one unfinished task to another instead of completing one at a time.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 3, Autism: 0, Dyslexia: 0 },
  },
  {
    id: 4,
    category: 'ADHD',
    text: 'I feel restless or find it difficult to sit still for long periods.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 3, Autism: 1, Dyslexia: 0 },
  },
  {
    id: 5,
    category: 'ADHD',
    text: 'I forget important things even when I told myself to remember them.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 3, Autism: 0, Dyslexia: 0 },
  },
  {
    id: 6,
    category: 'ADHD',
    text: 'Breaking a big task into tiny steps makes it much easier for me to actually begin.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 3, Autism: 1, Dyslexia: 1 },
  },
  {
    id: 7,
    category: 'ADHD',
    text: 'I get distracted by background noises or movement that others seem to ignore.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 3, Autism: 1, Dyslexia: 0 },
  },
  {
    id: 8,
    category: 'ADHD',
    text: 'I have difficulty following through on instructions that have multiple steps.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 3, Autism: 0, Dyslexia: 1 },
  },

  // ── Dyslexia (Q9–Q16) ─────────────────────
  {
    id: 9,
    category: 'Dyslexia',
    text: 'Large blocks of text feel overwhelming and hard to get through.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 0, Autism: 0, Dyslexia: 3 },
  },
  {
    id: 10,
    category: 'Dyslexia',
    text: 'I mix up similar-looking letters or words (e.g. b/d, p/q, was/saw).',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 0, Autism: 0, Dyslexia: 3 },
  },
  {
    id: 11,
    category: 'Dyslexia',
    text: 'I need to re-read the same sentence multiple times before it makes sense.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 1, Autism: 0, Dyslexia: 3 },
  },
  {
    id: 12,
    category: 'Dyslexia',
    text: 'Reading aloud helps me understand written text better than reading silently.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 0, Autism: 0, Dyslexia: 3 },
  },
  {
    id: 13,
    category: 'Dyslexia',
    text: 'Wider line spacing, larger fonts, or coloured overlays make reading easier for me.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 0, Autism: 0, Dyslexia: 3 },
  },
  {
    id: 14,
    category: 'Dyslexia',
    text: 'I find spelling difficult even for words I have seen many times.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 0, Autism: 0, Dyslexia: 3 },
  },
  {
    id: 15,
    category: 'Dyslexia',
    text: 'I have trouble following written instructions but do fine with verbal ones.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 1, Autism: 0, Dyslexia: 3 },
  },
  {
    id: 16,
    category: 'Dyslexia',
    text: 'I skip over or jumble words when reading quickly.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 0, Autism: 0, Dyslexia: 3 },
  },

  // ── Autism (Q17–Q23) ──────────────────────
  {
    id: 17,
    category: 'Autism',
    text: 'Unexpected changes to my routine cause me real stress or anxiety.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 0, Autism: 3, Dyslexia: 0 },
  },
  {
    id: 18,
    category: 'Autism',
    text: 'I strongly prefer knowing exactly what will happen before I begin an activity.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 0, Autism: 3, Dyslexia: 0 },
  },
  {
    id: 19,
    category: 'Autism',
    text: 'Bright lights, loud sounds, or strong smells are very uncomfortable for me.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 1, Autism: 3, Dyslexia: 0 },
  },
  {
    id: 20,
    category: 'Autism',
    text: 'I notice patterns, details, or inconsistencies that others tend to overlook.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 0, Autism: 3, Dyslexia: 0 },
  },
  {
    id: 21,
    category: 'Autism',
    text: 'I find unstructured social situations draining or hard to navigate.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 0, Autism: 3, Dyslexia: 0 },
  },
  {
    id: 22,
    category: 'Autism',
    text: 'I have specific routines or rituals that I follow every day and dislike breaking them.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 0, Autism: 3, Dyslexia: 0 },
  },
  {
    id: 23,
    category: 'Autism',
    text: 'When I am deeply interested in a topic, I find it hard to shift my attention to anything else.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 1, Autism: 3, Dyslexia: 0 },
  },

  // ── General (Q24–Q25) ─────────────────────
  {
    id: 24,
    category: 'General',
    text: 'I need tasks explained visually (diagrams, examples) rather than in written paragraphs.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 1, Autism: 1, Dyslexia: 2 },
  },
  {
    id: 25,
    category: 'General',
    text: 'I feel more productive when my environment is calm, well-organised, and clutter-free.',
    options: STANDARD_OPTIONS,
    traits: { ADHD: 2, Autism: 2, Dyslexia: 1 },
  },
];

// ─────────────────────────────────────────────
// Balanced Category Selector
// Picks 3 ADHD + 3 Dyslexia + 3 Autism + 1 General = 10 total
// Randomises within each category, then shuffles the final list
// ─────────────────────────────────────────────
function pickFromCategory(category: Category, count: number): QuizQuestion[] {
  const pool = questionBank.filter((q) => q.category === category);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function selectQuestions(): QuizQuestion[] {
  const selected = [
    ...pickFromCategory('ADHD', 3),
    ...pickFromCategory('Dyslexia', 3),
    ...pickFromCategory('Autism', 3),
    ...pickFromCategory('General', 1),
  ];
  // Final shuffle so categories don't appear in blocks
  return selected.sort(() => Math.random() - 0.5);
}

// ─────────────────────────────────────────────
// Scoring
// Option index 0-3 → raw points 0-3 (Never=0 … Almost always=3)
// ─────────────────────────────────────────────
export function calculateQuizResult(
  questions: QuizQuestion[],
  answers: Record<number, number> // questionId → optionIndex (0-3)
): QuizResult {
  const raw: QuizScores = { ADHD: 0, Autism: 0, Dyslexia: 0 };

  questions.forEach((q) => {
    const optionIndex = answers[q.id];
    if (optionIndex === undefined) return;
    // optionIndex maps directly to 0–3 points
    raw.ADHD     += q.traits.ADHD     * optionIndex;
    raw.Autism   += q.traits.Autism   * optionIndex;
    raw.Dyslexia += q.traits.Dyslexia * optionIndex;
  });

  // ── Dominant / Secondary detection ──────────
  const sorted = (
    [['ADHD', raw.ADHD], ['Autism', raw.Autism], ['Dyslexia', raw.Dyslexia]] as [Mode, number][]
  ).sort((a, b) => b[1] - a[1]);

  const [topMode, topScore] = sorted[0];
  const [secondMode, secondScore] = sorted[1];

  const dominantMode: Mode = topScore > 0 ? topMode : 'None';

  // Secondary mode: runner-up within 3 points of top
  const secondaryMode: Mode | null =
    topScore > 0 && secondScore > 0 && topScore - secondScore <= 3
      ? secondMode
      : null;

  // ── Percentages (display only) ────────────
  // We nudge the dominant mode to ensure it never shows as equal thirds
  let adhdPct  = 0;
  let autismPct = 0;
  let dyslexiaPct = 0;

  const total = raw.ADHD + raw.Autism + raw.Dyslexia;

  if (total > 0) {
    // Raw proportional
    adhdPct     = Math.round((raw.ADHD / total) * 100);
    autismPct   = Math.round((raw.Autism / total) * 100);
    dyslexiaPct = Math.round((raw.Dyslexia / total) * 100);

    // Normalise rounding drift back to 100
    const drift = 100 - (adhdPct + autismPct + dyslexiaPct);
    if (dominantMode === 'ADHD')     adhdPct     += drift;
    else if (dominantMode === 'Autism') autismPct += drift;
    else                             dyslexiaPct += drift;

    // If dominant share looks like a tie (within 2%), nudge dominant +3%
    const dominant = dominantMode === 'ADHD' ? adhdPct : dominantMode === 'Autism' ? autismPct : dyslexiaPct;
    const runnerUp = secondaryMode === 'ADHD' ? adhdPct : secondaryMode === 'Autism' ? autismPct : dyslexiaPct;
    if (secondaryMode && Math.abs(dominant - runnerUp) <= 2) {
      const boost = 3;
      if (dominantMode === 'ADHD')        { adhdPct += boost;     adhdPct     = Math.min(adhdPct, 99); }
      else if (dominantMode === 'Autism') { autismPct += boost;   autismPct   = Math.min(autismPct, 99); }
      else                                { dyslexiaPct += boost; dyslexiaPct = Math.min(dyslexiaPct, 99); }
    }
  }

  const percentages = { ADHD: adhdPct, Autism: autismPct, Dyslexia: dyslexiaPct };

  return { scores: raw, percentages, dominantMode, secondaryMode };
}
