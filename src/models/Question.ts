import { Schema, model, models } from "mongoose";

export interface IQuestion {
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
    },
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, "Options are required"],
      validate: {
        validator: (options: string[]) => options.length >= 2,
        message: "At least two options are required",
      },
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      validate: {
        validator: function (this: IQuestion, value: string) {
          return this.options.includes(value);
        },
        message: "Correct answer must be one of the options",
      },
    },
    explanation: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: [true, "Difficulty level is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
questionSchema.index({ category: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ difficulty: 1 });

const Question = models.Question || model("Question", questionSchema);

export default Question;
