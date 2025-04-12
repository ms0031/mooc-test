import { Schema, model, models, Document } from "mongoose";

export interface ITestAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  wrongFrequency?: Record<string, number>; // Use Record<string, number> or simple Object
  correctAnswer: string;
}

export interface ITestResult extends Document {
  // Extend Document for Mongoose methods
  userId?: string;
  isGuest: boolean;
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;
  answers: ITestAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the answers subdocument separately for clarity
const answerSchema = new Schema<ITestAnswer>(
  {
    questionId: {
      type: String, // Expect a string ID
      required: true,
    },
    userAnswer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    timeSpent: {
      type: Number,
      required: true,
      min: 0,
    },
    wrongFrequency: {
      type: Object, // Store as a plain JavaScript object
      of: Number, // Values within the object should be numbers
      default: {},
    },
    correctAnswer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
); // Prevent Mongoose from creating an _id for each answer

const testResultSchema = new Schema<ITestResult>(
  {
    userId: {
      type: String,
      required: false, // Allow null/undefined for guest users
      index: true,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
    },
    wrongAnswers: {
      type: Number,
      required: true,
      min: 0,
    },
    timeTaken: {
      type: Number,
      required: true,
      min: 0,
    },
    answers: [answerSchema], // Use the defined answer schema
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Add indexes for common queries
testResultSchema.index({ userId: 1, createdAt: -1 });
testResultSchema.index({ category: 1, createdAt: -1 });
testResultSchema.index({ score: -1 });

// Virtual for percentage score
testResultSchema.virtual("scorePercentage").get(function (this: ITestResult) {
  return Math.round((this.correctAnswers / this.totalQuestions) * 100);
});

// Method to get summary statistics
testResultSchema.statics.getUserStats = async function (userId: string) {
  const stats = await this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalTests: { $sum: 1 },
        averageScore: { $avg: "$score" },
        totalTimeTaken: { $sum: "$timeTaken" },
        bestScore: { $max: "$score" },
        totalCorrectAnswers: { $sum: "$correctAnswers" },
        totalQuestions: { $sum: "$totalQuestions" },
      },
    },
  ]);

  return stats[0] || null;
};

// Prevent model recompilation in Next.js dev environment
const TestResult =
  models.TestResult || model<ITestResult>("TestResult", testResultSchema);

export default TestResult;
