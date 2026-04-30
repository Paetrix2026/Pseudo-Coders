import type { Task, Step, RichSubtask, Microtask } from '../context/TasksContext';
import { callGeminiBreakdown } from '../services/aiService';
import type { AIBreakdown } from '../services/aiService';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type InputType = 'text' | 'pdf' | 'image';
export type AccessibilityMode = 'ADHD' | 'Autism' | 'Dyslexia' | 'None';

/**
 * A single processed output holding all 4 mode variants.
 * Generated once per input — NEVER accumulated or appended.
 */
export interface ProcessedOutput {
  id: string;
  inputType: InputType;
  fileName: string | null;
  adhd: Task;
  dyslexia: Task;
  autism: Task;
  standard: Task;
  generatedAt: number;
  usedFallback?: boolean;
  errorReason?: string;
}

interface TemplateStep {
  title: string;
  subtasks: string[];
}

interface TaskTemplate {
  title: string;
  description: string;
  steps: TemplateStep[];
  sections: { heading: string; content: string }[];
}

// ─────────────────────────────────────────────
// Text keyword → template matching
// ─────────────────────────────────────────────

const TEXT_TEMPLATES: { keywords: string[]; template: TaskTemplate }[] = [
  {
    keywords: ['essay', 'write', 'writing', 'paragraph', 'article', 'blog', 'report'],
    template: {
      title: 'Essay / Writing Task',
      description: 'Plan, research, draft, and polish your written assignment.',
      sections: [
        { heading: 'Preparation', content: 'Understand the prompt and gather sources.' },
        { heading: 'Understanding', content: 'Identify the key argument or theme to explore.' },
        { heading: 'Execution', content: 'Write without stopping to edit — get it on paper first.' },
        { heading: 'Review', content: 'Read through once for clarity and flow.' },
        { heading: 'Completion', content: 'Fix grammar, format correctly, and submit.' },
      ],
      steps: [
        { title: 'Understand the topic', subtasks: ['Read the prompt carefully', 'Highlight key words', 'Note what is required'] },
        { title: 'Research and collect sources', subtasks: ['Find 2–3 relevant sources', 'Take brief notes'] },
        { title: 'Create an outline', subtasks: ['Write intro idea', 'List 3 body points', 'Note conclusion'] },
        { title: 'Write the draft', subtasks: ['Write introduction', 'Write body paragraphs', 'Write conclusion'] },
        { title: 'Edit and finalise', subtasks: ['Check spelling and grammar', 'Format correctly', 'Submit'] },
      ],
    },
  },
  {
    keywords: ['code', 'program', 'function', 'algorithm', 'script', 'build', 'develop', 'app', 'website'],
    template: {
      title: 'Coding Task',
      description: 'Plan, implement, test, and document your coding assignment.',
      sections: [
        { heading: 'Preparation', content: 'Read requirements and clarify scope.' },
        { heading: 'Understanding', content: 'Plan your approach before writing any code.' },
        { heading: 'Execution', content: 'Build function by function, testing as you go.' },
        { heading: 'Review', content: 'Test edge cases and clean up the code.' },
        { heading: 'Completion', content: 'Add comments, zip, and submit.' },
      ],
      steps: [
        { title: 'Read and clarify requirements', subtasks: ['List expected inputs', 'List expected outputs'] },
        { title: 'Plan the solution', subtasks: ['Sketch pseudocode or diagram', 'Identify functions needed'] },
        { title: 'Write the core code', subtasks: ['Set up project structure', 'Implement each function'] },
        { title: 'Test and debug', subtasks: ['Run with sample input', 'Test edge cases', 'Fix errors'] },
        { title: 'Document and submit', subtasks: ['Add code comments', 'Package files', 'Upload and confirm'] },
      ],
    },
  },
  {
    keywords: ['study', 'exam', 'revision', 'revise', 'test', 'quiz', 'chapter', 'lecture'],
    template: {
      title: 'Study / Revision Session',
      description: 'Review material, summarise key topics, and test yourself.',
      sections: [
        { heading: 'Preparation', content: 'Gather all notes and past papers.' },
        { heading: 'Understanding', content: 'Identify which topics are highest priority.' },
        { heading: 'Execution', content: 'Study each topic with active recall.' },
        { heading: 'Review', content: 'Practice questions under timed conditions.' },
        { heading: 'Completion', content: 'Rest well. No new material before the exam.' },
      ],
      steps: [
        { title: 'Gather study materials', subtasks: ['Collect notes', 'Find past papers'] },
        { title: 'Prioritise topics', subtasks: ['List topics', 'Mark weakest areas'] },
        { title: 'Study each topic', subtasks: ['Read notes', 'Summarise in own words', 'Create cheat sheet'] },
        { title: 'Practise questions', subtasks: ['Attempt 5 questions', 'Mark answers', 'Re-study gaps'] },
        { title: 'Final review', subtasks: ['Skim cheat sheet', 'Pack materials', 'Sleep 8 hours'] },
      ],
    },
  },
  {
    keywords: ['present', 'presentation', 'slides', 'powerpoint', 'deck', 'pitch'],
    template: {
      title: 'Prepare Presentation',
      description: 'Research, design slides, and rehearse delivery.',
      sections: [
        { heading: 'Preparation', content: 'Define topic and identify audience.' },
        { heading: 'Understanding', content: 'Identify the 3 key messages.' },
        { heading: 'Execution', content: 'Build slides with clear headings and visuals.' },
        { heading: 'Review', content: 'Run through aloud at least once.' },
        { heading: 'Completion', content: 'Export and practise confident delivery.' },
      ],
      steps: [
        { title: 'Define topic and audience', subtasks: ['Write topic sentence', 'Describe audience'] },
        { title: 'Research content', subtasks: ['Find 3 sources', 'Note key facts'] },
        { title: 'Create slide outline', subtasks: ['Write slide titles', 'List bullet points'] },
        { title: 'Build slides', subtasks: ['Open tool', 'Add content', 'Insert visuals'] },
        { title: 'Rehearse and finalise', subtasks: ['Check slides', 'Practise aloud', 'Export file'] },
      ],
    },
  },
  {
    keywords: ['read', 'reading', 'book', 'novel', 'text', 'article'],
    template: {
      title: 'Reading Assignment',
      description: 'Read, annotate, and summarise the assigned material.',
      sections: [
        { heading: 'Preparation', content: 'Know what you are reading and why.' },
        { heading: 'Understanding', content: 'Identify themes or arguments as you read.' },
        { heading: 'Execution', content: 'Read actively — take notes, highlight key ideas.' },
        { heading: 'Review', content: 'Summarise each section in your own words.' },
        { heading: 'Completion', content: 'Write a brief reflection or answer questions.' },
      ],
      steps: [
        { title: 'Preview the material', subtasks: ['Read titles and headings', 'Note length and structure'] },
        { title: 'Read section 1', subtasks: ['Read carefully', 'Highlight key sentences'] },
        { title: 'Read remaining sections', subtasks: ['Continue reading', 'Note new ideas'] },
        { title: 'Summarise content', subtasks: ['Write 3–5 key points', 'Note any questions'] },
        { title: 'Reflect and respond', subtasks: ['Answer guiding questions', 'Note personal reaction'] },
      ],
    },
  },
];

