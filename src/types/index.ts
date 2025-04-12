import { DefaultSession } from "next-auth";
import { IUser } from "@/models/User";
import { IQuestion } from "@/models/Question";
import { ITestResult, ITestAnswer } from "@/models/TestResult";

// Extend next-auth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
  }
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface QuestionResponse extends Omit<IQuestion, "_id"> {
  _id: string;
}

export interface TestResultResponse extends Omit<ITestResult, "_id"> {
  _id: string;
}

// Auth Types
export interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

// Test Types
export interface TestAnswer {
  qid: string; // Changed from questionId to qid
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  wrongFrequency?: Record<string, number>;
  correctAnswer: string;
}

export interface TestSubmission {
  category: string;
  answers: TestAnswer[];
  timeTaken: number;
}

// Analytics Types
export interface PageView {
  path: string;
  params: Record<string, string>;
  timestamp: string;
}

export interface UserStats {
  totalTests: number;
  averageScore: number;
  totalTimeTaken: number;
  bestScore: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
}

// Re-export model interfaces
export type { IUser, IQuestion, ITestResult, ITestAnswer };
