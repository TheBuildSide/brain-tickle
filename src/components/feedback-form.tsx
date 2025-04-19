import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "Your feedback has been submitted successfully.",
        });
        setFormData({ name: "", email: "", feedback: "" });
        setIsOpen(false);
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOutsideClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" />}
      <div className="fixed bottom-4 right-4 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              <MessageSquarePlus className="h-5 w-5" />
              <span className="sr-only">Give Feedback</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[90vw] sm:w-[400px] mx-4 sm:mx-0 p-6 relative"
            side="top"
            align="end"
            onPointerDownOutside={handleOutsideClick}
          >
            <Button
              size="icon"
              variant="ghost"
              className={`absolute right-2 top-2 h-8 w-8 ${
                isShaking ? "animate-shake text-red-500" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium leading-none">
                  Give Feedback
                </h4>
                <p className="text-sm text-muted-foreground">
                  Help us improve by sharing your thoughts
                </p>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Your Feedback"
                  value={formData.feedback}
                  onChange={(e) =>
                    setFormData({ ...formData, feedback: e.target.value })
                  }
                  required
                  className="min-h-[120px]"
                />
              </div>
              <Button type="submit" className="w-full h-11">
                Submit Feedback
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-15deg);
          }
          75% {
            transform: rotate(15deg);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
      `}</style>
    </>
  );
}
