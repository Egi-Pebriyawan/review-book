<template>
  <div v-if="book" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <div class="mb-6 text-sm">
      <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">Beranda</NuxtLink>
      <span class="text-gray-400 mx-2">/</span>
      <NuxtLink to="/books" class="text-gray-600 hover:text-gray-900">Daftar Buku</NuxtLink>
      <span class="text-gray-400 mx-2">/</span>
      <span class="text-gray-900 font-medium">{{ book.title }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left: Cover & Metadata -->
      <div class="lg:col-span-1">
        <!-- Cover -->
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden mb-4">
          <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title" class="w-full object-cover" loading="lazy" />
          <div v-else class="w-full h-80 bg-gray-100 flex items-center justify-center text-gray-400">No Cover</div>
        </div>

        <!-- Metadata -->
        <div class="bg-white rounded-xl shadow-sm border p-6 space-y-3">
          <div>
            <div class="text-xs text-gray-500 uppercase font-medium">Penulis</div>
            <div class="text-gray-900 font-medium">{{ book.author }}</div>
          </div>
          <div v-if="book.isbn">
            <div class="text-xs text-gray-500 uppercase font-medium">ISBN</div>
            <div class="text-gray-900">{{ book.isbn }}</div>
          </div>
          <div v-if="book.published_year">
            <div class="text-xs text-gray-500 uppercase font-medium">Tahun Terbit</div>
            <div class="text-gray-900">{{ book.published_year }}</div>
          </div>
          <div v-if="book.pages">
            <div class="text-xs text-gray-500 uppercase font-medium">Jumlah Halaman</div>
            <div class="text-gray-900">{{ book.pages }} halaman</div>
          </div>
          <div v-if="book.language">
            <div class="text-xs text-gray-500 uppercase font-medium">Bahasa</div>
            <div class="text-gray-900 uppercase">{{ book.language }}</div>
          </div>
          <div v-if="book.genre && book.genre.length > 0">
            <div class="text-xs text-gray-500 uppercase font-medium mb-2">Genre</div>
            <div class="flex flex-wrap gap-1">
              <GenreBadge v-for="g in book.genre" :key="g" :genre="g" />
            </div>
          </div>
        </div>

        <!-- Affiliate Links -->
        <div v-if="hasAffiliateLinks" class="bg-white rounded-xl shadow-sm border p-6 mt-4">
          <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Beli Buku Ini
          </h3>
          <div class="space-y-2">
            <!-- Shopee -->
            <a v-if="book.shopee_url" :href="book.shopee_url" target="_blank" class="flex items-center gap-3 px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
              <img src="@/assets/shopee.svg" alt="Shopee" class="w-5 h-5" />
              <span class="font-semibold text-orange-700">Beli di Shopee</span>
              <svg class="w-4 h-4 ml-auto text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <!-- Tokopedia -->
            <a v-if="book.tokped_url" :href="book.tokped_url" target="_blank" class="flex items-center gap-3 px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
              <img src="@/assets/tokopedia.svg" alt="Tokopedia" class="w-5 h-5" />
              <span class="font-semibold text-green-700">Beli di Tokopedia</span>
              <svg class="w-4 h-4 ml-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <!-- TikTok Shop -->
            <a v-if="book.tiktok_url" :href="book.tiktok_url" target="_blank" class="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              <img src="@/assets/tiktok.svg" alt="TikTok" class="w-5 h-5" />
              <span class="font-semibold text-gray-900">Beli di TikTok Shop</span>
              <svg class="w-4 h-4 ml-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <!-- Gramedia -->
            <a v-if="book.gramedia_url" :href="book.gramedia_url" target="_blank" class="flex items-center gap-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
              <svg class="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm7 1.5L18.5 9H14a1 1 0 01-1-1V3.5z" />
              </svg>
              <span class="font-semibold text-red-700">Beli di Gramedia</span>
              <svg class="w-4 h-4 ml-auto text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Right: Title, Synopsis, Review, Ratings, Comments -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Title & Rating -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ book.title }}</h1>
          <p class="text-lg text-gray-600 mb-4">oleh {{ book.author }}</p>

          <div class="flex items-center gap-2 mb-4">
            <StarRating :rating="book.avg_rating || 0" :count="book.total_ratings || 0" show-count show-label />
          </div>

          <div class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {{ book.total_comments || 0 }} komentar
          </div>
        </div>

        <!-- Synopsis -->
        <div v-if="book.description" class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Sinopsis</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ book.description }}</p>
        </div>

        <!-- Owner Review -->
        <div v-if="book.owner_review" class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Review Saya</h2>
          <div class="prose max-w-none">
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ book.owner_review }}</p>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <span class="text-sm font-medium text-gray-700">Rating saya:</span>
            <StarRating :rating="book.owner_rating || 0" show-label />
          </div>
        </div>

        <!-- Pros & Cons -->
        <div v-if="(book.pros && book.pros.length > 0) || (book.cons && book.cons.length > 0)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Pros -->
          <div v-if="book.pros && book.pros.length > 0" class="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 class="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Kelebihan
            </h3>
            <ul class="space-y-2">
              <li v-for="(pro, index) in book.pros" :key="index" class="flex items-start gap-2 text-green-800">
                <span class="mt-1.5 w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></span>
                <span>{{ pro }}</span>
              </li>
            </ul>
          </div>

          <!-- Cons -->
          <div v-if="book.cons && book.cons.length > 0" class="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 class="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              Kekurangan
            </h3>
            <ul class="space-y-2">
              <li v-for="(con, index) in book.cons" :key="index" class="flex items-start gap-2 text-red-800">
                <span class="mt-1.5 w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></span>
                <span>{{ con }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Visitor Rating -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Beri Rating</h2>
          <p class="text-sm text-gray-600 mb-4">Bagaimana pendapat Anda tentang buku ini?</p>

          <div v-if="ratingSubmitted" class="text-center py-4">
            <div class="flex items-center justify-center gap-2 mb-3">
              <StarRating :rating="visitorRating" show-label />
            </div>
            <svg class="w-12 h-12 mx-auto text-green-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-green-700 font-medium">Terima kasih! Rating Anda sudah tercatat.</p>
          </div>

          <div v-else>
            <StarRating v-model="visitorRating" :interactive="true" show-label />
            <button @click="submitVisitorRating" :disabled="!visitorRating || submittingRating" class="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
              {{ submittingRating ? "Menyimpan..." : "Kirim Rating" }}
            </button>
          </div>
        </div>

        <!-- Comments -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Komentar</h2>

          <!-- Comment Form -->
          <form @submit.prevent="submitComment" class="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama <span class="text-red-500">*</span></label>
              <input v-model="commentForm.name" type="text" required minlength="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama Anda" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-gray-500">(opsional)</span></label>
              <input v-model="commentForm.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@example.com" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Komentar <span class="text-red-500">*</span></label>
              <textarea
                v-model="commentForm.content"
                required
                minlength="5"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tulis komentar Anda..."
              ></textarea>
            </div>

            <button type="submit" :disabled="submittingComment" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {{ submittingComment ? "Mengirim..." : "Kirim Komentar" }}
            </button>

            <p v-if="commentSubmitted" class="text-green-700 text-sm">✓ Komentar Anda berhasil dikirim! Komentar akan tampil setelah disetujui.</p>
          </form>

          <!-- Comments List -->
          <div v-if="comments.length === 0" class="text-center py-8 text-gray-600">Belum ada komentar. Jadilah yang pertama berkomentar!</div>

          <div v-else class="space-y-4">
            <div v-for="comment in comments" :key="comment.id" class="p-4 border border-gray-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-900">{{ comment.name }}</span>
                <span class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</span>
              </div>
              <p class="text-gray-700">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Not Found -->
  <div v-else-if="!pending" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
    <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h2 class="text-2xl font-bold text-gray-900 mb-2">Buku Tidak Ditemukan</h2>
    <p class="text-gray-600 mb-4">Maaf, buku yang Anda cari tidak ada atau sudah dihapus.</p>
    <NuxtLink to="/books" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"> Kembali ke Daftar Buku </NuxtLink>
  </div>

  <!-- Loading -->
  <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      <div class="h-64 bg-gray-200 rounded"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Halaman Detail Tunggal Buku (Single Dynamic Slug Route)
 * Dieksekusi merambat pada routing dinamis `/books/[nama-unik-buku]`.
 * Merupakan inti dari ekosistem aplikasi di mana *frontend* memproses banyak API Composables sekaligus:
 * 1. Tarik Data Utama Buku & Rating Pemilik
 * 2. Tarik Daftar Komentar (Sistem Chat Reader)
 * 3. Tarik Status External Affiliate (E-commerce Link Output)
 * 4. Fungsi Input Feedback (Form Rating & Write Comment)
 */
const route = useRoute();
const slug = route.params.slug as string;

// Dynamic SEO meta - will be updated when book data loads
const seoTitle = ref("Detail Review Buku");
const seoDescription = ref("Baca review lengkap buku");

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
});

