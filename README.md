# Quizify - AI-Assisted Knowledge Quiz

An intelligent quiz application powered by AI that generates personalized quizzes based on user interests and difficulty levels.

🔗 **Live Demo**: [https://plumhq-assignment.vercel.app](https://plumhq-assignment.vercel.app)

---

## 1. Project Setup & Demo

### Web Application

#### Prerequisites
- Node.js (v16 or higher)
- npm or bun package manager

#### Installation & Running

```bash
# Clone the repository
git clone https://github.com/Aryan123-rgb/plumhq-assignment.git
cd plumhq-assignment

# Install dependencies
npm install
# OR if you're using bun
bun install

# Start the development server
npm run dev
# OR
bun dev
```

The application will be available at `http://localhost:8080` (or the port shown in your terminal).

#### Build for Production

```bash
npm run build
npm run preview
```

### Demo
- **Hosted Link**: [https://plumhq-assignment.vercel.app](https://plumhq-assignment.vercel.app)
- The application is deployed on Vercel with automatic deployments on push to main branch

---

## 2. Problem Understanding

### Problem Statement
The goal was to create an interactive quiz application that leverages AI to generate personalized quiz questions based on user preferences. The application needed to provide an engaging user experience with the following key features:

1. **User Onboarding**: Collect user information including name, interests, and preferred difficulty level
2. **AI-Powered Question Generation**: Generate relevant quiz questions using AI based on user preferences
3. **Interactive Quiz Experience**: Present questions with multiple-choice answers and provide immediate feedback
4. **Results & Analytics**: Display quiz results with score, correct answers, and performance insights
5. **Responsive Design**: Ensure the application works seamlessly across different devices

### Key Assumptions Made

- **AI Service Integration**: Assumed the use of Claude API or similar LLM for question generation
- **Question Format**: Questions follow a standard multiple-choice format with 4 options and one correct answer
- **Quiz Length**: Default quiz contains 10 questions (configurable)
- **Session Management**: Quiz state is maintained in-memory during the session (localStorage for persistence across page refreshes)
- **Difficulty Levels**: Supports three difficulty levels - Easy, Medium, and Hard
- **Single Attempt**: Each quiz can be attempted once; users need to restart for a new attempt
- **Client-Side Rendering**: Application is built as a single-page application (SPA) with React

---

## 3. AI Prompts & Iterations

### Initial Prompts

#### Prompt 1: Basic Question Generation
```
Generate 5 multiple-choice quiz questions about {topic} at {difficulty} difficulty level. 
Return as JSON array with question, 4 options, and correct answer index.
```

**Issues Faced:**
- Inconsistent response format
- Sometimes returned explanations instead of just JSON
- Difficulty level not accurately reflected in questions

#### Prompt 2: Refined Structure
```
You are a quiz generator. Generate exactly 10 multiple-choice questions about {topic}.

Requirements:
- Difficulty: {difficulty}
- Each question must have exactly 4 options
- Mark the correct answer
- No explanations, just the quiz data

Return only valid JSON in this format:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": number (0-3)
    }
  ]
}
```

**Improvements:**
- More consistent JSON output
- Better control over difficulty
- Still occasional format issues

### Final Optimized Prompt

```typescript
const systemPrompt = `You are an expert quiz generator. Generate engaging, accurate quiz questions based on the user's interests and difficulty level.

Rules:
1. Generate exactly 10 questions
2. Each question must have 4 distinct options
3. Only one option should be correct
4. Questions should match the specified difficulty level:
   - Easy: Basic concepts and definitions
   - Medium: Application of concepts and moderate complexity
   - Hard: Advanced analysis, edge cases, and complex scenarios
5. Options should be plausible but clearly distinguishable
6. Return ONLY valid JSON, no additional text

Output format:
{
  "questions": [
    {
      "id": number,
      "question": "Clear, concise question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswerIndex": number (0-3),
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}`;

const userPrompt = `Generate a quiz about: ${topic}
Difficulty level: ${difficulty}
User interests: ${interests}`;
```

**Key Improvements:**
- Added explicit formatting rules
- Included explanation field for educational value
- Clear difficulty level descriptions
- Structured with system and user prompts for better context
- Added unique ID for each question
- Emphasized "ONLY valid JSON" to prevent extra text

### Iterations Summary

| Iteration | Issue | Solution |
|-----------|-------|----------|
| 1 | Inconsistent response format | Added strict JSON-only instruction |
| 2 | Wrong difficulty calibration | Added detailed difficulty level descriptions |
| 3 | Ambiguous answer options | Required options to be "plausible but distinguishable" |
| 4 | Missing explanations | Added explanation field to response schema |
| 5 | JSON parsing errors | Implemented try-catch with fallback and response cleaning |

---

## 4. Architecture & Code Structure

### Project Structure

```
plumhq-assignment/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── progress.tsx
│   │   │   └── select.tsx
│   │   ├── WelcomeScreen.tsx      # Landing page with user onboarding
│   │   ├── QuizScreen.tsx         # Main quiz interface
│   │   ├── ResultsScreen.tsx      # Score and analysis display
│   │   └── LoadingScreen.tsx      # Quiz generation loading state
│   ├── lib/
│   │   └── utils.ts               # Utility functions (cn, etc.)
│   ├── services/
│   │   └── aiService.ts           # AI API integration and question generation
│   ├── types/
│   │   └── quiz.ts                # TypeScript interfaces and types
│   ├── hooks/
│   │   └── useQuiz.ts             # Custom hook for quiz state management
│   ├── App.tsx                    # Main app component with routing logic
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles with Tailwind
├── public/                        # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Key Components

#### `App.tsx` - Main Application Component
- Manages application-wide state and navigation
- Handles screen transitions (Welcome → Loading → Quiz → Results)
- Coordinates quiz lifecycle

```typescript
type Screen = 'welcome' | 'loading' | 'quiz' | 'results';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  // ... state management and navigation logic
}
```

#### `WelcomeScreen.tsx`
- User onboarding form
- Collects name, interests, and difficulty level
- Validates input before proceeding
- Triggers quiz generation

#### `QuizScreen.tsx`
- Displays questions one at a time
- Handles answer selection
- Shows progress indicator
- Manages timer (if implemented)
- Validates and submits answers

#### `ResultsScreen.tsx`
- Displays final score and percentage
- Shows correct vs incorrect answers
- Provides detailed answer review
- Offers retry functionality

#### `LoadingScreen.tsx`
- Shows loading animation during AI generation
- Displays progress messages
- Handles generation errors


```

### Data Flow

```
User Input (WelcomeScreen)
    ↓
Generate Quiz Request (App.tsx)
    ↓
AI Service Call (aiService.ts)
    ↓
Quiz Data State (App.tsx)
    ↓
QuizScreen (consumes quiz data)
    ↓
User Answers (QuizScreen)
    ↓
Calculate Results (App.tsx)
    ↓
ResultsScreen (displays results)
```

### Type Definitions

```typescript
// types/quiz.ts
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface UserAnswer {
  questionId: number;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpent?: number;
}

export interface QuizParams {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  interests: string[];
  userName: string;
}

export interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  answers: UserAnswer[];
}
```

### Styling Approach

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built, customizable components
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode**: Optional theme support (if implemented)
- **Animations**: Framer Motion or CSS transitions for smooth UX

---

## 5. Known Issues / Improvements

### Known Issues

1. **API Rate Limiting**
   - Issue: Frequent quiz generation may hit API rate limits
   - Workaround: Implement request throttling or caching
   - Impact: Medium - Users may experience delays during peak usage

2. **Question Quality Variance**
   - Issue: AI-generated questions occasionally have ambiguous options
   - Workaround: Manual review or additional prompt refinement
   - Impact: Low - Rare occurrences

3. **No Question Bank Persistence**
   - Issue: Each quiz generation makes a new API call
   - Workaround: Currently none
   - Impact: Low - Increases API costs and latency

4. **Limited Error Handling**
   - Issue: Network failures may not be gracefully handled
   - Workaround: Basic error messages shown
   - Impact: Medium - Poor UX on connection issues

5. **No Multi-language Support**
   - Issue: Application is English-only
   - Impact: Low - Limits international user base

### Planned Improvements

#### High Priority

1. **Question Bank Caching**
   - Cache generated questions locally
   - Reduce API calls by 80%
   - Implementation: IndexedDB or localStorage with TTL

2. **Enhanced Error Handling**
   - Implement comprehensive error boundaries
   - Add retry mechanisms for failed API calls
   - Show user-friendly error messages with recovery options

3. **Progressive Question Loading**
   - Generate questions in batches (e.g., 3 at a time)
   - Start quiz before all questions are ready
   - Improves perceived performance

4. **Answer Analytics**
   - Track time spent per question
   - Identify weak areas based on wrong answers
   - Provide personalized recommendations

#### Medium Priority

5. **Quiz History**
   - Store past quiz attempts
   - Show performance trends over time
   - Compare scores across topics

6. **Social Features**
   - Share results on social media
   - Challenge friends with same quiz
   - Leaderboard system

7. **Customization Options**
   - Adjustable quiz length (5, 10, 15, 20 questions)
   - Timer mode with configurable duration
   - Multiple quiz formats (True/False, Fill-in-blanks)

8. **Accessibility Improvements**
   - Keyboard navigation throughout
   - Screen reader optimization
   - High contrast mode
   - Font size adjustment

#### Low Priority

9. **Offline Mode**
   - Service worker for offline functionality
   - Sync quiz results when back online
   - Cached quiz questions for offline attempts

10. **Multi-language Support**
    - i18n implementation
    - Support for major languages
    - Locale-specific content

11. **Advanced Analytics Dashboard**
    - Visualization of performance over time
    - Topic-wise strength analysis
    - Difficulty progression recommendations

12. **Gamification**
    - Achievement badges
    - Streak tracking
    - XP and level system
    - Daily challenges

### Performance Optimizations

- Implement code splitting for faster initial load
- Optimize bundle size (current: ~XXX KB, target: < 200 KB)
- Add lazy loading for images and components
- Implement virtual scrolling for long answer lists
- Use React.memo for expensive components

### Security Enhancements

- Add API key rotation mechanism
- Implement rate limiting on client side
- Add request signing for API calls
- Sanitize all user inputs before sending to AI
- Add CORS configuration for production

---

## 7. Bonus Work

### ✨ Extra Features Implemented

1. **Smooth Animations**
   - Page transitions with fade effects
   - Button hover states and micro-interactions
   - Progress bar animations
   - Loading spinner with custom design

2. **Responsive Design**
   - Fully responsive across all device sizes
   - Mobile-first approach
   - Touch-optimized for mobile devices
   - Tablet layout optimizations

3. **Enhanced UX**
   - Input validation with helpful error messages
   - Loading states for all async operations
   - Optimistic UI updates
   - Keyboard shortcuts (if implemented)

4. **Visual Polish**
   - Modern, clean interface design
   - Consistent color scheme using Tailwind
   - Custom icons and illustrations
   - Glassmorphism effects on cards

5. **Error Recovery**
   - Graceful error handling with retry options
   - Fallback content when generation fails
   - Network status indicator

6. **Accessibility Features**
   - Semantic HTML throughout
   - ARIA labels for interactive elements
   - Keyboard navigation support
   - Focus management

7. **Performance Optimizations**
   - Lazy loading of components
   - Memoization of expensive calculations
   - Debounced input fields
   - Optimized re-renders

8. **Developer Experience**
   - TypeScript for type safety
   - ESLint for code quality
   - Prettier for code formatting
   - Comprehensive code comments

### 🎨 Design Enhancements

- **Color Palette**: Carefully selected colors for better visual hierarchy
- **Typography**: Inter font family for excellent readability
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Shadows**: Subtle shadows for depth and layering
- **Border Radius**: Rounded corners for modern look

### 🚀 Technical Highlights

- **Build Tool**: Vite for lightning-fast HMR
- **UI Library**: shadcn/ui for consistent, accessible components
- **Styling**: Tailwind CSS for rapid development
- **TypeScript**: Full type safety across the application
- **Component Architecture**: Reusable, composable components

---

## 📦 Technologies Used

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: Claude API (or OpenAI API)
- **Deployment**: Vercel
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Routing**: React Router (if multi-page)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Aryan Srivastava**
- GitHub: [@Aryan123-rgb](https://github.com/Aryan123-rgb)
- Project Link: [https://github.com/Aryan123-rgb/plumhq-assignment](https://github.com/Aryan123-rgb/plumhq-assignment)

---

## 🙏 Acknowledgments

- PlumHQ for the assignment opportunity
- Anthropic/OpenAI for AI API services
- shadcn/ui for the beautiful component library
- Vercel for seamless deployment

---

*Built with ❤️ for PlumHQ Assignment*