// Fallback for unrecognised text
const GENERIC_TEXT_TEMPLATE: TaskTemplate = {
  title: 'Custom Task',
  description: 'A structured breakdown of your assignment.',
  sections: [
    { heading: 'Preparation', content: 'Clarify what needs to be done.' },
    { heading: 'Understanding', content: 'Break down the key requirements.' },
    { heading: 'Execution', content: 'Work through the task step by step.' },
    { heading: 'Review', content: 'Check your work before finalising.' },
    { heading: 'Completion', content: 'Submit or hand in the finished work.' },
  ],
  steps: [
    { title: 'Clarify the task', subtasks: ['Read instructions', 'Note requirements'] },
    { title: 'Plan your approach', subtasks: ['List steps needed', 'Estimate time'] },
    { title: 'Work through main steps', subtasks: ['Complete step 1', 'Complete step 2', 'Complete step 3'] },
    { title: 'Review your work', subtasks: ['Check for errors', 'Improve quality'] },
    { title: 'Finalise and submit', subtasks: ['Make final edits', 'Submit'] },
  ],
};

// ─────────────────────────────────────────────
// Template builders by input type
// ─────────────────────────────────────────────

function buildPdfTemplate(fileName: string | null): TaskTemplate {
  const name = fileName ?? 'uploaded document';
  return {
    title: `Document Study: ${name}`,
    description: `Content extracted from: ${name}`,
    sections: [
      { heading: 'Open & Skim', content: `Open "${name}" and scan headings, figures, and page count.` },
      { heading: 'Identify Topics', content: 'List the main sections and core concepts covered.' },
      { heading: 'Deep Study', content: 'Work through each section methodically, taking notes.' },
      { heading: 'Consolidate', content: 'Write a brief summary in your own words.' },
      { heading: 'Review', content: 'Test your understanding — cover notes and recall key points.' },
    ],
    steps: [
      { title: 'Open and skim the document', subtasks: [`Open "${name}"`, 'Skim all headings', 'Count sections and pages'] },
      { title: 'Identify key topics', subtasks: ['List all main sections', 'Highlight unfamiliar terms', 'Note diagrams or tables'] },
      { title: 'Break into study chunks', subtasks: ['Divide into 3–5 parts', 'Set a time limit per part', 'Work through each part'] },
      { title: 'Take notes per section', subtasks: ['Write key points', 'Summarise in own words', 'Mark questions to revisit'] },
      { title: 'Review and consolidate', subtasks: ['Re-read your notes', 'Fill knowledge gaps', 'Create a final summary'] },
    ],
  };
}

