import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const DURATION = 4500;

export function StoryViewer({ slides, topic }: { slides: string[]; topic: string }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIndex(0);
    setProgress(0);
    setPlaying(true);
  }, [slides]);

  useEffect(() => {
    if (!playing || slides.length === 0) return;
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / DURATION) * 100);
      setProgress(p);
      if (p >= 100) {
        setProgress(0);
        setIndex((i) => (i + 1 < slides.length ? i + 1 : i));
        if (index + 1 >= slides.length - 1) setPlaying(false);
      }
    }, 50);
    return () => clearInterval(id);
  }, [playing, index, slides]);

  if (!slides.length) return null;

  const go = (dir: -1 | 1) => {
    setProgress(0);
    setIndex((i) => Math.max(0, Math.min(slides.length - 1, i + dir)));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Progress bars */}
      <div className="flex gap-1 mb-4">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full gradient-hero transition-all"
              style={{
                width: i < index ? "100%" : i === index ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
        Story · {topic}
      </div>

      <div className="relative flex-1 overflow-hidden rounded-3xl gradient-hero p-[1px] shadow-glow">
        <div className="relative h-full w-full rounded-3xl overflow-hidden bg-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {/* Background image */}
              <img
                src={slideImage(topic, index)}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover scale-105"
                loading="eager"
              />
              {/* Blur + dark gradient overlays for readability */}
              <div className="absolute inset-0 backdrop-blur-[2px] bg-black/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/30 mix-blend-overlay" />
            </motion.div>
          </AnimatePresence>

          {/* Foreground text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${index}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
              className="relative z-10 flex h-full flex-col justify-end p-8 md:p-12"
            >
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/20">
                Slide {index + 1} of {slides.length}
              </div>
              <p className="text-xl md:text-2xl leading-relaxed font-medium text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] max-w-3xl">
                {slides[index]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Button variant="outline" size="icon" onClick={() => go(-1)} disabled={index === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {playing ? "Pause" : "Play"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIndex(0);
              setProgress(0);
              setPlaying(true);
            }}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Replay
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => go(1)}
          disabled={index === slides.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Deterministic, topic-aware background per slide using Unsplash Source.
function slideImage(topic: string, index: number) {
  const seed = encodeURIComponent(
    `${topic.toLowerCase().replace(/\s+/g, "-")}-${index}`,
  );
  const query = encodeURIComponent(
    `${topic},abstract,technology,gradient`.replace(/\s+/g, ","),
  );
  return `https://source.unsplash.com/1600x900/?${query}&sig=${seed}`;
}