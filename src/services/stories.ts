import { supabase } from "./supabase";
import { generateStorySlides, generateAnswer } from "@/utils/ai";

export type Story = {
  id: string;
  user_id: string;
  topic: string;
  content: string;
  created_at: string;
};

export type QuestionRow = {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  created_at: string;
};

export async function createStory(userId: string, topic: string) {
  const slides = await generateStorySlides(topic);
  const content = JSON.stringify(slides);
  const { data, error } = await supabase
    .from("stories")
    .insert({ user_id: userId, topic, content })
    .select()
    .single();
  if (error) {
    // Fallback: return local story object so UI still works if table is missing
    return {
      id: crypto.randomUUID(),
      user_id: userId,
      topic,
      content,
      created_at: new Date().toISOString(),
    } as Story;
  }
  return data as Story;
}

export async function fetchStories(userId: string): Promise<Story[]> {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return [];
  return (data ?? []) as Story[];
}

export async function askQuestion(userId: string, question: string) {
  const answer = await generateAnswer(question);
  const { data, error } = await supabase
    .from("questions")
    .insert({ user_id: userId, question, answer })
    .select()
    .single();
  if (error) {
    return {
      id: crypto.randomUUID(),
      user_id: userId,
      question,
      answer,
      created_at: new Date().toISOString(),
    } as QuestionRow;
  }
  return data as QuestionRow;
}

export function parseSlides(content: string): string[] {
  try {
    const v = JSON.parse(content);
    if (Array.isArray(v)) return v;
  } catch {
    /* ignore */
  }
  return content.split(/\n(?=Slide\s*\d+)/i).map((s) => s.trim()).filter(Boolean);
}