function buildImageTemplate(fileName: string | null): TaskTemplate {
  const name = fileName ?? 'uploaded image';
  return {
    title: `Visual Analysis: ${name}`,
    description: `Content extracted from: ${name}`,
    sections: [
      { heading: 'First Impression', content: `Look at "${name}" as a whole before focusing on details.` },
      { heading: 'Element Identification', content: 'List every visible object, label, or figure.' },
      { heading: 'Context & Purpose', content: 'Determine why this image exists and what it communicates.' },
      { heading: 'Data Extraction', content: 'Pull out any numeric, textual, or structural data.' },
      { heading: 'Summary', content: 'Write a clear 3–5 point summary of what you found.' },
    ],
    steps: [
      { title: 'First look — whole image', subtasks: [`View "${name}" without zooming`, 'Note the overall subject', 'Describe what you see in one sentence'] },
      { title: 'Identify all elements', subtasks: ['List main objects or figures', 'Note any text or labels', 'Note colours or patterns'] },
      { title: 'Determine context', subtasks: ['Ask: what is this image for?', 'Link to the topic being studied', 'Note source or origin if visible'] },
      { title: 'Extract key information', subtasks: ['Record numeric or data values', 'Describe any structure or layout', 'Sketch if helpful'] },
      { title: 'Write findings summary', subtasks: ['List 3–5 key takeaways', 'Note follow-up questions', 'File or save your notes'] },
    ],
  };
}

function selectTextTemplate(input: string): TaskTemplate {
  const lower = input.toLowerCase();
  for (const { keywords, template } of TEXT_TEMPLATES) {
    if (keywords.some(k => lower.includes(k))) {
      return {
        ...template,
        title: template.title,
        description: `Generated from: "${input.slice(0, 80)}${input.length > 80 ? '…' : ''}"`,
      };
    }
  }
  return {
    ...GENERIC_TEXT_TEMPLATE,
    description: `Generated from: "${input.slice(0, 80)}${input.length > 80 ? '…' : ''}"`,
  };
}

// ─────────────────────────────────────────────
// Task assembly helpers
// ─────────────────────────────────────────────

function makeMicrotasks(subtaskText: string, stepIndex: number, subtaskIndex: number, taskId: string): Microtask[] {
  return [
    { id: `${taskId}-s${stepIndex}-st${subtaskIndex}-m1`, text: `Start: ${subtaskText}`, completed: false },
    { id: `${taskId}-s${stepIndex}-st${subtaskIndex}-m2`, text: `Finish: ${subtaskText}`, completed: false },
  ];
}

