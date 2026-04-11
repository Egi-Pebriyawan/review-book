import type { Comment, CommentInsert } from "~/types";

/**
 * useComments Composable
 * Logika ini khusus digunakan untuk mengoperasikan data table "comments" seperti
 * menerima, menampilkan, dan menghapus komentar user ke buku.
 */
export const useComments = () => {
  const supabase = useSupabaseClient();

  /**
   * Menarik daftar komentar publik yang SUDAH DISETUJUI dan bukan SPAM.
   * Sifat query diurutkan dari yang terbaru (descending).
   * @param bookId uuid dari referensi buku target
   * @returns Daftar komentar yang dipublikasikan.
   */
  const getComments = async (bookId: string) => {
    const { data, error } = await supabase.from("comments").select("id, created_at, name, content").eq("book_id", bookId).eq("is_approved", true).eq("is_spam", false).order("created_at", { ascending: false });

    if (error) throw error;
    return data as Comment[];
  };

  /**
   * Otoritas Admin: Melihat list komentar yang masih MENGGANTUNG (pending approval)
   * Dilengkapi query relasi (join) untuk mengambil field title web/buku.
   * @returns Komentar yang belum di-approve.
   */
  const getPendingComments = async () => {
    const { data, error } = await supabase.from("comments").select("*, books(title, slug)").eq("is_approved", false).eq("is_spam", false).order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  };

  /**
   * Action dari User/Pengunjung untuk meninggalkan komentar pada halaman detail buku.
   * Komentar secara default masuk sebagai UNAPPROVED agar melalui proses review admin dulu.
   * @param comment Object isian data komentar.
   */
  const submitComment = async (comment: CommentInsert) => {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        ...comment,
        is_approved: false, // Force status as unapproved
      })
      .select()
      .single();

    if (error) throw error;
    return data as Comment;
  };

  /**
   * Action dari Admin: Merubah status komentar sehingga bisa tayang di web.
   * @param id uuid komentar
   */
  const approveComment = async (id: string) => {
    const { error } = await supabase.from("comments").update({ is_approved: true }).eq("id", id);
    if (error) throw error;
  };

  /**
   * Action dari Admin: Melabeli sebuah komentar toxic/mengganggu sebagai sampah.
   * @param id uuid komentar
   */
  const markAsSpam = async (id: string) => {
    const { error } = await supabase.from("comments").update({ is_spam: true }).eq("id", id);
    if (error) throw error;
  };

  /**
   * Mengapus seutuhnya komentar dari pangkalan database.
   * @param id uuid komentar
   */
  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) throw error;
  };

  return {
    getComments,
    getPendingComments,
    submitComment,
    approveComment,
    markAsSpam,
    deleteComment,
  };
};
