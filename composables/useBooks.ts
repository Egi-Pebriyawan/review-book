import type { Book, BookInsert, BookUpdate } from "~/types";

export const useBooks = () => {
  const supabase = useSupabaseClient();

  const getBooks = async (options?: { genre?: string; status?: string; limit?: number }) => {
    let query: any = supabase.from("books").select("*").eq("is_published", true).order("created_at", { ascending: false });

    if (options?.genre) {
      query = query.contains("genre", [options.genre]);
    }
    if (options?.status) {
      query = query.eq("read_status", options.status);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Book[];
  };

  const getBookBySlug = async (slug: string) => {
    const { data, error } = await supabase.from("books").select("*").eq("slug", slug).eq("is_published", true).single();
    if (error) throw error;
    return data as Book;
  };

  const getAllBooks = async () => {
    const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data as Book[];
  };

  const createBook = async (book: BookInsert) => {
    const { data, error } = await supabase.from("books").insert(book).select().single();
    if (error) throw error;
    return data as Book;
  };

  const updateBook = async (id: string, updates: BookUpdate) => {
    const { data, error } = await supabase.from("books").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data as Book;
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) throw error;
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  return {
    getBooks,
    getBookBySlug,
    getAllBooks,
    createBook,
    updateBook,
    deleteBook,
    generateSlug,
  };
};
