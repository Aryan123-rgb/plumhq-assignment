import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GeneratedQuestion } from "@/lib/groq";

interface QuizScreenProps {
  questions: GeneratedQuestion[];
  onFinish: (answers: Record<string, string>) => void;
}

const QuizScreen = ({ questions, onFinish }: QuizScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onFinish(answers);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const selectedAnswer = answers[currentQuestion.id];

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 animate-fade-in">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="font-medium text-primary">
              {answeredCount}/{totalQuestions} answered
            </span>
          </div>
          <Progress value={progress} className="h-2 border border-border" />
        </div>

        {/* Question */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold leading-relaxed pt-1">
              {currentQuestion.question}
            </h2>
          </div>
        </div>

        {/* Options */}
        <RadioGroup
          value={selectedAnswer || ""}
          onValueChange={handleAnswer}
          className="space-y-3"
        >
          {currentQuestion.choices.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index);
            const isSelected = selectedAnswer === option;

            return (
              <div key={option} className="relative">
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={`
                    flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4
                    transition-all duration-200 hover:scale-[1.01]
                    ${isSelected
                      ? "border-primary bg-primary/10 text-foreground shadow-md"
                      : "border-border bg-muted/30 hover:border-muted-foreground/40 hover:bg-muted/50"
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 font-retro text-xs
                      ${isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card"
                      }
                    `}
                  >
                    {isSelected ? <Check className="h-4 w-4" /> : optionLetter}
                  </span>
                  <span className="font-medium">{option}</span>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="flex-1 border-2"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className={`flex-1 border-2 transition-all ${
              isLastQuestion
                ? "bg-retro-green hover:bg-retro-green/90 border-retro-green/50"
                : "border-primary/50"
            }`}
          >
            {isLastQuestion ? (
              <>
                Finish Quiz
                <Check className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Question Indicators */}
        <div className="flex justify-center gap-2 pt-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`
                h-3 w-3 rounded-full transition-all duration-200
                ${i === currentIndex
                  ? "bg-primary scale-125"
                  : answers[q.id]
                    ? "bg-retro-green"
                    : "bg-muted hover:bg-muted-foreground/40"
                }
              `}
              aria-label={`Go to question ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
