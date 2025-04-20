"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { FeedbackForm } from "@/components/feedback-form";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

interface HistoryEvent {
  text: string;
  html: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
  options: string[];
  isdone: boolean;
  datetoshow: string;
}

const getDayAdjective = () => {
  const adjectives = [
    "magnificent",
    "glorious",
    "wonderful",
    "splendid",
    "delightful",
    "charming",
    "peaceful",
    "energetic",
    "vibrant",
    "inspiring",
  ];
  const today = new Date();
  const dateString = today.toISOString().slice(0, 10);
  const seed = dateString
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return adjectives[seed % adjectives.length];
};

const isWebShareSupported = () => {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    navigator.share !== undefined
  );
};

// Function to convert name to camel case (first letter capitalized, rest lowercase)
const toCamelCase = (name: string): string => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

// Greeting component that uses useSearchParams
function Greeting() {
  const [userName, setUserName] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract name from URL if present
    if (searchParams) {
      const nameParam = searchParams.get("name");
      if (nameParam) {
        setUserName(nameParam);
      }
    }
  }, [searchParams]);

  if (!userName) return null;

  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold rgb-text">
        Hi {toCamelCase(userName)}! Welcome to
      </h2>
      <h2 className="text-3xl font-bold rgb-text mt-1">Brain Tickle</h2>
    </div>
  );
}

