import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, MessageCircleQuestion, Zap, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();

  const go = () => {
    const t = topic.trim();
    navigate({ to: "/dashboard", search: t ? { topic: t } : {} });
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[900px] gradient-hero opacity-20 blur-3xl rounded-full pointer-events-none" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Built for BTech & college students
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Learn smarter through{" "}
            <span className="gradient-text">stories</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Turn any concept into a short, engaging story — delivered as slides you actually
            remember. Stuck? Ask and get instant, structured answers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl glass p-2 shadow-card"
          >
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              placeholder="Try: Recursion, DBMS Normalization, TCP handshake…"
              className="border-0 bg-transparent focus-visible:ring-0 text-base"
            />
            <Button
              onClick={go}
              className="gradient-hero text-white border-0 shadow-glow hover:opacity-90 gap-1"
            >
              Generate <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

          <div className="mt-4 text-xs text-muted-foreground">
            No signup needed to try. Save your library by creating an account.
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: BookOpen,
            title: "Story-based slides",
            desc: "Every topic becomes a 6-slide story. Auto-playing, like Instagram, but you learn.",
          },
          {
            icon: MessageCircleQuestion,
            title: "Instant doubt solver",
            desc: "Ask any question and get a clean, structured answer — no scrolling StackOverflow.",
          },
          {
            icon: Zap,
            title: "Built for exam week",
            desc: "Revise complex concepts in under 60 seconds. Your brain will thank you.",
          },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl glass p-6 shadow-card"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-hero shadow-glow mb-4">
              <f.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
