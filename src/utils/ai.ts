// Mock AI generator. Swap with a real LLM call later (Lovable AI Gateway / OpenAI / Gemini).
// Kept deterministic-ish so demos feel grounded.

const STORY_TEMPLATES: Record<string, string[]> = {
  default: [
    "Meet Alex — a curious BTech student who just stumbled onto the concept of {topic}. Everyone keeps saying it's tough, but Alex decides to see it as a puzzle waiting to be solved.",
    "Alex opens a notebook and writes: 'What is {topic}, really?' In plain words, it's a pattern we use to make sense of real-world problems — like recognizing how a song has verses and a chorus.",
    "The first twist: Alex learns the core idea behind {topic}. It's built on a small set of rules. Once you see those rules, everything else starts falling into place.",
    "Alex tries a tiny example. Not the textbook monster — just a baby version. It works. The intuition clicks. Confidence: +10.",
    "Now the real world shows up. Alex uses {topic} to fix a messy problem — faster, cleaner, smarter. The professor nods. The code compiles on the first try.",
    "Moral of the story: {topic} isn't scary. It's a tool. Learn the rule, try the baby example, then unleash it on real problems. You've got this.",
  ],
};

export async function generateStorySlides(topic: string): Promise<string[]> {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 900));
  const t = topic.trim() || "learning";
  return STORY_TEMPLATES.default.map((s) => s.replaceAll("{topic}", t));
}

export async function generateAnswer(question: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 700));
  const q = question.trim();
  return [
    `**Quick take:** ${q}`,
    ``,
    `**In simple words:** Think of this like a recipe. First you gather the ingredients (the concepts), then you follow the steps (the logic), and finally you taste-test (the examples).`,
    ``,
    `**Key points:**`,
    `• Identify the core idea behind the question.`,
    `• Break it down into 2–3 small sub-problems.`,
    `• Solve the smallest one first, then combine.`,
    ``,
    `**Example:** Try it on the simplest possible input — if it works there, scale up.`,
    ``,
    `**Pro tip:** If you can explain it out loud in 30 seconds, you've understood it. If not, go one layer deeper.`,
  ].join("\n");
}