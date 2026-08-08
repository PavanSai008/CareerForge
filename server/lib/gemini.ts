import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from '@google/generative-ai';
import { z } from 'zod';

export interface CareerAnswerInput {
  questionId: number;
  selectedOption: string;
}

const VALID_COLOR_KEYS = ['violet', 'blue', 'cyan', 'green', 'gold'] as const;

const RoadmapPhaseSchema = z.object({
  phase: z.number().int().min(1).max(5),
  title: z.string().min(1),
  duration: z.string().min(1),
  colorKey: z.enum(VALID_COLOR_KEYS),
  skills: z.array(z.string().min(1)).min(1),
  milestone: z.string().min(1),
  resources: z.array(z.string().min(1)).min(1),
});

const SwitchPathSchema = z.object({
  fromPhase: z.number().int().min(1).max(5),
  role: z.string().min(1),
  emoji: z.string().min(1),
  description: z.string().min(1),
  additionalSkills: z.array(z.string().min(1)).min(1),
});

const GeneratedCareerAnalysisSchema = z.object({
  careerRole: z.string().min(1),
  tagline: z.string().min(1),
  matchScore: z.number().min(0).max(100),
  emoji: z.string().min(1),
  whyThisFits: z.string().min(1),
  personalityType: z.string().min(1),
  traits: z.array(z.string().min(1)).min(1),
  roadmap: z.array(RoadmapPhaseSchema).length(5),
  switchPaths: z.array(SwitchPathSchema).min(2).max(3),
  topCompanies: z.array(z.string().min(1)).min(1),
  salaryRange: z.string().min(1),
  certifications: z.array(z.string().min(1)).min(1),
});

export type GeneratedCareerAnalysis = z.infer<typeof GeneratedCareerAnalysisSchema>;

/** Values copied from the old JSON example — reject if returned for unrelated manual prompts. */
const TEMPLATE_EXAMPLE_MARKERS = [
  'Deploy a personal portfolio website online',
  'Meta Frontend Developer (Coursera)',
  'Build complete web apps from pixel to database',
  'HTML & CSS',
  'The Odin Project',
];

const QUESTION_BANK: Record<number, { question: string; options: Record<string, string> }> = {
  1: {
    question: "When you have free time, you're most likely to:",
    options: {
      a: 'Solve puzzles, riddles, or logic games',
      b: 'Sketch, design, or create something visual',
      c: 'Tinker with gadgets or try to understand how things work',
      d: 'Organize, plan, or lead a group activity',
    },
  },
  2: {
    question: 'Which type of school project excited you the most?',
    options: {
      a: 'Writing programs or building something that runs on a computer',
      b: 'Analyzing data and presenting findings with charts',
      c: 'Creating a poster, presentation, or design project',
      d: 'Conducting experiments and researching how things behave',
    },
  },
  3: {
    question: 'When something breaks or goes wrong, you:',
    options: {
      a: 'Systematically trace the root cause step by step',
      b: 'Try different approaches until something works',
      c: 'Search for existing solutions others have found',
      d: 'Ask others and collaborate to figure it out',
    },
  },
  4: {
    question: 'Which of these domains interests you the most right now?',
    options: {
      a: 'Artificial Intelligence and how machines learn',
      b: 'Building websites and mobile apps people use daily',
      c: 'Keeping data and systems safe from attacks',
      d: 'Managing servers, deployments, and cloud infrastructure',
    },
  },
  5: {
    question: 'How comfortable are you with mathematics and statistics?',
    options: {
      a: 'Very comfortable — I genuinely enjoy it',
      b: 'Comfortable with the basics, can learn more',
      c: 'I prefer logic and programming over heavy math',
      d: 'I avoid it and prefer qualitative or creative work',
    },
  },
  6: {
    question: "If you were building a product, you'd be most excited to work on:",
    options: {
      a: 'The interface — making it look and feel great',
      b: 'The backend — making it fast, secure, and scalable',
      c: 'The AI brain — making it smart and personalized',
      d: 'The infrastructure — deploying and scaling it reliably',
    },
  },
  7: {
    question: 'What kind of work environment suits you best?',
    options: {
      a: 'Deep focused solo work on complex technical problems',
      b: 'Collaborating in a small high-energy team',
      c: 'Research-oriented, lots of reading and experimentation',
      d: 'Fast-paced startup with varied responsibilities',
    },
  },
  8: {
    question: 'Where do you see yourself in 5 years?',
    options: {
      a: 'Senior engineer at a top tech company (Google, Microsoft, Amazon)',
      b: 'Co-founder of a tech startup I built from scratch',
      c: 'Researcher or professor advancing the field',
      d: 'Freelancer or consultant working across multiple industries',
    },
  },
  9: {
    question: 'Which of these best describes how you learn?',
    options: {
      a: 'By building projects — learning by doing',
      b: 'By reading documentation and understanding theory first',
      c: 'By watching video tutorials and following along',
      d: 'By discussing with peers and pair programming',
    },
  },
  10: {
    question: "If you had a free weekend and a laptop, you'd most likely build:",
    options: {
      a: 'A mobile app or full-stack web application',
      b: 'An ML model that predicts or classifies something interesting',
      c: 'An automated script or cloud deployment pipeline',
      d: 'A game, simulation, or creative visual experience',
    },
  },
};

