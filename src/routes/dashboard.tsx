import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Send, Sparkles, Loader2, MessageCircleQuestion } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StoryViewer } from "@/components/StoryViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createStory,
  askQuestion,
  parseSlides,
  type QuestionRow,
} from "@/services/stories";
import { DEFAULT_USER_ID } from "@/services/user";

type Search = { topic?: string };

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    topic: typeof s.topic === "string" ? s.topic : undefined,
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const search = Route.useSearch();

  const [tab, setTab] = useState<"story" | "doubt">("story");
  const [topic, setTopic] = useState(search.topic ?? "");
  const [slides, setSlides] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState("");
  const [busy, setBusy] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<QuestionRow | null>(null);
  const [askBusy, setAskBusy] = useState(false);

  useEffect(() => {
    if (search.topic && !slides.length && !busy) {
      void handleGenerate(search.topic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async (t?: string) => {
    const val = (t ?? topic).trim();
    if (!val) return;
    setBusy(true);
    try {
      const story = await createStory(DEFAULT_USER_ID, val);
      setSlides(parseSlides(story.content));
      setCurrentTopic(story.topic);
    } finally {
      setBusy(false);
    }
  };

  const handleAsk = async () => {
    const q = question.trim();
    if (!q) return;
    setAskBusy(true);
    try {
      const row = await askQuestion(DEFAULT_USER_ID, q);
      setAnswer(row);
    } finally {
      setAskBusy(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Hey learner 👋
          </h1>
          <p className="text-muted-foreground">What do you want to understand today?</p>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Left: controls */}
          <aside className="space-y-4">
            <div className="rounded-2xl glass p-2 flex gap-1">
              <button
                onClick={() => setTab("story")}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  tab === "story"
                    ? "gradient-hero text-white shadow-glow"
                    : "hover:bg-muted"
                }`}
              >
                <BookOpen className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                Story
              </button>
              <button
                onClick={() => setTab("doubt")}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  tab === "doubt"
                    ? "gradient-hero text-white shadow-glow"
                    : "hover:bg-muted"
                }`}
              >
                <MessageCircleQuestion className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                Doubt
              </button>
            </div>

            {tab === "story" ? (
              <div className="rounded-2xl glass p-5 shadow-card space-y-3">
                <div>
                  <div className="text-sm font-semibold mb-1">Generate a story</div>
                  <p className="text-xs text-muted-foreground">
                    Enter any concept. We'll turn it into 6 engaging slides.
                  </p>
                </div>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  placeholder="e.g. Recursion, OSI Model…"
                />
                <Button
                  disabled={busy || !topic.trim()}
                  onClick={() => handleGenerate()}
                  className="w-full gradient-hero text-white border-0 shadow-glow hover:opacity-90"
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Crafting your story…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Story
                    </>
                  )}
                </Button>
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-2">Quick picks</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Recursion", "DBMS Normalization", "TCP/IP", "Big-O Notation"].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setTopic(s);
                          void handleGenerate(s);
                        }}
                        className="text-xs rounded-full border px-3 py-1 hover:bg-muted transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl glass p-5 shadow-card space-y-3">
                <div>
                  <div className="text-sm font-semibold mb-1">Ask a doubt</div>
                  <p className="text-xs text-muted-foreground">
                    Get a clear, structured explanation.
                  </p>
                </div>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What's confusing you?"
                  rows={5}
                />
                <Button
                  disabled={askBusy || !question.trim()}
                  onClick={handleAsk}
                  className="w-full gradient-hero text-white border-0 shadow-glow hover:opacity-90"
                >
                  {askBusy ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Thinking…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Ask StoryLearn AI
                    </>
                  )}
                </Button>
              </div>
            )}
          </aside>

          {/* Right: output */}
          <section className="min-h-[560px]">
            {tab === "story" ? (
              slides.length > 0 ? (
                <StoryViewer slides={slides} topic={currentTopic} />
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="Your story slides will appear here"
                  desc="Enter a topic on the left and watch it turn into a scrollable story."
                />
              )
            ) : answer ? (
              <motion.div
                key={answer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl glass p-8 shadow-card"
              >
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Answer
                </div>
                <div className="text-lg font-semibold mb-4">{answer.question}</div>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-foreground">
                  {answer.answer}
                </div>
              </motion.div>
            ) : (
              <EmptyState
                icon={MessageCircleQuestion}
                title="Your answer will appear here"
                desc="Type a question on the left to get a structured, easy-to-read explanation."
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="h-full min-h-[500px] rounded-3xl glass shadow-card flex items-center justify-center p-12">
      <div className="text-center max-w-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-hero shadow-glow mb-4">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-lg font-semibold">{title}</div>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
  );
}