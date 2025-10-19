import { Schema, model, models } from "mongoose";

export interface IGoogleUser {
  name: string;
  email: string;
  image: string | null;
  lastLogin: Date;
  bookmarkedQids: string[];
  createdAt: Date;
  updatedAt: Date;
}

const googleUserSchema = new Schema<IGoogleUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    image: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    bookmarkedQids: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const GoogleUser = models.GoogleUser || model("GoogleUser", googleUserSchema);

export default GoogleUser;
