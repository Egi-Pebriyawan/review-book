<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Daftar Buku</h1>
      <p class="text-gray-600">Koleksi buku yang sudah saya baca dan review</p>
    </div>

    <!-- Genre Filter -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-sm font-medium text-gray-700">Filter Genre:</span>
        <button
          @click="
            selectedGenre = '';
            currentPage = 1;
          "
          :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors', selectedGenre === '' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
        >
          Semua
        </button>
        <button
          v-for="genre in allGenres"
          :key="genre"
          @click="
            selectedGenre = genre;
            currentPage = 1;
          "
          :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors', selectedGenre === genre ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
        >
          {{ genre }}
        </button>
      </div>
    </div>

    <!-- Book Count -->
    <div class="mb-4 text-sm text-gray-600">
      Menampilkan <span class="font-semibold text-gray-900">{{ paginatedBooks.length }}</span> dari <span class="font-semibold text-gray-900">{{ totalBooks }}</span> buku
    </div>

    <!-- Books Grid -->
    <div v-if="pending" class="grid gap-4">
      <div v-for="i in 6" :key="i" class="animate-pulse flex gap-4 p-4 border border-gray-200 rounded-xl">
        <div class="w-16 h-24 bg-gray-200 rounded-lg"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <div v-else-if="paginatedBooks.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
      <p class="text-gray-600 text-lg">Tidak ada buku dengan genre ini.</p>
    </div>

    <div v-else class="grid gap-4">
      <BookCard v-for="book in paginatedBooks" :key="book.id" :book="book" />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
      <button @click="currentPage--" :disabled="currentPage === 1" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">← Sebelumnya</button>

      <div class="flex items-center gap-1">
        <button v-for="page in visiblePages" :key="page" @click="currentPage = page" :class="['px-3 py-2 rounded-lg transition-colors', currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50']">
          {{ page }}
        </button>
      </div>

      <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Selanjutnya →</button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Halaman Katalog Buku (Sistem Library)
 * Tampil ketika user berlayar ke root URL `/books`.
 * Mengeksekusi penarikan list panjang (All Books) dan menyediakan fungsionalitas UI logika 
 * semacam pemfilteran (Genre Filter System) yang dapat dipilah klik secara spesifik oleh client.
 */
definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Daftar Buku — Koleksi Review Lengkap",
  description: "Lihat semua koleksi buku yang sudah direview. Filter berdasarkan genre untuk menemukan buku yang Anda sukai.",
});

const { getBooks, getAllGenres } = useBooks();

const BOOKS_PER_PAGE = 12;

// Fetch all genres (server-side optimized)
const { data: allGenres, pending: genresPending } = await useAsyncData("all-genres", async () => {
  const genres = await getAllGenres();
  return genres;
});

// Pagination state
const currentPage = ref(1);
const selectedGenre = ref("");

// Fetch books with pagination
const { data: booksData, pending } = await useAsyncData(
  `books-page-${currentPage.value}-${selectedGenre.value}`,
  async () => {
    const offset = (currentPage.value - 1) * BOOKS_PER_PAGE;
    const result = await getBooks({
      genre: selectedGenre.value || undefined,
      limit: BOOKS_PER_PAGE,
      offset,
    });
    return result;
  },
  { watch: [currentPage, selectedGenre] },
);

const paginatedBooks = computed(() => booksData.value?.data || []);
const totalBooks = computed(() => booksData.value?.total || 0);
const totalPages = computed(() => Math.ceil(totalBooks.value / BOOKS_PER_PAGE));

// Visible pages for pagination
const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});
</script>