const { getBookBySlug } = useBooks();
const { getComments, submitComment: addComment } = useComments();
const { submitRating, getUserRating } = useRatings();
const supabase = useSupabaseClient();

// Fetch book with error handling
const { data: book, pending } = await useAsyncData(`book-${slug}`, async () => {
  try {
    const b = await getBookBySlug(slug);

    // Update SEO meta with book data
    if (b) {
      seoTitle.value = `${b.title} — Detail Review Buku`;
      seoDescription.value = `Baca review lengkap untuk buku ${b.title} oleh ${b.author}. Lihat rating, kelebihan, kekurangan, dan komentar pembaca.`;
    }

    return b;
  } catch (e: any) {
    console.error("Error fetching book:", e);
    return null;
  }
});

// Fetch comments with error handling
const { data: comments } = await useAsyncData(`comments-${slug}`, async () => {
  if (!book.value) return [];

  try {
    const cmts = await getComments(book.value.id);
    return cmts;
  } catch (e: any) {
    console.error("Error fetching comments:", e);
    return [];
  }
});

// Visitor rating
const visitorRating = ref(0);
const ratingSubmitted = ref(false);
const submittingRating = ref(false);

// Check if user already rated
onMounted(async () => {
  if (book.value) {
    const existingRating = await getUserRating(book.value.id);
    if (existingRating) {
      visitorRating.value = existingRating;
      ratingSubmitted.value = true;
    }
  }
});

