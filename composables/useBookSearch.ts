import type { BookSearchResult } from "~/types";
import { ref } from "vue";

export const useBookSearch = () => {
  const results = ref<BookSearchResult[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const search = async (query: string) => {
    if (!query || query.length < 2) {
      results.value = [];
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<BookSearchResult[]>("/api/book-search", {
        query: { q: query },
      });
      results.value = data || [];
    } catch (e: any) {
      error.value = "Gagal mencari buku. Coba lagi.";
      results.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // Debounced search (tidak fetch setiap ketukan)
  const { useDebounceFn } = useVueuse();
  const debouncedSearch = useDebounceFn(search, 400);

  const clear = () => {
    results.value = [];
    error.value = null;
  };

  return {
    results,
    isLoading,
    error,
    search,
    debouncedSearch,
    clear,
  };
};
