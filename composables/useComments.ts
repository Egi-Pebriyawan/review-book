import type { Comment, CommentInsert } from "~/types";

export const useComments = () => {
  const supabase = useSupabaseClient();

  const getComments = async (bookId: string) => {
    const { data, error } = await supabase.from("comments").select("id, created_at, name, content").eq("book_id", bookId).eq("is_approved", true).eq("is_spam", false).order("created_at", { ascending: false });

    if (error) throw error;
    return data as Comment[];
  };

  const getPendingComments = async () => {
    const { data, error } = await supabase.from("comments").select("*, books(title, slug)").eq("is_approved", false).eq("is_spam", false).order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  };

  const submitComment = async (comment: CommentInsert) => {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        ...comment,
        is_approved: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Comment;
  };

  const approveComment = async (id: string) => {
    const { error } = await supabase.from("comments").update({ is_approved: true }).eq("id", id);
    if (error) throw error;
  };

  const markAsSpam = async (id: string) => {
    const { error } = await supabase.from("comments").update({ is_spam: true }).eq("id", id);
    if (error) throw error;
  };

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
