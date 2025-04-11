import { Schema, model, models } from "mongoose";

export interface ITestAnswer {
  questionId: Schema.Types.ObjectId;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface ITestResult {
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

const testResultSchema = new Schema<ITestResult>(
  {
    userId: {
      type: String,
      required: false,
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
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
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
      },
    ],
  },
  {
    timestamps: true,
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

const TestResult = models.TestResult || model("TestResult", testResultSchema);

export default TestResult;
