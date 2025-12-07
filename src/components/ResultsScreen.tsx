import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Trophy, RefreshCw, ArrowLeft, CheckCircle2, XCircle, Lightbulb, Target, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GeneratedQuestion, generateQuizSummary, QuizSummary } from "@/lib/groq";

interface ResultsScreenProps {
  questions: GeneratedQuestion[];
  answers: Record<string, string>;
  onRetake: () => void;
  onChangeTopics: () => void;
}

const ResultsScreen = ({ questions, answers, onRetake, onChangeTopics }: ResultsScreenProps) => {
  const [aiSummary, setAiSummary] = useState<QuizSummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  // Calculate actual score
  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctAnswer
  ).length;
  const totalQuestions = questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  // Trigger confetti on mount
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = score >= 70 
      ? ['#22d3ee', '#f472b6', '#a855f7', '#22c55e'] 
      : ['#22d3ee', '#f472b6'];

    const frame = () => {
      confetti({
        particleCount: score >= 70 ? 4 : 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: score >= 70 ? 4 : 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [score]);

  // Generate AI summary
  useEffect(() => {
    const getSummary = async () => {
      setIsLoadingSummary(true);
      const summary = await generateQuizSummary(questions, answers);
      setAiSummary(summary);
      setIsLoadingSummary(false);
    };

    getSummary();
  }, [questions, answers]);

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 animate-scale-in">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          {/* Trophy Icon */}
          <div className="mx-auto relative inline-block">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-retro-yellow/20 retro-glow">
              <Trophy className="h-10 w-10 text-retro-yellow" />
            </div>
          </div>

          <h1 className="font-retro text-lg leading-relaxed retro-text-gradient">
            Quiz Complete!
          </h1>
        </div>

        {/* Score Summary */}
        <div className="rounded-xl bg-muted/50 border-2 border-border p-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Your Score</span>
          </div>
          <div className="font-retro text-4xl retro-text-gradient">
            {score}%
          </div>
          <p className="text-sm text-foreground">
            You answered <span className="font-bold text-retro-green">{correctCount}</span> out of{" "}
            <span className="font-bold">{totalQuestions}</span> questions correctly.
          </p>
        </div>

        {/* AI Summary */}
        <div className="rounded-xl bg-primary/5 border-2 border-primary/20 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">AI Summary</span>
          </div>
          {isLoadingSummary ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
              <span className="text-sm text-muted-foreground">Generating personalized feedback...</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-foreground">
              {aiSummary?.summary}
            </p>
          )}
        </div>

        {/* Per-Question Feedback */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-retro-yellow" />
            Question Breakdown
          </h3>
          <div className="space-y-3">
            {questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <div
                  key={question.id}
                  className={`rounded-lg border-2 p-4 transition-all ${
                    isCorrect
                      ? "border-retro-green/40 bg-retro-green/10"
                      : "border-destructive/40 bg-destructive/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-retro-green mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                    )}
                    <div className="space-y-2 min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug">
                        {question.question}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={isCorrect ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Your answer:{" "}
                          <span className="font-medium text-foreground">
                            {userAnswer || "Not answered"}
                          </span>
                        </span>
                      </div>
                      {!isCorrect && (
                        <p className="text-xs text-muted-foreground">
                          Correct answer: <span className="font-medium text-retro-green">{question.correctAnswer}</span>
                        </p>
                      )}
                      {/* Explanation */}
                      <div className="mt-2 p-3 rounded-lg bg-background/50 border border-border/50">
                        <p className="text-xs text-muted-foreground italic">
                          <span className="font-semibold not-italic">Explanation:</span> {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-retro-pink" />
            Suggestions for Improvement
          </h3>
          {isLoadingSummary ? (
            <div className="flex items-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">Loading suggestions...</span>
            </div>
          ) : (
            <ul className="space-y-2">
              {aiSummary?.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-retro-cyan font-bold">→</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onChangeTopics}
            className="flex-1 border-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Change Topics
          </Button>
          <Button
            onClick={onRetake}
            className="flex-1 border-2 border-primary/50 retro-glow"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Retake Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
