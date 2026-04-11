<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4">Review Buku Jujur & Mendalam</h1>
        <p class="text-xl text-gray-300 mb-8">Temukan buku terbaik untuk dibaca. Review detail, rating akurat, dan rekomendasi yang tepat.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/books" class="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"> Lihat Semua Buku </NuxtLink>
          <a v-if="profile?.saweria_url" :href="profile.saweria_url" target="_blank" class="px-8 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"> ☕ Traktir Kopi </a>
        </div>
      </div>
    </section>

    <!-- Reading Stats -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-gray-900">{{ totalBooksRead }}</div>
          <div class="text-sm text-gray-600 mt-1">Buku Dibaca</div>
        </div>
        <div class="text-center border-l-0 md:border-l border-r-0 md:border-r border-gray-200">
          <div class="text-3xl font-bold text-gray-900">{{ profile?.yearly_target || 24 }}</div>
          <div class="text-sm text-gray-600 mt-1">Target Tahun {{ currentYear }}</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-gray-900">{{ readingProgress.toFixed(0) }}%</div>
          <div class="text-sm text-gray-600 mt-1">Progress Target</div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-blue-600 h-2 rounded-full transition-all" :style="{ width: `${Math.min(readingProgress, 100)}%` }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Books -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Buku Terbaru Dibaca</h2>
        <NuxtLink to="/books" class="text-blue-600 hover:text-blue-700 font-medium transition-colors"> Lihat Semua → </NuxtLink>
      </div>

      <div v-if="pending" class="grid gap-4">
        <div v-for="i in 5" :key="i" class="animate-pulse flex gap-4 p-4 border border-gray-200 rounded-xl">
          <div class="w-16 h-24 bg-gray-200 rounded-lg"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      <div v-else-if="latestBooks.length === 0" class="text-center py-12">
        <p class="text-gray-600">Belum ada buku yang direview.</p>
      </div>

      <div v-else class="grid gap-4">
        <BookCard v-for="book in latestBooks" :key="book.id" :book="book" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Review Buku — Temukan Buku Terbaik untuk Dibaca",
  description: "Review buku jujur dan mendalam. Rating akurat, rekomendasi tepat untuk membantu Anda memilih buku yang berkualitas.",
});

const supabase = useSupabaseClient();
const { getBooks } = useBooks();

// Fetch profile
const { data: profile } = await useAsyncData("profile-home", async () => {
  const { data } = await supabase.from("profile").select("*").single();
  return data;
});

// Fetch latest 5 books
const { data: latestBooks, pending } = await useAsyncData("latest-books", async () => {
  const books = await getBooks({ limit: 5 });
  return books;
});

// Calculate reading stats
const totalBooksRead = computed(() => {
  return latestBooks.value?.filter((b) => b.read_status === "read").length || 0;
});

const currentYear = new Date().getFullYear();

const readingProgress = computed(() => {
  const target = profile.value?.yearly_target || 24;
  if (target === 0) return 0;
  return (totalBooksRead.value / target) * 100;
});
</script>