function assembleTask(
  template: TaskTemplate,
  mode: AccessibilityMode,
  taskId: string
): Task {
  const steps: Step[] = template.steps.map((s, stepIndex) => {
    const subtasks: RichSubtask[] = s.subtasks.map((stText, stIndex) => {
      const microtasks: Microtask[] =
        mode === 'ADHD' && stepIndex < 2
          ? makeMicrotasks(stText, stepIndex, stIndex, taskId)
          : [];
      return {
        id: `${taskId}-s${stepIndex}-st${stIndex}`,
        text: stText,
        completed: false,
        microtasks,
      };
    });
    return {
      id: `${taskId}-s${stepIndex}`,
      title: s.title,
      completed: false,
      subtasks,
    };
  });

  // Legacy flat subtasks for backward compat
  const subtasks = steps.map(s => ({
    id: s.id,
    text: s.title,
    completed: false,
  }));

  return {
    id: taskId,
    title: template.title,
    description: template.description,
    completed: false,
    sections: template.sections,
    steps,
    subtasks,
  };
}

// ─────────────────────────────────────────────
// MAIN ENTRY — generateFromInput
// ─────────────────────────────────────────────

/**
 * Detects input type first, then builds ALL 4 mode variants in one call.
 * Returns a single ProcessedOutput — caller must REPLACE, never append.
 */
export function generateFromInput(
  inputType: InputType,
  textInput: string,
  fileName: string | null
): ProcessedOutput {
  const baseId = `gen-${Date.now()}`;

  // Step 1: detect & select the correct template for THIS input only
  let template: TaskTemplate;
  if (inputType === 'pdf') {
    template = buildPdfTemplate(fileName);
  } else if (inputType === 'image') {
    template = buildImageTemplate(fileName);
  } else {
    template = selectTextTemplate(textInput);
  }

  // Step 2: build all 4 mode variants from the SAME template
  const adhd     = assembleTask(template, 'ADHD',    `${baseId}-adhd`);
  const dyslexia = assembleTask(template, 'Dyslexia', `${baseId}-dyslexia`);
  const autism   = assembleTask(template, 'Autism',   `${baseId}-autism`);
  const standard = assembleTask(template, 'None',     `${baseId}-standard`);

  return {
    id: baseId,
    inputType,
    fileName,
    adhd,
    dyslexia,
    autism,
    standard,
    generatedAt: Date.now(),
  };
}

// ─────────────────────────────────────────────
// AI breakdown → ProcessedOutput mapper
// ─────────────────────────────────────────────

/**
 * Converts the Gemini AIBreakdown JSON into a full ProcessedOutput
 * with all 4 mode-specific Task objects.
 */
