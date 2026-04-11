import type { BookSearchResult } from "~/types";
import { ref } from "vue";

/**
 * useBookSearch Composable
 * Sebagai API Wrapper yang menjembatani Component Vue ke Endpoint Internal-Backend Nuxt API (`/api/book-search`).
 * Digunakan untuk mencari/mengimpor list referensi buku dari public Google Books secara dinamis (live-search).
 */
export const useBookSearch = () => {
  // State manajemen reaktif untuk Component UI
  const results = ref<BookSearchResult[]>([]); // Kumpulan array data buku balasan (respon)
  const isLoading = ref(false); // Flag boolean sebagai indikator UI (ex: nampilkan animasi putaran)
  const error = ref<string | null>(null); // Penampung pesan jika terjadi galat

  /**
   * Fungsi core untuk melempar permintaan pencarian buku dari client ke Nuxt Server.
   * @param query Teks judul/nama author yang di-submit dari input form
   */
  const search = async (query: string) => {
    // Validasi pencegahan API spam di client (minimal 2 kata/karakter)
    if (!query || query.length < 2) {
      results.value = [];
      return;
    }

    isLoading.value = true;
    error.value = null; // Reset sisa pesan error request terdahulu

    try {
      // Menggunakan tool Nuxt internal "$fetch" untuk bypass overhead axios 
      const data = await $fetch<BookSearchResult[]>("/api/book-search", {
        query: { q: query },
      });
      // Menarik array hasil atau mengisi kosong sebagai pengaman akhir
      results.value = data || [];
    } catch (e: any) {
      // Tangkap dan sembunyikan jejak teknis error dengan pesan front-end yang ramah
      error.value = "Gagal mencari buku. Coba lagi.";
      results.value = [];
    } finally {
      // Lepas flag UI Load bagaimanapun state request berakhir (berhasil maupun patah/error)
      isLoading.value = false;
    }
  };

  /**
   * Optimisasi Front-end "Debouncing"
   * Berfungsi untuk menunda eksekusi fetching `search()` sampai interval waktu spesifik (misal 400ms) terlewati.
   * Hal ini mencegah spamming jaringan di mana tiap pengguna mengetik 1 huruf API merespons memanggil server.
   */
  const { useDebounceFn } = useVueuse();
  const debouncedSearch = useDebounceFn(search, 400);

  /**
   * Utility helper mereset array dan error UI (Ex: ketika popup search ditutup).
   */
  const clear = () => {
    results.value = [];
    error.value = null;
  };

  return {
    results,
    isLoading,
    error,
    search,
    debouncedSearch, // Variabel debounce ini yang ditempel ke form @input="debouncedSearch"
    clear,
  };
};
