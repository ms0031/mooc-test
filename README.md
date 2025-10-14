          
# MOOC Test Platform

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.15.0-green)

A comprehensive online testing platform for MOOCs (Massive Open Online Courses) built with Next.js, React, and MongoDB. This application allows users to test their knowledge in various subjects including Conservation Economics, Psychology of Learning, and Sustainable Development.

## 📊 Usage Statistics

- **3,000+** Unique Users
- **100,000+** Page Views
- **40 min** Average Engagement Time Per User
- **18,000+** Tests Completed
- **1,200+** Registered Users

## 🚀 Technologies Used

### Frontend
- **Next.js 15.3.0** - React framework with App Router
- **React 19.0.0** - UI library
- **TailwindCSS 4.1.3** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Chart.js & React-ChartJS-2** - Data visualization
- **SWR** - Data fetching and caching
- **Zustand** - State management
- **Next View Transitions** - Page transition animations

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB 6.15.0** - NoSQL database
- **Mongoose 8.13.2** - MongoDB object modeling
- **NextAuth.js 4.24.11** - Authentication
- **bcrypt** - Password hashing

### DevOps & Analytics
- **Google Analytics** - Usage tracking
- **Turbopack** - Fast development builds

## 📁 Project Structure

```
├── .github/                # GitHub configuration
├── models/                 # Database models
├── public/                 # Static assets
├── scripts/                # Utility scripts (e.g., seed-db.js)
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── about/          # About page
│   │   ├── admin/          # Admin dashboard
│   │   ├── api/            # API routes
│   │   ├── bookmarks/      # User bookmarks
│   │   ├── dashboard/      # User dashboard
│   │   ├── test/           # Test taking interface
│   │   │   └── settings/   # Test configuration
│   │   └── feedback/       # User feedback
│   ├── assets/             # Frontend assets
│   ├── components/         # React components
│   │   ├── providers/      # Context providers
│   │   └── ui/             # UI components
│   ├── lib/                # Utility libraries
│   ├── models/             # Mongoose models
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
└── tailwind.config.js      # TailwindCSS configuration
```
## Changelog
### v-[0.2.0] - 2025-10-14
This is a major release focused on a complete visual and user experience overhaul. The entire application has been redesigned with a modern, consistent "glassmorphism" aesthetic, and numerous components have been rebuilt to be more interactive and beautiful.

### ✨ Features
- **New "Real Test" Mode**: Introduced a simulated exam environment (/test/real-test) that pulls 50 random questions from a selected category under a 60-minute time limit.

- **Sticky Test Header**: Implemented a new sticky navigation bar on the test-taking pages that displays a live countdown timer and a real-time counter for answered questions.

- **Custom Form Components**: Replaced all native browser form elements across the application to align with the new design language.

- New responsive, custom dropdown component for category selection on the Study and Test Settings pages.

- New beautiful, animated star rating system for the Feedback page.

- New reusable, themed ToggleSwitch component for all boolean settings.

### 🎨 UI/UX Improvements
- **Complete Redesign**: Overhauled the entire application with a modern "glassmorphism" design, featuring semi-transparent cards, backdrop-blur effects, and consistent borders for a cohesive user experience.

- **Dynamic Animated Backgrounds**: Integrated the BackgroundGradientAnimation component across all pages, creating a beautiful and immersive aurora-like visual theme.

- **Enhanced Loading Experience**: Replaced all basic loading states with themed skeletons that mimic the final UI layout.

- **Redesigned Auth Pages**: The Login and Register pages have been completely revamped with a centered "glass" card layout, themed inputs, and improved spacing.

- **Polished Test Results Page**: The results page has been significantly upgraded with a new animated circular progress bar for the overall grade and redesigned statistic cards that are easier to read and more visually appealing.

- **Improved Component Styling**: Refined the styling for buttons, accordions, and cards across the application to improve interactivity and visual consistency. The details element for wrong answers has been replaced with a custom, animated accordion.

## 🔄 Application Flow

1. **User Authentication**
   - Users can register, login, or use the platform as guests
   - Authentication handled by NextAuth.js with MongoDB storage

2. **Test Configuration**
   - Users select a subject category (Conservation Economics, Psychology of Learning, Sustainable Development)
   - Configure test settings (timer, randomization, specific weeks/topics)
   - Choose between regular test mode or study mode

3. **Test Taking**
   - Questions are presented with multiple-choice options
   - Timer tracks time spent (optional)
   - Study mode provides immediate feedback and explanations

4. **Results & Analytics**
   - Detailed score breakdown after test completion
   - Performance tracking over time for registered users
   - Bookmarking difficult questions for later review

5. **Dashboard**
   - Registered users can view their progress and statistics
   - Track performance across different subjects
   - Review past test results

## 📊 Schema Design

### Question Schema
- **qid**: Unique identifier
- **category**: Subject category
- **question**: Question text
- **options**: Array of possible answers
- **correctAnswer**: The correct option
- **explanation**: Detailed explanation (optional)
- **difficulty**: Easy, medium, or hard
- **tags**: Array of topic tags

### TestResult Schema
- **userId**: User identifier (optional for guests)
- **isGuest**: Boolean flag for guest users
- **category**: Subject category
- **score**: Numerical score
- **totalQuestions**: Number of questions in test
- **correctAnswers**: Count of correct responses
- **wrongAnswers**: Count of incorrect responses
- **timeTaken**: Total time spent on test
- **answers**: Array of detailed answer records including:
  - qid: Question identifier
  - userAnswer: User's selected option
  - isCorrect: Boolean result
  - timeSpent: Time spent on this question
  - wrongFrequency: Record of incorrect attempts

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Seeding

To populate the database with initial questions:

```bash
npm run seed
```

## 🔗 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## 📝 License

This project is proprietary and confidential.

        