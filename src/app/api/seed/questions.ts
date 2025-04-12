interface Question {
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  tags: string[];
}

export const sampleQuestions: Question[] = [
  {
    category: "psychology",
    question:
      "Which learning theory emphasizes the role of mental states in learning?",
    options: [
      "Behaviorism",
      "Cognitive Theory",
      "Social Learning Theory",
      "Classical Conditioning",
    ],
    correctAnswer: "Cognitive Theory",
    explanation:
      "Cognitive Theory emphasizes mental processes such as thinking, memory, problem solving, and language in the learning process.",
    difficulty: "medium",
    tags: ["learning theory", "cognition"],
  },
  {
    category: "psychology",
    question: "What is metacognition?",
    options: [
      "Thinking about thinking",
      "Basic memory processes",
      "Learning through observation",
      "Unconscious learning",
    ],
    correctAnswer: "Thinking about thinking",
    explanation:
      "Metacognition refers to higher-order thinking that enables understanding, analysis, and control of one's cognitive processes.",
    difficulty: "medium",
    tags: ["cognition", "learning strategies"],
  },
  {
    category: "learning",
    question: "What is the primary characteristic of intrinsic motivation?",
    options: [
      "Engaging in an activity for its own sake",
      "Working for external rewards",
      "Avoiding punishment",
      "Following social norms",
    ],
    correctAnswer: "Engaging in an activity for its own sake",
    explanation:
      "Intrinsic motivation refers to doing something because it is inherently interesting or enjoyable, rather than for external rewards.",
    difficulty: "medium",
    tags: ["motivation", "educational psychology"],
  },
];
