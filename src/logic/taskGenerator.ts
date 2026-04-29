import type { Task, Step, RichSubtask, Microtask } from '../context/TasksContext';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type InputType = 'text' | 'pdf' | 'image';
export type AccessibilityMode = 'ADHD' | 'Autism' | 'Dyslexia' | 'None';

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
// Keyword → Template Matching (text input)
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
    keywords: ['read', 'reading', 'book', 'novel', 'chapter', 'text', 'article'],
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

// Fallback generic template for unrecognised text
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

// PDF template
const PDF_TEMPLATE: TaskTemplate = {
  title: 'Study Assignment (PDF)',
  description: 'Review the uploaded document, identify key topics, and study each section.',
  sections: [
    { heading: 'Preparation', content: 'Open and skim the document for structure.' },
    { heading: 'Understanding', content: 'Identify the main topics and sections.' },
    { heading: 'Execution', content: 'Study each section carefully with notes.' },
    { heading: 'Review', content: 'Test your understanding of key points.' },
    { heading: 'Completion', content: 'Compile a summary or answer required questions.' },
  ],
  steps: [
    { title: 'Review the document', subtasks: ['Open the file', 'Skim headings and structure', 'Note page count'] },
    { title: 'Identify key topics', subtasks: ['List main sections', 'Highlight core concepts'] },
    { title: 'Break into study sections', subtasks: ['Assign sections to sessions', 'Set time limits per section'] },
    { title: 'Study each section', subtasks: ['Read carefully', 'Write key points', 'Create summary notes'] },
    { title: 'Review and consolidate', subtasks: ['Read your notes back', 'Fill any gaps', 'Prepare for questions'] },
  ],
};

// Image template
const IMAGE_TEMPLATE: TaskTemplate = {
  title: 'Analyse Visual Content',
  description: 'Observe, interpret, and extract information from the uploaded visual material.',
  sections: [
    { heading: 'Preparation', content: 'View the image carefully without rushing.' },
    { heading: 'Understanding', content: 'Identify elements and their relationships.' },
    { heading: 'Execution', content: 'Extract and record meaningful information.' },
    { heading: 'Review', content: 'Verify your interpretation against what you see.' },
    { heading: 'Completion', content: 'Write a clear summary of your findings.' },
  ],
  steps: [
    { title: 'Observe the image', subtasks: ['Look at the whole image first', 'Note overall subject or theme'] },
    { title: 'Identify elements', subtasks: ['List main objects or figures', 'Note labels or text within image'] },
    { title: 'Understand context', subtasks: ['Determine purpose of the image', 'Relate to topic being studied'] },
    { title: 'Extract information', subtasks: ['Note key data or details', 'Sketch or describe structure'] },
    { title: 'Summarise findings', subtasks: ['Write 3–5 key takeaways', 'Note any follow-up questions'] },
  ],
};

// ─────────────────────────────────────────────
// Template selection
// ─────────────────────────────────────────────

function selectTextTemplate(input: string): TaskTemplate {
  const lower = input.toLowerCase();
  for (const { keywords, template } of TEXT_TEMPLATES) {
    if (keywords.some(k => lower.includes(k))) {
      return {
        ...template,
        // Personalise the title with a snippet of the user's input
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
// Microtask builder (for ADHD mode — steps 0 & 1)
// ─────────────────────────────────────────────

function buildMicrotasks(subtaskText: string, stepIndex: number, subtaskIndex: number, taskId: string): Microtask[] {
  // Only generate microtasks for the first two steps in ADHD mode
  return [
    { id: `${taskId}-s${stepIndex}-st${subtaskIndex}-m1`, text: `Start: ${subtaskText}`, completed: false },
    { id: `${taskId}-s${stepIndex}-st${subtaskIndex}-m2`, text: `Finish: ${subtaskText}`, completed: false },
  ];
}

// ─────────────────────────────────────────────
// Main generator
// ─────────────────────────────────────────────

export function generateTask(
  inputType: InputType,
  textInput: string,
  fileName: string | null,
  mode: AccessibilityMode
): Task {
  const taskId = `gen-${Date.now()}`;

  // Select template
  let template: TaskTemplate;
  if (inputType === 'pdf') {
    template = { ...PDF_TEMPLATE, description: fileName ? `From: ${fileName}` : PDF_TEMPLATE.description };
  } else if (inputType === 'image') {
    template = { ...IMAGE_TEMPLATE, description: fileName ? `From: ${fileName}` : IMAGE_TEMPLATE.description };
  } else {
    template = selectTextTemplate(textInput);
  }

  // Build steps with mode adaptation
  const steps: Step[] = template.steps.map((s, stepIndex) => {
    const subtasks: RichSubtask[] = s.subtasks.map((stText, stIndex) => {
      // ADHD: add microtasks to first 2 steps
      const microtasks: Microtask[] =
        mode === 'ADHD' && stepIndex < 2
          ? buildMicrotasks(stText, stepIndex, stIndex, taskId)
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

  // Legacy flat subtasks (backward compat)
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