// Submit visitor rating
const submitVisitorRating = async () => {
  if (!book.value || !visitorRating.value || submittingRating.value) return;

  submittingRating.value = true;
  try {
    await submitRating(book.value.id, visitorRating.value);
    ratingSubmitted.value = true;
    // Refresh book data to get updated avg_rating
    await refreshNuxtData(`book-${slug}`);
  } catch (e) {
    alert("Gagal mengirim rating. Coba lagi.");
  } finally {
    submittingRating.value = false;
  }
};

// Comment form
const commentForm = ref({
  name: "",
  email: "",
  content: "",
});

const submittingComment = ref(false);
const commentSubmitted = ref(false);

// Submit comment
const submitComment = async () => {
  if (!book.value || submittingComment.value) return;

  submittingComment.value = true;
  try {
    await addComment({
      book_id: book.value.id,
      name: commentForm.value.name,
      email: commentForm.value.email || null,
      content: commentForm.value.content,
    });

    commentSubmitted.value = true;
    commentForm.value = { name: "", email: "", content: "" };

    // Refresh comments after a delay (waiting for approval)
    setTimeout(() => {
      commentSubmitted.value = false;
    }, 5000);
  } catch (e) {
    alert("Gagal mengirim komentar. Coba lagi.");
  } finally {
    submittingComment.value = false;
  }
};

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Check if has affiliate links
const hasAffiliateLinks = computed(() => {
  if (!book.value) return false;
  return !!(book.value.shopee_url || book.value.tokped_url || book.value.tiktok_url || book.value.gramedia_url);
});
</script>
