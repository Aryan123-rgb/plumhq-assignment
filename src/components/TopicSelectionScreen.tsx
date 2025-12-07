import { useState } from "react";
import { Sparkles, Zap, Brain, Leaf, TrendingUp, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TOPICS = [
  { id: "technology", label: "Technology", icon: Zap },
  { id: "science", label: "Science", icon: Brain },
  { id: "wellness", label: "Wellness", icon: Leaf },
  { id: "tech-trends", label: "Tech Trends", icon: TrendingUp },
  { id: "productivity", label: "Productivity", icon: Clock },
  { id: "history", label: "History", icon: BookOpen },
];

const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 10;

interface TopicSelectionScreenProps {
  onStartQuiz: (topics: string[], numQuestions: number) => void;
}

const TopicSelectionScreen = ({ onStartQuiz }: TopicSelectionScreenProps) => {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [error, setError] = useState("");

  const handleTopicChange = (value: string) => {
    setSelectedTopic(value);
    setError("");
  };

  const handleNumQuestionsChange = (value: number) => {
    const clamped = Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, value));
    setNumQuestions(clamped);
  };

  const handleSubmit = () => {
    if (!selectedTopic) {
      setError("Please select a topic");
      return;
    }
    if (numQuestions < MIN_QUESTIONS || numQuestions > MAX_QUESTIONS) {
      setError(`Please enter between ${MIN_QUESTIONS} and ${MAX_QUESTIONS} questions`);
      return;
    }
    onStartQuiz([selectedTopic], numQuestions);
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-lg retro-card border-2 animate-fade-in">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 retro-glow animate-float">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-retro text-xl leading-relaxed retro-text-gradient">
            Start a Quiz
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Pick a topic and let AI generate questions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Topic Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Topic</Label>
            <Select value={selectedTopic} onValueChange={handleTopicChange}>
              <SelectTrigger className="w-full border-2">
                <SelectValue placeholder="Choose a topic..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-2 border-border">
                {TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <SelectItem key={topic.id} value={topic.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{topic.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Number of Questions */}
          <div className="space-y-3">
            <Label htmlFor="num-questions" className="text-sm font-medium">
              Number of Questions
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 border-2"
                onClick={() => handleNumQuestionsChange(numQuestions - 1)}
                disabled={numQuestions <= MIN_QUESTIONS}
              >
                -
              </Button>
              <Input
                id="num-questions"
                type="number"
                min={MIN_QUESTIONS}
                max={MAX_QUESTIONS}
                value={numQuestions}
                onChange={(e) => handleNumQuestionsChange(parseInt(e.target.value) || MIN_QUESTIONS)}
                className="text-center border-2 font-medium"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 border-2"
                onClick={() => handleNumQuestionsChange(numQuestions + 1)}
                disabled={numQuestions >= MAX_QUESTIONS}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose between {MIN_QUESTIONS} and {MAX_QUESTIONS} questions
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-destructive font-medium animate-pixel-shake">
              ⚠️ {error}
            </p>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full h-12 font-retro text-xs tracking-wide border-2 border-primary/50 retro-glow transition-all hover:scale-[1.02]"
            size="lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicSelectionScreen;
