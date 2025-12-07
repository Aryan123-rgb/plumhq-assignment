import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const groq = new Groq({
  apiKey: API_KEY!,
  dangerouslyAllowBrowser: true // Enable client-side usage
});

export interface GeneratedQuestion {
  id: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizSummary {
  summary: string;
  suggestions: string[];
}

export async function generateQuizQuestions(
  topic: string,
  numQuestions: number
): Promise<GeneratedQuestion[]> {
  const prompt = `Generate ${numQuestions} multiple choice quiz questions about "${topic}". 
  
Return ONLY a valid JSON array with no additional text or markdown. Each question should have this exact structure:
[
  {
    "question": "The question text",
    "choices": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "The correct option text (must match one of the choices exactly)",
    "explanation": "A brief 1-2 sentence explanation of why this is the correct answer"
  }
]

Make sure:
- Each question has exactly 4 choices
- The correctAnswer matches one of the choices exactly
- Questions are varied and interesting
- Explanations are educational and concise`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4096
    });

    const text = response.choices[0]?.message?.content || "";
    console.log('response', response);
    
    // Parse the JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    
    return questions.map((q: any, index: number) => ({
      id: `q${index + 1}`,
      question: q.question,
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

export async function generateQuizSummary(
  questions: GeneratedQuestion[],
  answers: Record<string, string>
): Promise<QuizSummary> {
  const questionResults = questions.map((q) => {
    const userAnswer = answers[q.id] || "Not answered";
    const isCorrect = userAnswer === q.correctAnswer;
    return {
      question: q.question,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
    };
  });

  const correctCount = questionResults.filter((r) => r.isCorrect).length;
  const totalQuestions = questions.length;

  const prompt = `Based on this quiz performance, provide a personalized summary and suggestions.

Quiz Results:
- Score: ${correctCount}/${totalQuestions} (${Math.round((correctCount / totalQuestions) * 100)}%)
- Questions and answers:
${questionResults.map((r, i) => `
Question ${i + 1}: ${r.question}
User's answer: ${r.userAnswer}
Correct answer: ${r.correctAnswer}
Result: ${r.isCorrect ? "Correct" : "Incorrect"}
`).join("\n")}

Return ONLY a valid JSON object with no additional text or markdown:
{
  "summary": "A 2-3 sentence personalized summary of their performance, mentioning strengths and areas to improve",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}

Make the suggestions specific and actionable based on what they got wrong.`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048
    });

    const text = response.choices[0]?.message?.content || "";
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error generating summary:", error);
    return {
      summary: `You scored ${correctCount} out of ${totalQuestions} questions correctly. Keep practicing to improve your knowledge!`,
      suggestions: [
        "Review the explanations for questions you got wrong",
        "Study the topic in more depth",
        "Try taking the quiz again to reinforce learning",
      ],
    };
  }
}