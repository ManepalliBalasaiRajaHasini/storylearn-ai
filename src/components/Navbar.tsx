import { Link } from "@tanstack/react-router";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-hero shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            StoryLearn <span className="gradient-text">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link to="/dashboard">
            <Button size="sm" className="gradient-hero text-white border-0 shadow-glow hover:opacity-90">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}