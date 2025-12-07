import { useEffect, useState } from "react";
import { Loader2, Sparkles, Cpu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { generateQuizQuestions, GeneratedQuestion } from "@/lib/groq";

interface LoadingScreenProps {
  topic: string;
  numQuestions: number;
  onComplete: (questions: GeneratedQuestion[]) => void;
  onError: (error: string) => void;
}

const LoadingScreen = ({
  topic,
  numQuestions,
  onComplete,
  onError,
}: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("Warming up the AI...");

  useEffect(() => {
    const loadingMessages = [
      "Warming up the AI...",
      "Generating brain teasers...",
      "Consulting the oracle...",
      "Crafting perfect questions...",
      "Almost ready...",
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setCurrentMessage(loadingMessages[messageIndex]);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(90, prev + 5));
    }, 300);

    // Generate questions using AI
    const generateQuestions = async () => {
      try {
        const topicLabel = topic.replace("-", " ");
        const questions = await generateQuizQuestions(topicLabel, numQuestions);
        setProgress(100);
        setTimeout(() => {
          onComplete(questions);
        }, 500);
      } catch (error) {
        console.log("topic", topic);
        console.log("number of questions", numQuestions);
        console.error("Failed to generate questions:", error);
        onError("Failed to generate questions. Please try again.");
      }
    };

    generateQuestions();

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [topic, numQuestions, onComplete, onError]);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md retro-card border-2 animate-scale-in">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          {/* Animated Icon */}
          <div className="relative mx-auto h-24 w-24">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-pulse-glow" />
            <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-card border-2 border-primary/30">
              <Cpu className="h-10 w-10 text-primary animate-float" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-retro-yellow animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -left-1">
              <Sparkles
                className="h-4 w-4 text-retro-pink animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="font-retro text-sm text-primary animate-pulse">
              Generating AI Questions...
            </h2>
            <p className="text-sm text-muted-foreground">{currentMessage}</p>
            <p className="text-xs text-muted-foreground/60">
              Creating {numQuestions} questions about {topic.replace("-", " ")}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <Progress value={progress} className="h-3 border-2 border-border" />
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="font-retro text-lg text-foreground">
                {progress}%
              </span>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  progress > i * 20 ? "bg-primary scale-125" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingScreen;
