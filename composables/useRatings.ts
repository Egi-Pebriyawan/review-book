import type { RatingInsert } from "~/types";

/**
 * useRatings Composable
 * Meng-handle proses submission bintang (score rating) oleh pengunjung pasif di halaman detail buku.
 */
export const useRatings = () => {
  const supabase = useSupabaseClient();

  /**
   * Utility Internal: Men-generate "Fingerprint/Sidik Jari" unik string per device user berdasarkan spesifikasi userAgent, bahasa, resolusi monitor, dsb.
   * Ini bukan metode keamanan murni 100%, tapi cukup efektif untuk menahan spam interaksi iseng.
   */
  const getFingerprint = () => {
    const nav = navigator;
    // Menggabungkan environment client browser
    const str = [nav.userAgent, nav.language, screen.width, screen.height, new Date().getTimezoneOffset()].join("|");

    // Membuat hashing bitwise sederhana
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    // Konversi hasil bitwise menjadi bentuk base-36 alfabet (ex. "lk2a3f")
    return Math.abs(hash).toString(36);
  };

  /**
   * Kirim interaksi submit score ke database. 
   * @param bookId target buku
   * @param score angka 1 hingga 5
   */
  const submitRating = async (bookId: string, score: number) => {
    const fingerprint = getFingerprint();

    // Query "UPSERT": Metode database dimana data baru akan di-INSERT (tambah), 
    // namun jika user yang sama (fingerprint+book sama) disubmit ulang, data lama akan ditimpa (UPDATE).
    const { data, error } = await supabase.from("ratings").upsert({ book_id: bookId, score, fingerprint }, { onConflict: "book_id,fingerprint" }).select().single();

    if (error) throw error;
    return data;
  };

  /**
   * Utilitas mengecek secara diam-diam (background call) apakah user di HP yang sama 
   * pernah melakukan rating terhadap buku X.
   * @param bookId id buku referensi
   * @returns number score (jika ditemukan), atau null (jika user baru pertama kali)
   */
  const getUserRating = async (bookId: string) => {
    const fingerprint = getFingerprint(); // Tarik id unik periklanan

    const { data } = await supabase.from("ratings").select("score").eq("book_id", bookId).eq("fingerprint", fingerprint).single();

    return data?.score || null;
  };

  return {
    submitRating,
    getUserRating,
  };
};
