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
        <button @click="selectedGenre = ''" :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors', selectedGenre === '' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
          Semua
        </button>
        <button v-for="genre in allGenres" :key="genre" @click="selectedGenre = genre" :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors', selectedGenre === genre ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
          {{ genre }}
        </button>
      </div>
    </div>

    <!-- Book Count -->
    <div class="mb-4 text-sm text-gray-600">
      Menampilkan <span class="font-semibold text-gray-900">{{ filteredBooks.length }}</span> dari <span class="font-semibold text-gray-900">{{ allBooks.length }}</span> buku
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

    <div v-else-if="filteredBooks.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
      <p class="text-gray-600 text-lg">Tidak ada buku dengan genre ini.</p>
    </div>

    <div v-else class="grid gap-4">
      <BookCard v-for="book in filteredBooks" :key="book.id" :book="book" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

useSeoMeta({
  title: 'Daftar Buku — Koleksi Review Lengkap',
  description: 'Lihat semua koleksi buku yang sudah direview. Filter berdasarkan genre untuk menemukan buku yang Anda sukai.'
});

const { getBooks } = useBooks();
const supabase = useSupabaseClient();

// Fetch all books
const { data: allBooks, pending } = await useAsyncData('all-books', async () => {
  const books = await getBooks();
  return books;
});

// Extract all unique genres
const allGenres = computed(() => {
  if (!allBooks.value) return [];
  const genreSet = new Set<string>();
  allBooks.value.forEach(book => {
    if (book.genre) {
      book.genre.forEach(g => genreSet.add(g));
    }
  });
  return Array.from(genreSet).sort();
});

// Selected genre filter
const selectedGenre = ref('');

// Filtered books
const filteredBooks = computed(() => {
  if (!allBooks.value) return [];
  if (!selectedGenre.value) return allBooks.value;
  return allBooks.value.filter(book => book.genre?.includes(selectedGenre.value));
});
</script>
