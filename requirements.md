# MOOC Test App - Requirements Document

## Overview
The following table outlines the detailed functional requirements for the MOOC Test App, including a **home page** and additional features to improve user experience and functionality.

---

## Functional Requirements

| Requirement ID | Description              | User Story                                                                 | Expected Behavior/Outcome                                                                                                           |
|----------------|--------------------------|----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| **FR001**      | Dashboard                | As a logged-in user, I want to view my test statistics on a dashboard to track my progress. | Displays test attempts, correct/wrong answers, average time, and scores. **Available only to authenticated users.**                 |
| **FR002**      | Wrong Answers Collection | As a logged-in user, I want to review my frequently incorrect answers to focus on improvement. | Shows a list of wrong answers sorted by frequency. **Exclusive to authenticated users.**                                            |
| **FR003**      | Authentication           | As a user, I want to log in securely or continue as a guest to choose whether to save my progress. | Uses NextAuth for secure login/signup. Guest data is session-only; authenticated users have persistent data.                        |
| **FR004**      | Test History             | As a logged-in user, I want to view my test history to track long-term progress. | Displays dates, scores, and performance details. **Only accessible to authenticated users.**                                       |
| **FR005**      | Taking Tests             | As a user, I want to take tests whether logged in or not.                 | Tests can be started from the home page the test will be of mcq type having 4 options and only one correct answer. Results are saved **only for authenticated users**; guest results are temporary.          |
| **FR006**      | Test Timer               | As a user, I want a timer during tests to track my time.                  | Provides a countdown/up timer during tests. Can be toggled on/off in settings (see FR010).                                          |
| **FR007**      | Detailed Statistics      | As a user, I want in-depth analytics to analyze my performance.           | Offers per-test scores, correct/wrong ratios, and advanced analytics.                                                              |
| **FR008**      | Admin Panel (Feature Flags) | As an admin, I want to manage feature availability.                     | Includes an admin panel for enabling/disabling features via flags.                                                                 |
| **FR009**      | Analytics                | As an admin, I want to track app usage to improve user experience.        | Integrates analytics tools (e.g., Next.js) to collect page views, test completions, and user behavior metrics.                      |
| **FR010**      | Test Customization       | As a user, I want to customize test settings to suit my preferences.      | Allows users to toggle timer, randomize answers option in multiple choice questions, and select test subject (e.g., psychology of learning) before starting a test.      |
| **FR011**      | Home Page                | As a user, I want a home page to quickly start using the app.             | Entry point with options: **Take Test (Guest)**, **Login/Signup**, or **View Dashboard** (if authenticated).                       |
| **FR012**      | Post-Test Summary (Guests) | As a guest, I want to see my test results immediately.                  | Displays a temporary summary post-test. Guests are prompted to sign up to save results.                                             |
| **FR013**      | Social Sharing           | As a user, I want to share my test results on social media.               | Add "Share" buttons for Twitter, LinkedIn, and WhatsApp with pre-filled messages (e.g., "I scored 85% on the MOOC Test App!").      |
| **FR014**      | Progress Over Time       | As a user, I want to visualize my progress through graphs.                | Display line/pie charts on the dashboard showing score trends and topic-wise performance over weeks/months.                         |
| **FR015**      | Test Categories          | As a user, I want to choose tests by subject (e.g., psychology of learning).    | Add a category selector on the home page and allow admins to upload new test categories via the admin panel.                        |
| **FR016**      | Study Mode               | As a user, I want a non-timed mode to review questions without pressure.  | Include a "Study Mode" toggle in test settings that disables the timer and allows unlimited retries.                                |
| **FR017**      | Dark Mode                | As a user, I want a dark theme for comfortable nighttime use.             | Add a theme toggle in the header that switches between light/dark modes, saving the preference in user profiles or local storage.   |
| **FR018**      | FAQ Section              | As a user, I want answers to common questions without contacting support. | Add a FAQ page with expandable sections (e.g., "How do I reset my password?").                                                     |
| **FR019**      | Data Export              | As a user, I want to download my test history as a PDF.               | Include "Export Data" buttons on the dashboard and history pages, generating formatted reports.                                    |
| **FR020**      | Feedback System          | As a user, I want to report issues or suggest improvements.               | Add a feedback form in the sidebar with options to rate the app, describe bugs, or request features.                                |

---


## User Flows
1. **Guest Flow**:
   - Home Page → Take Test → Temporary Summary → Prompt to Sign Up.
2. **Authenticated User Flow**:
   - Home Page → Login/Signup → Dashboard → Take Test → Results Saved to History.
3. **Post-Test Actions**:
   - Guests: Results discarded after session expiration.
   - Authenticated Users: Results stored for history, dashboard, and analytics.

---

## Notes
- **Guest Limitations**:
  - No access to dashboard (FR001), test history (FR004), or wrong-answer collections (FR002).
  - Data is cleared upon session/browser closure.
- **Security**:
  - Authentication (FR003) ensures user data privacy.
  - Guest sessions are isolated and non-persistent.
- **Admin Controls**:
  - Feature flags (FR008) allow admins to toggle functionalities like timer or test types.

  ### **Additional Notes**
1. **Anonymous Users**: 
   - Tests taken without logging in will not save results or contribute to statistics.
   - Display a banner during tests: "*You’re in guest mode. Log in to save your progress.*"
2. **UI/UX Priorities**:
   - Home page should prioritize the "Take Test" option for quick access.
   - Use tooltips to explain features (e.g., hover over "Study Mode" to see benefits).
3. **Security**:
   - Hash passwords using bcrypt and encrypt sensitive user data.
   - Regularly audit sessions for unauthorized access.
4. **Questions**:
    - question are provided in the file named questions_psychology_of_learning.ts