const CAREER_ANALYSIS_RESPONSE_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    careerRole: { type: SchemaType.STRING },
    tagline: { type: SchemaType.STRING },
    matchScore: { type: SchemaType.NUMBER },
    emoji: { type: SchemaType.STRING },
    whyThisFits: { type: SchemaType.STRING },
    personalityType: { type: SchemaType.STRING },
    traits: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    roadmap: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          phase: { type: SchemaType.INTEGER },
          title: { type: SchemaType.STRING },
          duration: { type: SchemaType.STRING },
          colorKey: { type: SchemaType.STRING },
          skills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          milestone: { type: SchemaType.STRING },
          resources: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        },
        required: ['phase', 'title', 'duration', 'colorKey', 'skills', 'milestone', 'resources'],
      },
    },
    switchPaths: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          fromPhase: { type: SchemaType.INTEGER },
          role: { type: SchemaType.STRING },
          emoji: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          additionalSkills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        },
        required: ['fromPhase', 'role', 'emoji', 'description', 'additionalSkills'],
      },
    },
    topCompanies: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    salaryRange: { type: SchemaType.STRING },
    certifications: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
  },
  required: [
    'careerRole',
    'tagline',
    'matchScore',
    'emoji',
    'whyThisFits',
    'personalityType',
    'traits',
    'roadmap',
    'switchPaths',
    'topCompanies',
    'salaryRange',
    'certifications',
  ],
};

const QUIZ_SYSTEM_PROMPT = `You are an expert tech career counselor for first-year Computer Science students in India.
Analyze structured quiz answers and recommend the single best-fitting tech career path with a detailed, realistic, actionable roadmap.
You MUST respond with ONLY a valid JSON object matching the required schema — no markdown, no code fences, no extra text.
Always include exactly 5 roadmap phases and 2-3 switch paths.`;

const MANUAL_SYSTEM_PROMPT = `You are an expert learning-path designer who builds fully custom roadmaps from a student's free-text goal.

CRITICAL RULES:
- The student's written goal is the ONLY source of truth.
- Generate a roadmap specifically for THAT exact request — not a generic tech career template.
- Do NOT pick from a predefined list of careers (e.g. Full Stack Developer, Data Scientist, AI/ML Engineer, DevOps Engineer, Web Developer) unless the student explicitly asked for that exact path.
- Do NOT return generic web-development, data-science, or full-stack roadmaps when the student asked for something else (games, photography, Blender, cybersecurity, FastAPI-only, etc.).
- careerRole must be a concise title derived directly from the student's goal (e.g. "Unity 2D Game Development", "Digital Photography", "FastAPI Backend Engineering").
- All roadmap phases, skills, milestones, resources, switch paths, companies, and certifications must reflect the student's stated technologies, domain, experience level, and outcome.
- For non-career learning goals (photography, 3D art, hobbies), adapt fields creatively: topCompanies = relevant platforms/communities/employers; salaryRange = realistic market info or outcome description.
- whyThisFits must reference specific details from the student's goal.
- You MUST respond with ONLY a valid JSON object matching the required schema — no markdown, no code fences, no extra text.
Always include exactly 5 roadmap phases and 2-3 switch paths.`;

const ROADMAP_OUTPUT_RULES =
  'Tailor every field to the recommended path. Always include exactly 5 roadmap phases (phase 1–5) and 2-3 switch paths. Use colorKey values: violet, blue, cyan, green, or gold.';

function formatAnswers(answers: CareerAnswerInput[]): string {
  return answers
    .map((ans) => {
      const q = QUESTION_BANK[ans.questionId];
      const optionText = q?.options[ans.selectedOption];
      return `Q${ans.questionId}: ${q?.question ?? 'Unknown question'}\nAnswer: "${optionText ?? ans.selectedOption}"`;
    })
    .join('\n\n');
}

function buildQuizUserPrompt(answers: CareerAnswerInput[]): string {
  const formattedAnswers = formatAnswers(answers);
  return `Analyze these quiz answers and recommend ONE tech career path:

${formattedAnswers}

${ROADMAP_OUTPUT_RULES}`;
}

