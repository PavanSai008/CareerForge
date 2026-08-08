// IMPORTANT: question text and option ids ("a" | "b" | "c" | "d") must exactly
// mirror the QUESTION_BANK in artifacts/api-server/src/lib/gemini.ts — the
// backend maps these option ids back to option text when building the Gemini
// prompt. Keep the two files in sync if either changes.

export interface QuizOption {
  id: "a" | "b" | "c" | "d";
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "When you have free time, you're most likely to:",
    options: [
      { id: "a", text: "Solve puzzles, riddles, or logic games" },
      { id: "b", text: "Sketch, design, or create something visual" },
      { id: "c", text: "Tinker with gadgets or try to understand how things work" },
      { id: "d", text: "Organize, plan, or lead a group activity" },
    ],
  },
  {
    id: 2,
    question: "Which type of school project excited you the most?",
    options: [
      { id: "a", text: "Writing programs or building something that runs on a computer" },
      { id: "b", text: "Analyzing data and presenting findings with charts" },
      { id: "c", text: "Creating a poster, presentation, or design project" },
      { id: "d", text: "Conducting experiments and researching how things behave" },
    ],
  },
  {
    id: 3,
    question: "When something breaks or goes wrong, you:",
    options: [
      { id: "a", text: "Systematically trace the root cause step by step" },
      { id: "b", text: "Try different approaches until something works" },
      { id: "c", text: "Search for existing solutions others have found" },
      { id: "d", text: "Ask others and collaborate to figure it out" },
    ],
  },
  {
    id: 4,
    question: "Which of these domains interests you the most right now?",
    options: [
      { id: "a", text: "Artificial Intelligence and how machines learn" },
      { id: "b", text: "Building websites and mobile apps people use daily" },
      { id: "c", text: "Keeping data and systems safe from attacks" },
      { id: "d", text: "Managing servers, deployments, and cloud infrastructure" },
    ],
  },
  {
    id: 5,
    question: "How comfortable are you with mathematics and statistics?",
    options: [
      { id: "a", text: "Very comfortable — I genuinely enjoy it" },
      { id: "b", text: "Comfortable with the basics, can learn more" },
      { id: "c", text: "I prefer logic and programming over heavy math" },
      { id: "d", text: "I avoid it and prefer qualitative or creative work" },
    ],
  },
  {
    id: 6,
    question: "If you were building a product, you'd be most excited to work on:",
    options: [
      { id: "a", text: "The interface — making it look and feel great" },
      { id: "b", text: "The backend — making it fast, secure, and scalable" },
      { id: "c", text: "The AI brain — making it smart and personalized" },
      { id: "d", text: "The infrastructure — deploying and scaling it reliably" },
    ],
  },
  {
    id: 7,
    question: "What kind of work environment suits you best?",
    options: [
      { id: "a", text: "Deep focused solo work on complex technical problems" },
      { id: "b", text: "Collaborating in a small high-energy team" },
      { id: "c", text: "Research-oriented, lots of reading and experimentation" },
      { id: "d", text: "Fast-paced startup with varied responsibilities" },
    ],
  },
  {
    id: 8,
    question: "Where do you see yourself in 5 years?",
    options: [
      { id: "a", text: "Senior engineer at a top tech company (Google, Microsoft, Amazon)" },
      { id: "b", text: "Co-founder of a tech startup I built from scratch" },
      { id: "c", text: "Researcher or professor advancing the field" },
      { id: "d", text: "Freelancer or consultant working across multiple industries" },
    ],
  },
  {
    id: 9,
    question: "Which of these best describes how you learn?",
    options: [
      { id: "a", text: "By building projects — learning by doing" },
      { id: "b", text: "By reading documentation and understanding theory first" },
      { id: "c", text: "By watching video tutorials and following along" },
      { id: "d", text: "By discussing with peers and pair programming" },
    ],
  },
  {
    id: 10,
    question: "If you had a free weekend and a laptop, you'd most likely build:",
    options: [
      { id: "a", text: "A mobile app or full-stack web application" },
      { id: "b", text: "An ML model that predicts or classifies something interesting" },
      { id: "c", text: "An automated script or cloud deployment pipeline" },
      { id: "d", text: "A game, simulation, or creative visual experience" },
    ],
  },
];
