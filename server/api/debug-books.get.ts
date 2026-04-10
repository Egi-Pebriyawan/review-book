import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const url = process.env.NUXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NUXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) {
    return { ok: false, error: "Missing Supabase URL or KEY in environment." };
  }

  const supabase = createClient(url, key);

  try {
    const { data, error } = await supabase.from("books").select("*").limit(10);
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, count: data?.length ?? 0, data };
  } catch (e: any) {
    return { ok: false, error: e.message || String(e) };
  }
});
