<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Tambah Buku Baru</h1>
      <p class="text-gray-600 mt-1">Cari buku dari Google Books API atau isi manual</p>
    </div>

    <!-- Step 1: Search -->
    <div class="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Step 1: Cari Buku</h2>
      
      <div class="relative mb-4">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Ketik judul buku, penulis, atau ISBN..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div v-if="isSearching" class="absolute right-3 top-3">
          <svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="grid gap-3 max-h-96 overflow-y-auto">
        <div
          v-for="(book, index) in searchResults"
          :key="index"
          @click="selectBook(book)"
          class="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
        >
          <img
            v-if="book.cover_url"
            :src="book.cover_url"
            :alt="book.title"
            class="w-16 h-24 object-cover rounded"
            loading="lazy"
          />
          <div v-else class="w-16 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
            No Cover
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-1">{{ book.title }}</h3>
            <p class="text-sm text-gray-600 mb-1">{{ book.author }}</p>
            <p v-if="book.published_year" class="text-xs text-gray-500">{{ book.published_year }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="searchQuery && !isSearching && searchQuery.length >= 2" class="text-center py-8 text-gray-600">
        Tidak ada buku ditemukan
      </div>

      <div class="mt-4 text-center">
        <button @click="skipToManual" class="text-blue-600 hover:text-blue-700 font-medium">
          atau isi form manual →
        </button>
      </div>
    </div>

    <!-- Step 2: Form -->
    <div v-if="showForm" class="bg-white rounded-xl shadow-sm border p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Step 2: Detail Buku</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Info -->
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
            <img :src="form.cover_url" alt="Cover preview" class="w-24 h-36 object-cover rounded" />
          </div>
        </div>

        <!-- Synopsis -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sinopsis</label>
          <textarea v-model="form.description" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <!-- Owner Review -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Review Anda</label>
          <textarea v-model="form.owner_review" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rating Anda (1-5)</label>
          <input v-model.number="form.owner_rating" type="number" min="1" max="5" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Pros & Cons -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kelebihan (satu per baris)</label>
            <textarea v-model="form.pros_text" rows="4" placeholder="Bagus sekali&#10;Sangat inspiratif&#10;Mudah dipahami" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kekurangan (satu per baris)</label>
            <textarea v-model="form.cons_text" rows="4" placeholder="Agak mahal&#10;Kurang mendalam" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
        </div>

        <!-- Genre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Genre (pisah koma)</label>
          <input v-model="form.genre_text" type="text" placeholder="self-help, produktivitas, psikologi" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Affiliate Links -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Link Affiliate/E-commerce</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs text-gray-600 mb-1">Shopee URL</label>
              <input v-model="form.shopee_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Tokopedia URL</label>
              <input v-model="form.tokped_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">TikTok Shop URL</label>
              <input v-model="form.tiktok_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Gramedia URL</label>
              <input v-model="form.gramedia_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex gap-3 pt-4 border-t">
          <button type="submit" :disabled="submitting" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {{ submitting ? "Menyimpan..." : "Simpan Buku" }}
          </button>
          <button type="button" @click="resetForm" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Reset
          </button>
        </div>

        <p v-if="successMessage" class="text-green-700">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-700">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
});

useSeoMeta({
  title: 'Tambah Buku — Admin Panel'
});

const { createBook, generateSlug } = useBooks();

// Search state
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
let searchTimeout: NodeJS.Timeout | null = null;

// Form state
const showForm = ref(false);
const submitting = ref(false);
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
  gramedia_url: ''
});

// Debounced search
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  searchTimeout = setTimeout(async () => {
    try {
      const results = await $fetch<any[]>('/api/book-search', {
        query: { q: searchQuery.value }
      });
      searchResults.value = results || [];
    } catch (e) {
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  }, 400);
};

// Select book from search
const selectBook = (book: any) => {
  form.value.title = book.title || '';
  form.value.author = book.author || '';
  form.value.cover_url = book.cover_url || '';
  form.value.description = book.description || '';
  form.value.isbn = book.isbn || '';
  form.value.pages = book.pages || null;
  form.value.published_year = book.published_year || null;
  form.value.genre_text = (book.genre || []).join(', ');
  form.value.slug = generateSlug(book.title || '');
  showForm.value = true;
  
  // Scroll to form
  setTimeout(() => {
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }, 100);
};

// Skip to manual form
const skipToManual = () => {
  showForm.value = true;
  setTimeout(() => {
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }, 100);
};

// Watch title to auto-generate slug
watch(() => form.value.title, (newTitle) => {
  if (newTitle && !form.value.slug) {
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

    await createBook({
      title: form.value.title,
      slug: form.value.slug,
      author: form.value.author,
      cover_url: form.value.cover_url || null,
      description: form.value.description || null,
      isbn: form.value.isbn || null,
      pages: form.value.pages,
      published_year: form.value.published_year,
      language: 'id',
      genre: genre.length > 0 ? genre : [],
      pros: pros.length > 0 ? pros : [],
      cons: cons.length > 0 ? cons : [],
      owner_review: form.value.owner_review || null,
      owner_rating: form.value.owner_rating,
      shopee_url: form.value.shopee_url || null,
      tokped_url: form.value.tokped_url || null,
      tiktok_url: form.value.tiktok_url || null,
      gramedia_url: form.value.gramedia_url || null,
      is_published: true
    });

    successMessage.value = '✅ Buku berhasil ditambahkan!';
    
    // Reset after 2 seconds
    setTimeout(() => {
      resetForm();
    }, 2000);
  } catch (e: any) {
    errorMessage.value = '❌ Gagal menyimpan buku: ' + (e.message || 'Unknown error');
  } finally {
    submitting.value = false;
  }
};

// Reset form
const resetForm = () => {
  form.value = {
    title: '',
    slug: '',
    author: '',
    cover_url: '',
    description: '',
    isbn: '',
    pages: null,
    published_year: null,
    owner_review: '',
    owner_rating: null,
    pros_text: '',
    cons_text: '',
    genre_text: '',
    shopee_url: '',
    tokped_url: '',
    tiktok_url: '',
    gramedia_url: ''
  };
  showForm.value = false;
  searchQuery.value = '';
  searchResults.value = [];
  successMessage.value = '';
  errorMessage.value = '';
};
</script>
