import type { RatingInsert } from "~/types";

export const useRatings = () => {
  const supabase = useSupabaseClient();

  // Generate fingerprint sederhana dari browser
  // Bukan 100% akurat tapi cukup untuk mencegah spam rating
  const getFingerprint = () => {
    const nav = navigator;
    const str = [nav.userAgent, nav.language, screen.width, screen.height, new Date().getTimezoneOffset()].join("|");

    // Hash sederhana
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  };

  // Submit rating (dari pengunjung)
  const submitRating = async (bookId: string, score: number) => {
    const fingerprint = getFingerprint();

    // Upsert: kalau sudah pernah rating, update nilainya
    const { data, error } = await supabase.from("ratings").upsert({ book_id: bookId, score, fingerprint }, { onConflict: "book_id,fingerprint" }).select().single();

    if (error) throw error;
    return data;
  };

  // Cek apakah user sudah pernah rating buku ini
  const getUserRating = async (bookId: string) => {
    const fingerprint = getFingerprint();

    const { data } = await supabase.from("ratings").select("score").eq("book_id", bookId).eq("fingerprint", fingerprint).single();

    return data?.score || null;
  };

  return {
    submitRating,
    getUserRating,
  };
};
