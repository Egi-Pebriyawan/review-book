<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Kelola Buku</h1>
      <p class="text-gray-600 mt-1">Edit atau hapus buku yang sudah ada</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 5" :key="i" class="animate-pulse bg-white rounded-xl shadow-sm border p-4 flex gap-4">
        <div class="w-16 h-24 bg-gray-200 rounded-lg"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Books List -->
    <div v-else-if="books.length === 0" class="bg-white rounded-xl shadow-sm border p-12 text-center">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum Ada Buku</h3>
      <NuxtLink to="/admin/tambah" class="text-blue-600 hover:text-blue-700 font-medium">Tambah buku pertama →</NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div v-for="book in books" :key="book.id" class="bg-white rounded-xl shadow-sm border p-4">
        <div class="flex gap-4">
          <!-- Cover -->
          <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title" class="w-16 h-24 object-cover rounded-lg" />
          <div v-else class="w-16 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">No Cover</div>

          <!-- Info -->
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-1">{{ book.title }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ book.author }}</p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>⭐ {{ book.avg_rating?.toFixed(1) || '0.0' }}</span>
              <span>💬 {{ book.total_comments || 0 }}</span>
              <span :class="book.is_published ? 'text-green-600' : 'text-gray-400'">
                {{ book.is_published ? '✓ Published' : '○ Draft' }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2">
            <NuxtLink :to="`/admin/edit/${book.id}`" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center">
              ✏️ Edit
            </NuxtLink>
            <NuxtLink :to="`/books/${book.slug}`" target="_blank" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium text-center">
              👁️ Lihat
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
});

useSeoMeta({
  title: 'Kelola Buku — Admin Panel'
});

const { getAllBooks } = useBooks();

const { data: books, pending } = await useAsyncData('admin-all-books', async () => {
  const allBooks = await getAllBooks();
  return allBooks;
});
</script>
