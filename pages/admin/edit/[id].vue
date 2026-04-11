<template>
  <div>
    <!-- Loading State -->
    <div v-if="pendingBook" class="animate-pulse space-y-6">
      <div class="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-10 bg-gray-200 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-32 bg-gray-200 rounded w-full"></div>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-else-if="book">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Edit Buku</h1>
          <p class="text-gray-600 mt-1">Ubah informasi buku "{{ book.title }}"</p>
        </div>
        <NuxtLink to="/admin" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
          ← Kembali
        </NuxtLink>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Info -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>

          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Judul Buku <span class="text-red-500">*</span></label>
                <input v-model="form.title" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Slug <span class="text-gray-500">(auto)</span></label>
                <input v-model="form.slug" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readonly />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Penulis <span class="text-red-500">*</span></label>
                <input v-model="form.author" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input v-model="form.isbn" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tahun Terbit</label>
                <input v-model.number="form.published_year" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Halaman</label>
                <input v-model.number="form.pages" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">URL Cover</label>
              <input v-model="form.cover_url" type="url" placeholder="https://..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div v-if="form.cover_url" class="mt-2">
                <img :src="form.cover_url" alt="Cover preview" class="w-24 h-36 object-cover rounded border-2 border-gray-200" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sinopsis</label>
              <textarea v-model="form.description" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
          </div>
        </div>

        <!-- Owner Review -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Review Anda</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Review</label>
              <textarea v-model="form.owner_review" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rating Anda (1-5)</label>
              <input v-model.number="form.owner_rating" type="number" min="1" max="5" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kelebihan (satu per baris)</label>
                <textarea v-model="form.pros_text" rows="4" placeholder="Bagus sekali&#10;Sangat inspiratif" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kekurangan (satu per baris)</label>
                <textarea v-model="form.cons_text" rows="4" placeholder="Agak mahal&#10;Kurang mendalam" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Genre (pisah koma)</label>
              <input v-model="form.genre_text" type="text" placeholder="self-help, produktivitas, psikologi" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <!-- Affiliate Links -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Link Affiliate/E-commerce</h2>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Shopee URL</label>
              <input v-model="form.shopee_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tokopedia URL</label>
              <input v-model="form.tokped_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">TikTok Shop URL</label>
              <input v-model="form.tiktok_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gramedia URL</label>
              <input v-model="form.gramedia_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button type="submit" :disabled="submitting" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {{ submitting ? "Menyimpan..." : "Update Buku" }}
          </button>
          <button type="button" @click="confirmDelete" :disabled="deleting" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
            {{ deleting ? "Menghapus..." : "Hapus Buku" }}
          </button>
        </div>

        <p v-if="successMessage" class="text-green-700">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-700">{{ errorMessage }}</p>
      </form>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Buku Tidak Ditemukan</h2>
      <NuxtLink to="/admin" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Kembali ke Dashboard
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
});

useSeoMeta({
  title: 'Edit Buku — Admin Panel'
});

const route = useRoute();
const bookId = route.params.id as string;

const { getBookBySlug, updateBook, deleteBook, generateSlug } = useBooks();
const supabase = useSupabaseClient();

// Fetch book by ID
const { data: book, pending: pendingBook } = await useAsyncData(`edit-book-${bookId}`, async () => {
  try {
    const { data, error } = await supabase.from('books').select('*').eq('id', bookId).single();
    if (error) throw error;
    return data;
  } catch (e: any) {
    console.error('Error fetching book:', e);
    return null;
  }
});

// Form state
const submitting = ref(false);
const deleting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const form = ref({
  title: '',
  slug: '',
  author: '',
  cover_url: '',
  description: '',
  isbn: '',
  pages: null as number | null,
  published_year: null as number | null,
  owner_review: '',
  owner_rating: null as number | null,
  pros_text: '',
  cons_text: '',
  genre_text: '',
  shopee_url: '',
  tokped_url: '',
  tiktok_url: '',
  gramedia_url: '',
  is_published: true
});

// Initialize form with book data
watch(book, (newBook) => {
  if (newBook) {
    form.value = {
      title: newBook.title || '',
      slug: newBook.slug || '',
      author: newBook.author || '',
      cover_url: newBook.cover_url || '',
      description: newBook.description || '',
      isbn: newBook.isbn || '',
      pages: newBook.pages || null,
      published_year: newBook.published_year || null,
      owner_review: newBook.owner_review || '',
      owner_rating: newBook.owner_rating || null,
      pros_text: (newBook.pros || []).join('\n'),
      cons_text: (newBook.cons || []).join('\n'),
      genre_text: (newBook.genre || []).join(', '),
      shopee_url: newBook.shopee_url || '',
      tokped_url: newBook.tokped_url || '',
      tiktok_url: newBook.tiktok_url || '',
      gramedia_url: newBook.gramedia_url || '',
      is_published: newBook.is_published ?? true
    };
  }
}, { immediate: true });

// Watch title to auto-generate slug
watch(() => form.value.title, (newTitle) => {
  // Only auto-generate if user hasn't manually edited the slug
  if (newTitle && form.value.slug === generateSlug(newBook.value?.title || '')) {
    form.value.slug = generateSlug(newTitle);
  }
});

// Submit form
const handleSubmit = async () => {
  submitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Transform text fields to arrays
    const pros = form.value.pros_text.split('\n').filter(p => p.trim());
    const cons = form.value.cons_text.split('\n').filter(c => c.trim());
    const genre = form.value.genre_text.split(',').map(g => g.trim()).filter(g => g);

    await updateBook(bookId, {
      title: form.value.title,
      slug: form.value.slug,
      author: form.value.author,
      cover_url: form.value.cover_url || null,
      description: form.value.description || null,
      isbn: form.value.isbn || null,
      pages: form.value.pages,
      published_year: form.value.published_year,
      genre: genre.length > 0 ? genre : [],
      pros: pros.length > 0 ? pros : [],
      cons: cons.length > 0 ? cons : [],
      owner_review: form.value.owner_review || null,
      owner_rating: form.value.owner_rating,
      shopee_url: form.value.shopee_url || null,
      tokped_url: form.value.tokped_url || null,
      tiktok_url: form.value.tiktok_url || null,
      gramedia_url: form.value.gramedia_url || null,
      is_published: form.value.is_published
    });

    successMessage.value = '✅ Buku berhasil diupdate!';
    
    // Refresh book data
    await refreshNuxtData(`edit-book-${bookId}`);
  } catch (e: any) {
    errorMessage.value = '❌ Gagal mengupdate buku: ' + (e.message || 'Unknown error');
  } finally {
    submitting.value = false;
  }
};

// Confirm delete
const confirmDelete = async () => {
  if (!confirm('Yakin ingin menghapus buku ini? Tindakan ini tidak bisa dibatalkan.')) {
    return;
  }

  deleting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await deleteBook(bookId);
    alert('Buku berhasil dihapus!');
    await navigateTo('/admin');
  } catch (e: any) {
    errorMessage.value = '❌ Gagal menghapus buku: ' + (e.message || 'Unknown error');
    deleting.value = false;
  }
};
</script>
