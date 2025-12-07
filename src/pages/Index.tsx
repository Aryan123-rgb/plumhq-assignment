import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import TopicSelectionScreen from "@/components/TopicSelectionScreen";
import LoadingScreen from "@/components/LoadingScreen";
import QuizScreen from "@/components/QuizScreen";
import ResultsScreen from "@/components/ResultsScreen";
import { GeneratedQuestion } from "@/lib/groq";
import { toast } from "sonner";

type ViewType = "topicSelection" | "loading" | "quiz" | "results";

interface QuizState {
  selectedTopics: string[];
  numQuestions: number;
  answers: Record<string, string>;
  questions: GeneratedQuestion[];
}

const Index = () => {
  const [view, setView] = useState<ViewType>("topicSelection");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [quizState, setQuizState] = useState<QuizState>({
    selectedTopics: [],
    numQuestions: 5,
    answers: {},
    questions: [],
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleGoHome = () => {
    setQuizState({
      selectedTopics: [],
      numQuestions: 5,
      answers: {},
      questions: [],
    });
    setView("topicSelection");
  };

  const handleStartQuiz = (topics: string[], numQuestions: number) => {
    setQuizState((prev) => ({
      ...prev,
      selectedTopics: topics,
      numQuestions,
      answers: {},
      questions: [],
    }));
    setView("loading");
  };

  const handleLoadingComplete = (questions: GeneratedQuestion[]) => {
    setQuizState((prev) => ({
      ...prev,
      questions,
    }));
    setView("quiz");
  };

  const handleLoadingError = (error: string) => {
    toast.error(error);
    setView("topicSelection");
  };

  const handleQuizFinish = (answers: Record<string, string>) => {
    setQuizState((prev) => ({
      ...prev,
      answers,
    }));
    setView("results");
  };

  const handleRetake = () => {
    setQuizState((prev) => ({
      ...prev,
      answers: {},
    }));
    setView("loading");
  };

  const handleChangeTopics = () => {
    setQuizState({
      selectedTopics: [],
      numQuestions: 5,
      answers: {},
      questions: [],
    });
    setView("topicSelection");
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar theme={theme} onToggleTheme={toggleTheme} onGoHome={handleGoHome} />
      
      <main className="container mx-auto max-w-4xl">
        {view === "topicSelection" && (
          <TopicSelectionScreen onStartQuiz={handleStartQuiz} />
        )}
        {view === "loading" && (
          <LoadingScreen 
            topic={quizState.selectedTopics[0] || "general"} 
            numQuestions={quizState.numQuestions}
            onComplete={handleLoadingComplete}
            onError={handleLoadingError}
          />
        )}
        {view === "quiz" && (
          <QuizScreen 
            questions={quizState.questions}
            onFinish={handleQuizFinish} 
          />
        )}
        {view === "results" && (
          <ResultsScreen
            questions={quizState.questions}
            answers={quizState.answers}
            onRetake={handleRetake}
            onChangeTopics={handleChangeTopics}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
