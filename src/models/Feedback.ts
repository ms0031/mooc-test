import { Schema, model, models } from "mongoose";

export interface IFeedback {
  userId?: string;
  type: "bug" | "feature" | "improvement" | "other";
  rating: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: String,
      required: false, // Optional for anonymous feedback
      index: true,
    },
    type: {
      type: String,
      required: [true, "Feedback type is required"],
      enum: ["bug", "feature", "improvement", "other"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
      minlength: [3, "Feedback message must be at least 3 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ type: 1, createdAt: -1 });

const Feedback =
  models.Feedback || model<IFeedback>("Feedback", feedbackSchema);

export default Feedback;