export default function Home() {
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<HistoryEvent[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const triviaRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const dayName = today.toLocaleString("en-US", { weekday: "long" });
  const dayAdjective = getDayAdjective();

  useEffect(() => {
    fetchTodayInHistory();
    fetchDailyQuestion();

    // Set initial window dimensions
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Update dimensions on window resize
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchTodayInHistory = async () => {
    console.log("Fetching today in history");
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/history");
      const data = await response.json();
      if (Array.isArray(data)) {
        console.log(data);
        setHistoryEvents(data);
        setCurrentEventIndex(0);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      toast({
        title: "Error",
        description:
          "Failed to load historical event. Please refresh to try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchDailyQuestion = async () => {
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();
      if (data.data) {
        setQuizData(data.data);
        setCurrentQuestionIndex(0);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      toast({
        title: "Error",
        description:
          "Failed to load the daily quiz. Please refresh to try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === quizData[currentQuestionIndex]?.answer) {
      setShowConfetti(true);
      setIsCorrect(true);
      setCompletedQuestions((prev) => prev + 1);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    } else {
      toast({
        title: "Incorrect",
        description: "Try again!",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setIsCorrect(false);
    if (completedQuestions >= quizData.length) {
      return; // Don't proceed if all questions are completed
    }
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex === quizData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const shareContent = async (
    ref: React.RefObject<HTMLDivElement>,
    title: string,
    type: "history" | "quiz"
  ) => {
    if (!ref.current) return;

    try {
      // Create a container with minimum dimensions
      const container = document.createElement("div");
      container.style.width = "600px";
      container.style.minHeight = "400px"; // Changed to minHeight
      container.style.backgroundColor = "#212121";
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.justifyContent = "center";
      container.style.padding = "20px";

      // Create a clone of the element to modify for screenshot
      const clone = ref.current.cloneNode(true) as HTMLElement;
      // Remove the bottom section with buttons
      const bottomSection = clone.querySelector(".border-t");
      if (bottomSection) {
        bottomSection.remove();
      }

      // Style the clone to fit nicely in the container
      clone.style.width = "100%";
      clone.style.height = "auto"; // Allow natural height
      clone.style.overflow = "visible"; // Changed to visible to not cut off content

      // Add the clone to the container
      container.appendChild(clone);

      // Temporarily append container to document for screenshot
      container.style.position = "absolute";
      container.style.left = "-9999px";
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        backgroundColor: "#212121",
        scale: 2,
      });

      // Clean up the temporary elements
      document.body.removeChild(container);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, "image/png");
      });

      // Try to use native sharing if available
      if (isWebShareSupported()) {
        const file = new File(
          [blob],
          type === "history" ? "today-in-history.png" : "daily-quiz.png",
          {
            type: "image/png",
          }
        );

        const shareText =
          type === "history"
            ? "📚 Discovered this fascinating historical event on BrainTickle! Join me in exploring history's most intriguing moments. #HistoryLovers #BrainTickle"
            : "🧠 Just aced this brain teaser on BrainTickle! Can you solve it? Challenge your mind and join the fun! #BrainTickle #BrainTeaser";

        try {
          await navigator.share({
            title: "BrainTickle - Challenge Your Mind",
            text: shareText,
            url: window.location.origin,
            files: [file],
          });
          return;
        } catch (error) {
          console.log(
            "Native sharing failed, falling back to download:",
            error
          );
        }
      }

      // Fallback to download if native sharing is not available or fails
      const filename =
        type === "history" ? "today-in-history.png" : "daily-quiz.png";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Screenshot saved!",
        description: `Your ${
          type === "history" ? "historical event" : "daily quiz"
        } screenshot has been downloaded.`,
        variant: "default",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error creating screenshot:", error);
      toast({
        title: "Error",
        description: "Failed to create screenshot. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const showNextEvent = () => {
    if (historyEvents.length > 0) {
      // Simply move to the next event, looping back to the first one if we're at the end
      setCurrentEventIndex((prevIndex) =>
        prevIndex === historyEvents.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
          tweenDuration={4000}
        />
      )}
      <Header />

      {/* Personalized greeting wrapped in Suspense */}
      <Suspense fallback={null}>
        <Greeting />
      </Suspense>

      <FeedbackForm />

      <style jsx global>{`
        @keyframes glowPulse {
          0% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          100% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
          }
        }
        .glow-card {
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes rgbPulse {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        .rgb-text {
          background: linear-gradient(
            90deg,
            #ff0000,
            #ff7f00,
            #ffff00,
            #00ff00,
            #0000ff,
            #4b0082,
            #8b00ff,
            #ff0000
          );
          background-size: 200% auto;
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          animation: rgbPulse 8s linear infinite;
        }

        @keyframes calendarPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.5;
          }
        }

        .calendar-loader {
          animation: calendarPulse 1.5s ease-in-out infinite;
        }

        .question-loader {
          animation: calendarPulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="grid gap-8 md:grid-cols-2">
        {/* History Section */}
        <div>
          <Card ref={historyRef} className="p-6 bg-black glow-card h-fit">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                Today in History 🗓️
              </h2>
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-4">
                  <div className="calendar-loader text-4xl">🚀</div>
                  <p className="text-gray-400">
                    Time-traveling to another moment...
                  </p>
                </div>
              ) : historyEvents.length > 0 ? (
                <div className="prose dark:prose-invert max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: historyEvents[currentEventIndex].html,
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 space-y-4">
                  <div className="calendar-loader text-4xl">🚀</div>
                  <p className="text-gray-400">
                    Time-traveling to another moment...
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-transparent"
                onClick={showNextEvent}
                disabled={isLoadingHistory || historyEvents.length === 0}
              >
                {isLoadingHistory ? "Loading..." : "Unlock Another Moment ⏰"}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-transparent rounded-full"
                onClick={() =>
                  shareContent(
                    historyRef,
                    "Check out this historical event from Brain Tickle!",
                    "history"
                  )
                }
                disabled={isLoadingHistory}
              >
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Quiz Section */}
        <Card ref={triviaRef} className="p-6 bg-black glow-card h-fit">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">
                Trivia Treat 🍪
              </h2>
              {quizData.length > 0 && (
                <span className="text-sm text-gray-400">
                  {currentQuestionIndex + 1}/{quizData.length}
                </span>
              )}
            </div>
            {quizData.length > 0 ? (
              completedQuestions >= quizData.length ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-2xl font-bold text-white">
                    🎉 Amazing! 🎉
                  </p>
                  <p className="text-lg text-gray-300">
                    You've completed all {quizData.length} questions for today!
                  </p>
                  <p className="text-gray-400 italic">
                    Come back tomorrow for more brain-tickling fun! 🌟
                  </p>
                  <div className="mt-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-transparent rounded-full"
                      onClick={() =>
                        shareContent(
                          triviaRef,
                          "I just completed all today's trivia questions! Can you beat my score? 🧠",
                          "quiz"
                        )
                      }
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-white">
                    {quizData[currentQuestionIndex].question}
                  </p>
                  <RadioGroup
                    value={selectedAnswer}
                    onValueChange={setSelectedAnswer}
                    className="space-y-2"
                    disabled={isCorrect}
                  >
                    {quizData[currentQuestionIndex].options.map(
                      (option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`option-${index}`}
                          />
                          <Label
                            className="text-white"
                            htmlFor={`option-${index}`}
                          >
                            {option}
                          </Label>
                          {isCorrect &&
                            option ===
                              quizData[currentQuestionIndex].answer && (
                              <span className="text-green-400 ml-2">✓</span>
                            )}
                        </div>
                      )
                    )}
                  </RadioGroup>
                  {!isCorrect ? (
                    <Button
                      className="mt-4"
                      onClick={handleSubmit}
                      disabled={!selectedAnswer}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <div className="mt-4">
                      <p className="text-green-400 text-lg font-semibold">
                        Correct! Well done! 🎉
                      </p>
                    </div>
                  )}
                </>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="question-loader text-4xl">❓</div>
                <p className="text-gray-400">Preparing your brain teaser...</p>
              </div>
            )}
          </div>

          {isCorrect && completedQuestions < quizData.length && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800">
              <Button
                onClick={handleNextQuestion}
                className="text-gray-400 hover:text-white hover:bg-transparent"
                variant="ghost"
              >
                Next Question 🧠
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-transparent rounded-full"
                onClick={() =>
                  shareContent(
                    triviaRef,
                    "Try this daily quiz from Today in Focus Share!",
                    "quiz"
                  )
                }
              >
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