function buildManualUserPrompt(prompt: string): string {
  return `Create a completely custom learning roadmap for this student goal. Do NOT classify it into a generic predefined career unless the student explicitly requested one.

STUDENT GOAL (primary input — follow this exactly):
"""
${prompt}
"""

Requirements:
1. careerRole = concise title that directly names THIS goal (technologies + outcome).
2. Each of the 5 roadmap phases must teach skills relevant to this goal, in a sensible progression from the student's implied level to their target outcome.
3. Phase skills, milestones, and resources must mention specific tools/topics from the goal when provided (e.g. Unity, C#, FastAPI, Blender, photography).
4. switchPaths = 2-3 adjacent skills/roles the student could explore after part of this path — still related to their domain.
5. whyThisFits must cite concrete details from the student's goal text.
6. Do NOT reuse generic portfolio/web-dev/data-science content unless the student asked for that.

${ROADMAP_OUTPUT_RULES}`;
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'want',
    'learn',
    'become',
    'using',
    'from',
    'with',
    'that',
    'this',
    'have',
    'into',
    'make',
    'first',
    'about',
    'your',
    'goal',
    'beginner',
    'intermediate',
    'advanced',
    'production',
    'ready',
    'build',
  ]);

  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s+#/]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length >= 3 && !stopWords.has(word)),
    ),
  ];
}

function assertManualResponseMatchesPrompt(prompt: string, analysis: GeneratedCareerAnalysis): void {
  const keywords = extractKeywords(prompt);
  if (keywords.length === 0) return;

  const responseBlob = JSON.stringify(analysis).toLowerCase();
  const matchedKeywords = keywords.filter((keyword) => responseBlob.includes(keyword));
  const requiredMatches = Math.min(2, keywords.length);

  if (matchedKeywords.length < requiredMatches) {
    throw new Error(
      'Generated roadmap did not appear tailored to your goal. Please try again with more specific details.',
    );
  }

  const templateHits = TEMPLATE_EXAMPLE_MARKERS.filter((marker) =>
    responseBlob.includes(marker.toLowerCase()),
  );
  const promptMentionsWeb =
    /\b(html|css|javascript|react|frontend|full[- ]?stack|web dev|portfolio)\b/i.test(prompt);

  if (templateHits.length >= 2 && !promptMentionsWeb) {
    throw new Error(
      'Received a generic template roadmap instead of a custom one. Please try again.',
    );
  }
}

function parseAndValidateAnalysis(raw: unknown, source: CareerAnalysisSource): GeneratedCareerAnalysis {
  const parsed = GeneratedCareerAnalysisSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Gemini response failed schema validation', parsed.error.flatten());
    throw new Error('AI returned an invalid roadmap structure. Please try again.');
  }

  const analysis = parsed.data;

  for (const phase of analysis.roadmap) {
    if (phase.phase < 1 || phase.phase > 5) {
      throw new Error('AI returned an invalid roadmap structure. Please try again.');
    }
  }

  if (source.type === 'manual') {
    assertManualResponseMatchesPrompt(source.prompt, analysis);
  }

  return analysis;
}

async function callGemini(
  userPrompt: string,
  apiKey: string,
  systemInstruction: string,
): Promise<GeneratedCareerAnalysis> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: CAREER_ANALYSIS_RESPONSE_SCHEMA,
    },
  });

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as GeneratedCareerAnalysis;
  } catch (err) {
    console.error('Failed to parse Gemini JSON response', err, text);
    throw new Error('Failed to parse career analysis response. Please try again.');
  }
}

export type CareerAnalysisSource =
  | { type: 'quiz'; answers: CareerAnswerInput[] }
  | { type: 'manual'; prompt: string };

export async function generateCareerAnalysisFromSource(
  source: CareerAnalysisSource,
  apiKey: string,
): Promise<GeneratedCareerAnalysis> {
  const isManual = source.type === 'manual';
  const userPrompt =
    source.type === 'quiz' ? buildQuizUserPrompt(source.answers) : buildManualUserPrompt(source.prompt);
  const systemInstruction = isManual ? MANUAL_SYSTEM_PROMPT : QUIZ_SYSTEM_PROMPT;

  const raw = await callGemini(userPrompt, apiKey, systemInstruction);
  return parseAndValidateAnalysis(raw, source);
}

/** @deprecated Prefer generateCareerAnalysisFromSource — kept for backward compatibility. */
export async function generateCareerAnalysis(
  answers: CareerAnswerInput[],
  apiKey: string,
): Promise<GeneratedCareerAnalysis> {
  return generateCareerAnalysisFromSource({ type: 'quiz', answers }, apiKey);
}
