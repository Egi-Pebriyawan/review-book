import type { Book, BookInsert, BookUpdate } from "~/types";

/**
 * useBooks Composable
 * Mengelola semua interaksi database yang berkaitan dengan koleksi "Buku".
 * Melakukan panggilan real-time ke Supabase PostgreSQL database.
 */
export const useBooks = () => {
  // Inisialisasi client dari modul Supabase Nuxt
  const supabase = useSupabaseClient();

  /**
   * Mengambil daftar buku yang dipublikasi (is_published = true).
   * Mendukung filter genre, status baca, paginasi (limit & offset).
   * @param options Object opsi untuk filter dan limitasi query.
   * @returns { data: Book[], total: number } Daftar buku dan jumlah total keseluruhan di database.
   */
  const getBooks = async (options?: { genre?: string; status?: string; limit?: number; offset?: number }) => {
    // Memulai query dasar: hanya ambil buku yang status 'is_published' bernilai true.
    let query: any = supabase.from("books").select("*", { count: "exact" }).eq("is_published", true).order("created_at", { ascending: false });

    // Tambahkan filter spesifikasi genre jika ada
    if (options?.genre) {
      query = query.contains("genre", [options.genre]);
    }
    // Filter berdasarkan status baca (read, plan, reading)
    if (options?.status) {
      query = query.eq("read_status", options.status);
    }
    // Batasi jumlah pengambilan (limit) misal 10 data per halaman
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    // Loncat data (offset) untuk kebutuhan paginasi halaman berikutnya
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    // Eksekusi query
    const { data, error, count } = await query;
    if (error) throw error; // Lempar error ke UI agar bisa di-handle try-catch
    return { data: data as Book[], total: count || 0 };
  };

  /**
   * Mengambil 1 buku spesifik berdasarkan slug URL-nya.
   * @param slug Nama buku dalam format web-safe (contoh: "harry-potter-1")
   * @returns {Book} Objek buku tunggal.
   */
  const getBookBySlug = async (slug: string) => {
    const { data, error } = await supabase.from("books").select("*").eq("slug", slug).eq("is_published", true).single();
    if (error) throw error;
    return data as Book;
  };

  /**
   * Mengambil SELURUH buku yang ada di database tanpa filter is_published.
   * Biasanya digunakan untuk keperluan dashboard admin.
   * @returns {Book[]} Seluruh daftar buku.
   */
  const getAllBooks = async () => {
    const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data as Book[];
  };

  /**
   * Mengambil semua unit 'genre' yang ada di seluruh buku yang dipublikasi.
   * Melakukan filter agar tidak ada genre duplikat yang ditampilkan di UI.
   * @returns {string[]} Array strings yang berisi kategori unik.
   */
  const getAllGenres = async () => {
    const { data, error } = await supabase.from("books").select("genre").eq("is_published", true);
    if (error) throw error;

    // Memanfaatkan keunikan tipe data 'Set' untuk menghindari duplikasi nilai genre
    const genreSet = new Set<string>();
    data?.forEach((book) => {
      // Jika buku memiliki properti genre bertipe array, masukkan satu persatu ke dalam Set
      if (book.genre && Array.isArray(book.genre)) {
        book.genre.forEach((g) => genreSet.add(g));
      }
    });

    // Kembalikan sebagai Array lalu urutkan sesuai abjad A-Z
    return Array.from(genreSet).sort();
  };

  /**
   * Memasukkan data buku baru ke dalam tabel Supabase.
   * @param book Objek buku (tipe BookInsert)
   * @returns {Book} record data buku yang baru saja tersimpan.
   */
  const createBook = async (book: BookInsert) => {
    const { data, error } = await supabase.from("books").insert(book).select().single();
    if (error) throw error;
    return data as Book;
  };

  /**
   * Memperbarui informasi pada buku yang sudah ada.
   * @param id uuid Target buku
   * @param updates Data parsial buku yang baru (BookUpdate)
   * @returns {Book} data buku versi paling baru setelah diperbarui.
   */
  const updateBook = async (id: string, updates: BookUpdate) => {
    const { data, error } = await supabase.from("books").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data as Book;
  };

  /**
   * Menghapus buku secara permanen dari database.
   * @param id uuid
   */
  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) throw error;
  };

  /**
   * Utility helper: Membuat slug URL otomatis dari sebuah string text biasa.
   * Contoh: "Belajar Coding" -> "belajar-coding"
   * @param title Judul text buku.
   * @returns {string} Text slug yang dirapikan (huruf kecil semua, spasi jadi strip).
   */
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter spesial selain alphanumerik, spasi, dan dash
      .replace(/\s+/g, "-") // Ganti semua whitespace jadi strip '-'
      .replace(/-+/g, "-") // Mencegah double strip '--'
      .trim(); // Hapus whitespace / strip sisa di awal/akhir
  };

  // Mengembalikan objek supaya dapat di-(destructuring) oleh file vue component
  return {
    getBooks,
    getBookBySlug,
    getAllBooks,
    getAllGenres,
    createBook,
    updateBook,
    deleteBook,
    generateSlug,
  };
};
