import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wqjfqkektuwykjqqocho.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_JNoyfDmHpDBJbxRWMb3K7Q_ICHmkJQR";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});