function mapAIBreakdownToOutput(
  breakdown: AIBreakdown,
  inputType: InputType,
  fileName: string | null,
  baseId: string
): ProcessedOutput {
  // ── ADHD Task ──────────────────────────────────────────────────────────
  const adhdSteps: Step[] = breakdown.adhd.steps.map((stepText, i) => ({
    id: `${baseId}-adhd-s${i}`,
    title: stepText,
    completed: false,
    subtasks: [
      {
        id: `${baseId}-adhd-s${i}-st0`,
        text: `Start: ${stepText}`,
        completed: false,
        microtasks: [
          { id: `${baseId}-adhd-s${i}-st0-m1`, text: `Begin: ${stepText}`, completed: false },
          { id: `${baseId}-adhd-s${i}-st0-m2`, text: `Done: ${stepText}`, completed: false },
        ],
      },
    ],
  }));
  const adhd: Task = {
    id: `${baseId}-adhd`,
    title: fileName ? `ADHD Plan: ${fileName}` : 'ADHD Task Plan',
    description: `Focus tip: ${breakdown.adhd.focus_tip}`,
    completed: false,
    sections: [{ heading: 'Focus Tip', content: breakdown.adhd.focus_tip }],
    steps: adhdSteps,
    subtasks: adhdSteps.map(s => ({ id: s.id, text: s.title, completed: false })),
  };

  // ── Dyslexia Task ──────────────────────────────────────────────────────
  const dyslexiaSteps: Step[] = breakdown.dyslexia.points.map((pt, i) => ({
    id: `${baseId}-dys-s${i}`,
    title: pt,
    completed: false,
    subtasks: [
      {
        id: `${baseId}-dys-s${i}-st0`,
        text: pt,
        completed: false,
        microtasks: [],
      },
    ],
  }));
  const dyslexia: Task = {
    id: `${baseId}-dyslexia`,
    title: fileName ? `Easy Steps: ${fileName}` : 'Easy Steps',
    description: breakdown.dyslexia.note,
    completed: false,
    sections: [{ heading: 'Note', content: breakdown.dyslexia.note }],
    steps: dyslexiaSteps,
    subtasks: dyslexiaSteps.map(s => ({ id: s.id, text: s.title, completed: false })),
  };

  // ── Autism Task ────────────────────────────────────────────────────────
  const autismSteps: Step[] = breakdown.autism.sections.map((sec, i) => ({
    id: `${baseId}-aut-s${i}`,
    title: sec.title,
    completed: false,
    subtasks: sec.items.map((item, j): RichSubtask => ({
      id: `${baseId}-aut-s${i}-st${j}`,
      text: item,
      completed: false,
      microtasks: [],
    })),
  }));
  const autismSections = breakdown.autism.sections.map(sec => ({
    heading: sec.title,
    content: sec.items.join(' · '),
  }));
  const autism: Task = {
    id: `${baseId}-autism`,
    title: fileName ? `Structured Plan: ${fileName}` : 'Structured Plan',
    description: 'A clearly structured breakdown of your task.',
    completed: false,
    sections: autismSections,
    steps: autismSteps,
    subtasks: autismSteps.map(s => ({ id: s.id, text: s.title, completed: false })),
  };

  // ── Standard Task ──────────────────────────────────────────────────────
  const standardSteps: Step[] = breakdown.default.tasks.map((t, i) => ({
    id: `${baseId}-std-s${i}`,
    title: t,
    completed: false,
    subtasks: [
      {
        id: `${baseId}-std-s${i}-st0`,
        text: t,
        completed: false,
        microtasks: [],
      },
    ],
  }));
  const standard: Task = {
    id: `${baseId}-standard`,
    title: fileName ? `Task Plan: ${fileName}` : 'Task Plan',
    description: breakdown.default.summary,
    completed: false,
    sections: [{ heading: 'Summary', content: breakdown.default.summary }],
    steps: standardSteps,
    subtasks: standardSteps.map(s => ({ id: s.id, text: s.title, completed: false })),
  };

  return {
    id: baseId,
    inputType,
    fileName,
    adhd,
    dyslexia,
    autism,
    standard,
    generatedAt: Date.now(),
  };
}

// ─────────────────────────────────────────────
// AI-powered async entry point
// ─────────────────────────────────────────────

/**
 * PRIMARY entry point.
 * Calls Gemini to generate a real AI breakdown for all 4 modes.
 * Falls back to static generateFromInput() on any network/parse error.
 */
export async function generateFromAI(
  inputType: InputType,
  textInput: string,
  fileName: string | null
): Promise<ProcessedOutput & { usedFallback?: boolean }> {
  const baseId = `gen-${Date.now()}`;

  // For PDF/Image: build a descriptive prompt so the AI understands the context
  const aiPrompt =
    inputType === 'pdf'
      ? `Study and analyse the uploaded PDF document: "${fileName ?? 'document'}". Break down all the steps needed.`
      : inputType === 'image'
      ? `Analyse the uploaded image: "${fileName ?? 'image'}". Break down all steps to observe, interpret, and extract information from it.`
      : textInput;

  try {
    const breakdown = await callGeminiBreakdown(aiPrompt);
    return mapAIBreakdownToOutput(breakdown, inputType, fileName, baseId);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('[ClearMind] Gemini call failed — using static fallback:', err);
    return { ...generateFromInput(inputType, textInput, fileName), usedFallback: true, errorReason: errorMsg };
  }
}

// ─────────────────────────────────────────────
// Legacy export kept for any residual references
// ─────────────────────────────────────────────

/** @deprecated Use generateFromAI() instead */
export function generateTask(
  inputType: InputType,
  textInput: string,
  fileName: string | null,
  mode: AccessibilityMode
): Task {
  const out = generateFromInput(inputType, textInput, fileName);
  if (mode === 'ADHD') return out.adhd;
  if (mode === 'Dyslexia') return out.dyslexia;
  if (mode === 'Autism') return out.autism;
  return out.standard;
}
