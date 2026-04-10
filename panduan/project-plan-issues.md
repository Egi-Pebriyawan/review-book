# Project Plan: Book Review Website

## Tech Stack: Nuxt terbaru + Tailwind CSS terbaru + Supabase

### Format: GitHub Issues — untuk Junior Developer / AI Agent

---

> **Cara pakai dokumen ini:**
> Copy setiap blok "ISSUE" ke GitHub Issues. Setiap issue dirancang **self-contained** —
> pelaksana tidak perlu tanya apapun, semua konteks sudah ada di dalam issue.
> Kerjakan **berurutan sesuai nomor**. Jangan loncat issue karena setiap issue bergantung pada issue sebelumnya.

---

## PHASE 1 — PROJECT SETUP

> Estimasi: 2–3 jam

---

### ISSUE #01 — Init project nuxt terbaru

**Konteks:**
Kita membangun website book review pribadi. Tech stack: nuxt terbaru, Tailwind CSS, Supabase.
Ini adalah issue pertama — membuat project dari nol.

**Langkah:**

```bash
# 1. Buat project nuxt terbaru
npx nuxi@latest init book-review
cd book-review

# 2. Install semua dependencies sekaligus
npm install @nuxtjs/supabase @nuxtjs/tailwindcss @nuxtjs/image
npm install vueuse lucide-vue-next zod
npm install -D @types/node

# 3. Jalankan dev server untuk verifikasi berhasil
npm run dev
```

**File yang harus dibuat/diubah:**

`nuxt.config.ts` — ganti seluruh isinya dengan:

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss", "@nuxtjs/image"],

  supabase: {
    redirect: false,
  },

  image: {
    domains: ["books.google.com", "covers.openlibrary.org"],
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
});
```

`tailwind.config.ts` — buat file baru:

```typescript
import type { Config } from "tailwindcss";

export default {
  content: ["./components/**/*.{js,vue,ts}", "./layouts/**/*.vue", "./pages/**/*.vue", "./composables/**/*.{js,ts}", "./app.vue"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
} satisfies Config;
```

`app.vue` — ganti seluruh isinya dengan:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

**Acceptance criteria:**

- `npm run dev` berjalan tanpa error
- Browser buka `http://localhost:3000` tidak ada error di console
- Folder `node_modules` ada dan berisi package yang diinstall

---

### ISSUE #02 — Setup environment variables & koneksi Supabase

**Konteks:**
Project Nuxt sudah ada dari Issue #01. Sekarang kita sambungkan ke Supabase.
Database sudah dibuat sebelumnya — kamu tinggal minta SUPABASE_URL dan SUPABASE_KEY
kepada pemilik project.

**Langkah:**

Buat file `.env` di root project:

```env
SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

> **Cara dapat value-nya:**
> Supabase dashboard → Settings → API →
> "Project URL" masuk ke SUPABASE_URL
> "anon public" masuk ke SUPABASE_KEY

Buat file `.env.example` (untuk dokumentasi, commit ini ke git):

```env
SUPABASE_URL=your-supabase-url-here
SUPABASE_KEY=your-supabase-anon-key-here
```

Pastikan `.env` ada di `.gitignore`:

```
# tambahkan baris ini kalau belum ada
.env
.env.local
```

**Verifikasi koneksi** — buat file `pages/index.vue` sementara:

```vue
<template>
  <div class="p-8">
    <h1>Test Koneksi</h1>
    <pre>{{ books }}</pre>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const { data: books } = await useAsyncData("books", () => supabase.from("books").select("title, author").limit(3));
</script>
```

**Acceptance criteria:**

- `npm run dev` tidak error
- Buka `localhost:3000` — halaman tampil data dari Supabase (judul buku dari seed data)
- Tidak ada error "Invalid API key" di console

---

### ISSUE #03 — Generate TypeScript types dari Supabase

**Konteks:**
Supaya kode kita type-safe, kita generate types langsung dari schema database Supabase.
Ini membuat VS Code bisa autocomplete nama kolom dan deteksi typo.

**Langkah:**

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login ke Supabase
supabase login
# akan buka browser, login dengan akun Supabase

# 3. Generate types (ganti PROJECT_ID dengan ID project kamu)
# ID project ada di: Supabase dashboard → Settings → General → Reference ID
supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts
```

Buat folder `types/` di root project, lalu buat `types/index.ts`:

```typescript
import type { Database } from "./database.types";

// Shortcut types yang akan sering dipakai
export type Book = Database["public"]["Tables"]["books"]["Row"];
export type BookInsert = Database["public"]["Tables"]["books"]["Insert"];
export type BookUpdate = Database["public"]["Tables"]["books"]["Update"];

export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type CommentInsert = Database["public"]["Tables"]["comments"]["Insert"];

export type Rating = Database["public"]["Tables"]["ratings"]["Row"];
export type RatingInsert = Database["public"]["Tables"]["ratings"]["Insert"];

export type Profile = Database["public"]["Tables"]["profile"]["Row"];

// Type untuk hasil search Google Books API
export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
    pageCount?: number;
    publishedDate?: string;
    categories?: string[];
    language?: string;
  };
}

export interface BookSearchResult {
  title: string;
  author: string;
  cover_url: string | null;
  description: string | null;
  isbn: string | null;
  pages: number | null;
  published_year: number | null;
  genre: string[];
}
```

**Acceptance criteria:**

- File `types/database.types.ts` ada dan berisi interface yang sesuai dengan tabel Supabase
- File `types/index.ts` ada
- Tidak ada error TypeScript saat `npm run build`

---

## PHASE 2 — COMPOSABLES (Business Logic)

> Estimasi: 3–4 jam

---

### ISSUE #04 — Composable: useBooks

**Konteks:**
Composable adalah "service layer" di Nuxt. Semua operasi yang berhubungan dengan
tabel `books` di Supabase harus ada di file ini. Halaman Vue **tidak boleh** langsung
query Supabase — harus lewat composable ini.

**Buat file `composables/useBooks.ts`:**

```typescript
import type { Book, BookInsert, BookUpdate } from "~/types";

export const useBooks = () => {
  const supabase = useSupabaseClient();

  // Ambil semua buku yang published (untuk halaman publik)
  const getBooks = async (options?: { genre?: string; status?: string; limit?: number }) => {
    let query = supabase.from("books").select("*").eq("is_published", true).order("created_at", { ascending: false });

    if (options?.genre) {
      query = query.contains("genre", [options.genre]);
    }
    if (options?.status) {
      query = query.eq("read_status", options.status);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Book[];
  };

  // Ambil satu buku berdasarkan slug (untuk halaman detail)
  const getBookBySlug = async (slug: string) => {
    const { data, error } = await supabase.from("books").select("*").eq("slug", slug).eq("is_published", true).single();

    if (error) throw error;
    return data as Book;
  };

  // Ambil semua buku (termasuk draft) — hanya untuk admin
  const getAllBooks = async () => {
    const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    return data as Book[];
  };

  // Tambah buku baru — hanya admin
  const createBook = async (book: BookInsert) => {
    const { data, error } = await supabase.from("books").insert(book).select().single();

    if (error) throw error;
    return data as Book;
  };

  // Update buku — hanya admin
  const updateBook = async (id: string, updates: BookUpdate) => {
    const { data, error } = await supabase.from("books").update(updates).eq("id", id).select().single();

    if (error) throw error;
    return data as Book;
  };

  // Hapus buku — hanya admin
  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);

    if (error) throw error;
  };

  // Helper: buat slug dari judul buku
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  return {
    getBooks,
    getBookBySlug,
    getAllBooks,
    createBook,
    updateBook,
    deleteBook,
    generateSlug,
  };
};
```

**Acceptance criteria:**

- File ada di `composables/useBooks.ts`
- Tidak ada TypeScript error
- `generateSlug('Atomic Habits')` menghasilkan `'atomic-habits'`

---

### ISSUE #05 — Composable: useComments

**Buat file `composables/useComments.ts`:**

```typescript
import type { Comment, CommentInsert } from "~/types";

export const useComments = () => {
  const supabase = useSupabaseClient();

  // Ambil komentar yang sudah approved untuk satu buku
  const getComments = async (bookId: string) => {
    const { data, error } = await supabase.from("comments").select("id, created_at, name, content").eq("book_id", bookId).eq("is_approved", true).eq("is_spam", false).order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  };

  // Ambil semua komentar pending — hanya admin
  const getPendingComments = async () => {
    const { data, error } = await supabase.from("comments").select("*, books(title, slug)").eq("is_approved", false).eq("is_spam", false).order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  };

  // Kirim komentar baru (dari pengunjung)
  const submitComment = async (comment: CommentInsert) => {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        ...comment,
        is_approved: false, // selalu false, tunggu moderasi
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // Approve komentar — hanya admin
  const approveComment = async (id: string) => {
    const { error } = await supabase.from("comments").update({ is_approved: true }).eq("id", id);

    if (error) throw error;
  };

  // Tandai sebagai spam — hanya admin
  const markAsSpam = async (id: string) => {
    const { error } = await supabase.from("comments").update({ is_spam: true }).eq("id", id);

    if (error) throw error;
  };

  // Hapus komentar — hanya admin
  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) throw error;
  };

  return {
    getComments,
    getPendingComments,
    submitComment,
    approveComment,
    markAsSpam,
    deleteComment,
  };
};
```

**Acceptance criteria:**

- File ada di `composables/useComments.ts`
- Tidak ada TypeScript error

---

### ISSUE #06 — Composable: useRatings

**Buat file `composables/useRatings.ts`:**

```typescript
import type { RatingInsert } from "~/types";

export const useRatings = () => {
  const supabase = useSupabaseClient();

  // Generate fingerprint sederhana dari browser
  // Bukan 100% akurat tapi cukup untuk mencegah spam rating
  const getFingerprint = () => {
    const nav = navigator;
    const str = [nav.userAgent, nav.language, screen.width, screen.height, new Date().getTimezoneOffset()].join("|");

    // Hash sederhana
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  };

  // Submit rating (dari pengunjung)
  const submitRating = async (bookId: string, score: number) => {
    const fingerprint = getFingerprint();

    // Upsert: kalau sudah pernah rating, update nilainya
    const { data, error } = await supabase.from("ratings").upsert({ book_id: bookId, score, fingerprint }, { onConflict: "book_id,fingerprint" }).select().single();

    if (error) throw error;
    return data;
  };

  // Cek apakah user sudah pernah rating buku ini
  const getUserRating = async (bookId: string) => {
    const fingerprint = getFingerprint();

    const { data } = await supabase.from("ratings").select("score").eq("book_id", bookId).eq("fingerprint", fingerprint).single();

    return data?.score || null;
  };

  return {
    submitRating,
    getUserRating,
  };
};
```

**Acceptance criteria:**

- File ada di `composables/useRatings.ts`
- Tidak ada TypeScript error

---

### ISSUE #07 — Server Route: book-search (proxy Google Books API)

**Konteks:**
API key Google Books tidak boleh ada di browser (bisa dicuri). Kita buat server route
di Nuxt yang jadi perantara — browser fetch ke `/api/book-search`, Nuxt server yang
fetch ke Google Books.

**Buat file `server/api/book-search.get.ts`:**

```typescript
import { z } from "zod";
import type { GoogleBook, BookSearchResult } from "~/types";

const querySchema = z.object({
  q: z.string().min(2).max(100),
});

export default defineEventHandler(async (event) => {
  // Validasi query parameter
  const query = getQuery(event);
  const parsed = querySchema.safeParse(query);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Query tidak valid. Minimal 2 karakter.",
    });
  }

  const searchQuery = parsed.data.q;

  try {
    // Fetch ke Google Books API
    // API key opsional untuk development, wajib untuk production
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = apiKey ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=8&key=${apiKey}` : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=8`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) return [];

    // Transform data ke format yang kita butuhkan
    const results: BookSearchResult[] = data.items.map((item: GoogleBook) => {
      const info = item.volumeInfo;
      const isbn = info.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier || null;

      const publishedYear = info.publishedDate ? parseInt(info.publishedDate.split("-")[0]) : null;

      return {
        title: info.title || "",
        author: (info.authors || []).join(", ") || "Tidak diketahui",
        cover_url: info.imageLinks?.thumbnail?.replace("http:", "https:") || null,
        description: info.description || null,
        isbn,
        pages: info.pageCount || null,
        published_year: publishedYear,
        genre: info.categories || [],
      };
    });

    return results;
  } catch (error) {
    // Fallback ke Open Library jika Google Books gagal
    const olUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(searchQuery)}&limit=5&fields=title,author_name,first_publish_year,isbn,cover_i,number_of_pages_median`;
    const olResponse = await fetch(olUrl);
    const olData = await olResponse.json();

    if (!olData.docs) return [];

    return olData.docs.map(
      (book: any): BookSearchResult => ({
        title: book.title || "",
        author: (book.author_name || []).join(", ") || "Tidak diketahui",
        cover_url: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null,
        description: null,
        isbn: book.isbn?.[0] || null,
        pages: book.number_of_pages_median || null,
        published_year: book.first_publish_year || null,
        genre: [],
      }),
    );
  }
});
```

Tambahkan ke `.env`:

```env
GOOGLE_BOOKS_API_KEY=AIzaSy...  # opsional, dapat dari console.cloud.google.com
```

**Acceptance criteria:**

- Buka `http://localhost:3000/api/book-search?q=atomic+habits` di browser
- Response adalah array JSON berisi data buku
- Tidak ada error 500

---

### ISSUE #08 — Composable: useBookSearch

**Buat file `composables/useBookSearch.ts`:**

```typescript
import type { BookSearchResult } from "~/types";

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
```

> **Catatan untuk pelaksana:** `useDebounceFn` berasal dari package `@vueuse/core`.
> Import sudah otomatis karena kita install `vueuse` dan Nuxt auto-import composables dari VueUse.

**Acceptance criteria:**

- File ada di `composables/useBookSearch.ts`
- Tidak ada TypeScript error

---

### ISSUE #09 — Middleware: proteksi halaman admin

**Konteks:**
Semua halaman di dalam folder `pages/admin/` harus hanya bisa diakses oleh
pemilik website yang sudah login. Kalau belum login, redirect ke `/login`.

**Buat file `middleware/admin.ts`:**

```typescript
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  // Kalau route tujuan adalah halaman admin
  if (to.path.startsWith("/admin")) {
    // Dan user belum login
    if (!user.value) {
      return navigateTo("/login");
    }
  }
});
```

Daftarkan middleware di `nuxt.config.ts` (tambahkan key `router`):

```typescript
export default defineNuxtConfig({
  // ... konfigurasi sebelumnya ...
  router: {
    middleware: ["admin"],
  },
});
```

**Buat halaman login `pages/login.vue`:**

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-xl shadow-sm border w-full max-w-sm">
      <h1 class="text-xl font-semibold text-gray-900 mb-6">Login Admin</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="password" type="password" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>

        <button type="submit" :disabled="loading" class="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
          {{ loading ? "Loading..." : "Masuk" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false }); // halaman login tidak pakai layout utama

const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = "";

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMsg.value = "Email atau password salah.";
    loading.value = false;
    return;
  }

  await navigateTo("/admin");
};
</script>
```

**Acceptance criteria:**

- Buka `localhost:3000/admin` tanpa login → otomatis redirect ke `/login`
- Login dengan email/password Supabase yang valid → masuk ke `/admin`
- Login dengan password salah → muncul pesan error

---

## PHASE 3 — LAYOUT & KOMPONEN UI

> Estimasi: 3–4 jam

---

### ISSUE #10 — Layout utama (navbar + footer)

**Buat file `layouts/default.vue`:**

```vue
<template>
  <div class="min-h-screen bg-white">
    <!-- Navbar -->
    <nav class="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-50">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="font-semibold text-gray-900 hover:text-gray-600"> 📚 Nama Kamu </NuxtLink>
        <div class="flex items-center gap-6 text-sm text-gray-600">
          <NuxtLink to="/books" class="hover:text-gray-900" active-class="text-gray-900 font-medium"> Review </NuxtLink>
          <NuxtLink to="/about" class="hover:text-gray-900" active-class="text-gray-900 font-medium"> Tentang </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Konten halaman -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-100 mt-16">
      <div class="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-400">Dibuat dengan ☕ dan terlalu banyak buku</div>
    </footer>
  </div>
</template>
```

**Buat file `layouts/admin.vue`:**

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <span class="font-semibold text-gray-900">Admin Panel</span>
        <div class="flex items-center gap-4 text-sm">
          <NuxtLink to="/admin" class="text-gray-600 hover:text-gray-900">Dashboard</NuxtLink>
          <NuxtLink to="/admin/tambah" class="text-gray-600 hover:text-gray-900">Tambah Buku</NuxtLink>
          <NuxtLink to="/admin/komentar" class="text-gray-600 hover:text-gray-900">Komentar</NuxtLink>
          <NuxtLink to="/" class="text-gray-400 hover:text-gray-600">← Lihat Website</NuxtLink>
          <button @click="logout" class="text-red-500 hover:text-red-700">Logout</button>
        </div>
      </div>
    </nav>
    <main class="max-w-6xl mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const logout = async () => {
  await supabase.auth.signOut();
  await navigateTo("/login");
};
</script>
```

**Acceptance criteria:**

- Navbar tampil di semua halaman publik
- Layout admin tampil di halaman `/admin/*`
- Tombol logout di admin berfungsi

---

### ISSUE #11 — Komponen UI: StarRating, GenreBadge, BookCard

**Buat `components/ui/StarRating.vue`:**

```vue
<template>
  <div class="flex items-center gap-0.5">
    <button
      v-for="star in 5"
      :key="star"
      @click="interactive ? emit('update:modelValue', star) : null"
      :class="['transition-colors', interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default', star <= displayRating ? 'text-amber-400' : 'text-gray-200']"
    >
      <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    </button>
    <span v-if="showCount && count" class="text-sm text-gray-400 ml-1">({{ count }})</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: number;
  rating?: number;
  count?: number;
  interactive?: boolean;
  showCount?: boolean;
}>();
const emit = defineEmits<{ "update:modelValue": [value: number] }>();

const displayRating = computed(() => (props.interactive ? props.modelValue || 0 : Math.round(props.rating || 0)));
</script>
```

**Buat `components/ui/GenreBadge.vue`:**

```vue
<template>
  <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
    {{ genre }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ genre: string }>();
</script>
```

**Buat `components/book/BookCard.vue`:**

```vue
<template>
  <NuxtLink :to="`/books/${book.slug}`" class="group block">
    <div class="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
      <!-- Cover -->
      <div class="flex-shrink-0">
        <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title" class="w-16 h-24 object-cover rounded-lg" loading="lazy" />
        <div v-else class="w-16 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs text-center">No Cover</div>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h2 class="font-semibold text-gray-900 group-hover:text-gray-600 line-clamp-2 leading-snug">
          {{ book.title }}
        </h2>
        <p class="text-sm text-gray-500 mt-0.5">{{ book.author }}</p>

        <div class="flex items-center gap-2 mt-2">
          <StarRating :rating="book.avg_rating || book.owner_rating || 0" />
          <span class="text-xs text-gray-400">{{ book.avg_rating?.toFixed(1) || book.owner_rating }}</span>
        </div>

        <div class="flex flex-wrap gap-1 mt-2">
          <GenreBadge v-for="g in (book.genre || []).slice(0, 3)" :key="g" :genre="g" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Book } from "~/types";
defineProps<{ book: Book }>();
</script>
```

**Acceptance criteria:**

- StarRating menampilkan bintang sesuai rating yang diberikan
- BookCard menampilkan cover, judul, penulis, rating, genre
- Klik BookCard navigasi ke `/books/[slug]`

---

## PHASE 4 — HALAMAN PUBLIK

> Estimasi: 4–5 jam

---

### ISSUE #12 — Halaman beranda (index.vue)

**Buat `pages/index.vue`:**

```vue
<template>
  <div>
    <!-- Hero section -->
    <section class="py-12 border-b border-gray-100">
      <h1 class="text-3xl font-bold text-gray-900">Halo, saya [Nama] 👋</h1>
      <p class="text-gray-600 mt-3 max-w-lg leading-relaxed">Saya membaca dan mereview buku — terutama self-help, filsafat, dan produktivitas. Di sini saya catat apa yang saya pelajari.</p>
      <NuxtLink to="/books" class="inline-block mt-4 text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600"> Lihat semua review → </NuxtLink>
    </section>

    <!-- Review terbaru -->
    <section class="py-8">
      <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Review Terbaru</h2>
      <div class="space-y-2">
        <BookCard v-for="book in recentBooks" :key="book.id" :book="book" />
      </div>
    </section>

    <!-- Reading stats -->
    <section v-if="stats" class="py-8 border-t border-gray-100">
      <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Reading Stats {{ new Date().getFullYear() }}</h2>
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ stats.read }}</div>
          <div class="text-xs text-gray-400 mt-1">Buku dibaca</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ stats.target }}</div>
          <div class="text-xs text-gray-400 mt-1">Target tahun ini</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ Math.round((stats.read / stats.target) * 100) }}%</div>
          <div class="text-xs text-gray-400 mt-1">Progress</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });
useSeoMeta({ title: "[Nama] — Book Review", description: "Review buku oleh [Nama]" });

const { getBooks } = useBooks();
const supabase = useSupabaseClient();

const { data: recentBooks } = await useAsyncData("recent-books", () => getBooks({ limit: 5, status: "read" }));

const { data: stats } = await useAsyncData("stats", async () => {
  const { data: profile } = await supabase.from("profile").select("yearly_target").single();
  const { count } = await supabase.from("books").select("*", { count: "exact", head: true }).eq("read_status", "read").eq("is_published", true);

  return {
    read: count || 0,
    target: profile?.yearly_target || 24,
  };
});
</script>
```

**Acceptance criteria:**

- Halaman beranda tampil dengan 5 buku terbaru
- Reading stats tampil
- SEO title dan description ter-set

---

### ISSUE #13 — Halaman daftar buku (/books)

**Buat `pages/books/index.vue`:**

```vue
<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Semua Review</h1>
      <span class="text-sm text-gray-400">{{ filteredBooks?.length || 0 }} buku</span>
    </div>

    <!-- Filter genre -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button @click="activeGenre = null" :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors', !activeGenre ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">Semua</button>
      <button
        v-for="genre in allGenres"
        :key="genre"
        @click="activeGenre = activeGenre === genre ? null : genre"
        :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors', activeGenre === genre ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
      >
        {{ genre }}
      </button>
    </div>

    <!-- Daftar buku -->
    <div class="space-y-2">
      <BookCard v-for="book in filteredBooks" :key="book.id" :book="book" />
    </div>

    <p v-if="!filteredBooks?.length" class="text-center text-gray-400 py-12">Belum ada buku dengan genre ini.</p>
  </div>
</template>

<script setup lang="ts">
import type { Book } from "~/types";

definePageMeta({ layout: "default" });
useSeoMeta({ title: "Review Buku", description: "Semua review buku" });

const { getBooks } = useBooks();
const activeGenre = ref<string | null>(null);

const { data: books } = await useAsyncData("all-books", () => getBooks());

const allGenres = computed(() => {
  const genres = new Set<string>();
  books.value?.forEach((b) => b.genre?.forEach((g) => genres.add(g)));
  return Array.from(genres).sort();
});

const filteredBooks = computed(() => {
  if (!activeGenre.value) return books.value;
  return books.value?.filter((b) => b.genre?.includes(activeGenre.value!));
});
</script>
```

**Acceptance criteria:**

- Semua buku tampil
- Filter genre berfungsi
- Counter jumlah buku update sesuai filter

---

### ISSUE #14 — Halaman detail review (/books/[slug])

**Buat `pages/books/[slug].vue`:**

```vue
<template>
  <div v-if="book">
    <!-- Hero: cover + info utama -->
    <div class="flex gap-6 mb-8">
      <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title" class="w-32 h-48 object-cover rounded-xl flex-shrink-0" />
      <div class="flex-1">
        <div class="flex flex-wrap gap-1 mb-2">
          <GenreBadge v-for="g in book.genre" :key="g" :genre="g" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 leading-tight">{{ book.title }}</h1>
        <p class="text-gray-500 mt-1">{{ book.author }}</p>
        <div class="flex items-center gap-2 mt-3">
          <StarRating :rating="book.avg_rating || book.owner_rating || 0" :count="book.total_ratings" show-count />
          <span class="text-sm text-gray-400">Rating kamu: {{ book.owner_rating }}/5</span>
        </div>
        <p class="text-xs text-gray-400 mt-2">{{ book.pages }} hal · {{ book.published_year }} · {{ book.language?.toUpperCase() }}</p>
      </div>
    </div>

    <!-- Sinopsis -->
    <section v-if="book.description" class="mb-6">
      <h2 class="font-semibold text-gray-900 mb-2">Sinopsis</h2>
      <p class="text-gray-600 leading-relaxed text-sm">{{ book.description }}</p>
    </section>

    <!-- Review pemilik -->
    <section v-if="book.owner_review" class="mb-6 bg-gray-50 rounded-xl p-5">
      <h2 class="font-semibold text-gray-900 mb-2">Review Saya</h2>
      <p class="text-gray-700 leading-relaxed">{{ book.owner_review }}</p>
    </section>

    <!-- Kelebihan & Kekurangan -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div v-if="book.pros?.length" class="bg-green-50 rounded-xl p-4">
        <h3 class="font-semibold text-green-800 mb-2 text-sm">✓ Kelebihan</h3>
        <ul class="space-y-1">
          <li v-for="pro in book.pros" :key="pro" class="text-sm text-green-700">{{ pro }}</li>
        </ul>
      </div>
      <div v-if="book.cons?.length" class="bg-red-50 rounded-xl p-4">
        <h3 class="font-semibold text-red-800 mb-2 text-sm">✗ Kekurangan</h3>
        <ul class="space-y-1">
          <li v-for="con in book.cons" :key="con" class="text-sm text-red-700">{{ con }}</li>
        </ul>
      </div>
    </div>

    <!-- Affiliate links -->
    <section v-if="book.shopee_url || book.tokped_url || book.tiktok_url" class="mb-8">
      <h2 class="font-semibold text-gray-900 mb-3">Beli Buku Ini</h2>
      <div class="flex flex-wrap gap-2">
        <a v-if="book.shopee_url" :href="book.shopee_url" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600"> Shopee </a>
        <a v-if="book.tokped_url" :href="book.tokped_url" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600"> Tokopedia </a>
        <a v-if="book.tiktok_url" :href="book.tiktok_url" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800"> TikTok Shop </a>
      </div>
    </section>

    <!-- Rating dari pengunjung -->
    <section class="mb-8 border-t border-gray-100 pt-6">
      <h2 class="font-semibold text-gray-900 mb-3">Rating Kamu</h2>
      <div class="flex items-center gap-3">
        <StarRating v-model="userRating" interactive @update:model-value="submitRating" />
        <span v-if="ratingSubmitted" class="text-sm text-green-600">Terima kasih!</span>
      </div>
    </section>

    <!-- Komentar -->
    <section class="border-t border-gray-100 pt-6">
      <h2 class="font-semibold text-gray-900 mb-4">Komentar ({{ comments?.length || 0 }})</h2>

      <!-- Form komentar -->
      <form @submit.prevent="handleSubmitComment" class="mb-6 space-y-3">
        <input v-model="commentForm.name" type="text" placeholder="Nama kamu" required class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
        <textarea v-model="commentForm.content" placeholder="Tulis komentarmu..." required rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none" />
        <button type="submit" :disabled="submittingComment" class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50">
          {{ submittingComment ? "Mengirim..." : "Kirim Komentar" }}
        </button>
        <p v-if="commentSent" class="text-sm text-green-600">Komentar terkirim! Akan tampil setelah dimoderasi.</p>
      </form>

      <!-- List komentar -->
      <div class="space-y-4">
        <div v-for="comment in comments" :key="comment.id" class="border-b border-gray-100 pb-4">
          <div class="flex items-center justify-between mb-1">
            <span class="font-medium text-sm text-gray-900">{{ comment.name }}</span>
            <span class="text-xs text-gray-400">{{ formatDate(comment.created_at) }}</span>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed">{{ comment.content }}</p>
        </div>
      </div>
    </section>
  </div>

  <!-- 404 -->
  <div v-else class="text-center py-16">
    <p class="text-gray-400">Buku tidak ditemukan.</p>
    <NuxtLink to="/books" class="text-sm text-gray-900 underline mt-2 block">← Kembali</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { getBookBySlug } = useBooks();
const { getComments, submitComment } = useComments();
const { submitRating, getUserRating } = useRatings();

const { data: book } = await useAsyncData(`book-${route.params.slug}`, () => getBookBySlug(route.params.slug as string));

if (!book.value) throw createError({ statusCode: 404, statusMessage: "Buku tidak ditemukan" });

useSeoMeta({
  title: `${book.value.title} — Review`,
  description: book.value.description?.slice(0, 160) || "",
  ogImage: book.value.cover_url || "",
});

const { data: comments, refresh: refreshComments } = await useAsyncData(`comments-${book.value.id}`, () => getComments(book.value!.id));

// Rating
const userRating = ref<number>(0);
const ratingSubmitted = ref(false);
onMounted(async () => {
  const existing = await getUserRating(book.value!.id);
  if (existing) userRating.value = existing;
});

const submitRatingHandler = async (score: number) => {
  await submitRating(book.value!.id, score);
  ratingSubmitted.value = true;
};

// Komentar
const commentForm = reactive({ name: "", content: "" });
const submittingComment = ref(false);
const commentSent = ref(false);

const handleSubmitComment = async () => {
  if (!book.value) return;
  submittingComment.value = true;
  await submitComment({ book_id: book.value.id, ...commentForm });
  commentForm.name = "";
  commentForm.content = "";
  submittingComment.value = false;
  commentSent.value = true;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};
</script>
```

**Acceptance criteria:**

- Halaman detail tampil lengkap: cover, review, pros/cons, affiliate, rating, komentar
- Form komentar bisa disubmit
- Form rating bisa diklik

---

## PHASE 5 — ADMIN PANEL

> Estimasi: 4–5 jam

---

### ISSUE #15 — Admin: halaman tambah buku (dengan Book API search)

**Buat `pages/admin/tambah.vue`:**

```vue
<template>
  <div class="max-w-2xl">
    <h1 class="text-xl font-semibold text-gray-900 mb-6">Tambah Buku Baru</h1>

    <!-- Step 1: Cari buku -->
    <div v-if="step === 1" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Cari buku</label>
        <div class="flex gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Ketik judul buku..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="debouncedSearch(searchQuery)"
          />
        </div>
      </div>

      <div v-if="isLoading" class="text-sm text-gray-400">Mencari...</div>

      <div v-if="results.length" class="space-y-2">
        <p class="text-xs text-gray-400">Pilih salah satu atau lewati untuk isi manual</p>
        <div v-for="(result, i) in results" :key="i" @click="selectBook(result)" class="flex gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
          <img v-if="result.cover_url" :src="result.cover_url" class="w-10 h-14 object-cover rounded" />
          <div>
            <div class="font-medium text-sm text-gray-900">{{ result.title }}</div>
            <div class="text-xs text-gray-500">{{ result.author }} · {{ result.published_year }}</div>
          </div>
        </div>
      </div>

      <button @click="step = 2" class="text-sm text-gray-500 underline">Lewati, isi manual →</button>
    </div>

    <!-- Step 2: Form isi detail review -->
    <form v-if="step === 2" @submit.prevent="handleSubmit" class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
          <input v-model="form.title" required @input="form.slug = generateSlug(form.title)" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Penulis *</label>
          <input v-model="form.author" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
        <input v-model="form.slug" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-xs" />
        <p class="text-xs text-gray-400 mt-1">URL: /books/{{ form.slug }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Cover URL</label>
        <input v-model="form.cover_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        <img v-if="form.cover_url" :src="form.cover_url" class="mt-2 w-16 h-24 object-cover rounded" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Sinopsis</label>
        <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Review saya</label>
        <textarea v-model="form.owner_review" rows="4" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Rating saya (1-5)</label>
        <StarRating v-model="form.owner_rating" interactive />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Kelebihan (satu per baris)</label>
          <textarea v-model="prosText" rows="3" placeholder="Mudah dipahami&#10;Contoh bagus&#10;Actionable" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Kekurangan (satu per baris)</label>
          <textarea v-model="consText" rows="3" placeholder="Agak repetitif&#10;Terlalu panjang" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Genre (pisah koma)</label>
        <input v-model="genreText" placeholder="self-help, produktivitas, psikologi" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Shopee URL</label>
          <input v-model="form.shopee_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tokopedia URL</label>
          <input v-model="form.tokped_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">TikTok Shop URL</label>
          <input v-model="form.tiktok_url" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>

      <div class="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button type="submit" :disabled="saving" class="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50">
          {{ saving ? "Menyimpan..." : "Simpan Buku" }}
        </button>
        <button type="button" @click="step = 1" class="text-sm text-gray-500 hover:text-gray-700">← Cari lagi</button>
        <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { BookSearchResult, BookInsert } from "~/types";

definePageMeta({ layout: "admin", middleware: "admin" });

const { createBook, generateSlug } = useBooks();
const { results, isLoading, debouncedSearch } = useBookSearch();

const step = ref(1);
const searchQuery = ref("");
const saving = ref(false);
const errorMsg = ref("");
const prosText = ref("");
const consText = ref("");
const genreText = ref("");

const form = reactive({
  title: "",
  slug: "",
  author: "",
  cover_url: "",
  description: "",
  owner_review: "",
  owner_rating: 0,
  isbn: "",
  pages: null as number | null,
  published_year: null as number | null,
  shopee_url: "",
  tokped_url: "",
  tiktok_url: "",
});

const selectBook = (book: BookSearchResult) => {
  form.title = book.title;
  form.slug = generateSlug(book.title);
  form.author = book.author;
  form.cover_url = book.cover_url || "";
  form.description = book.description || "";
  form.isbn = book.isbn || "";
  form.pages = book.pages;
  form.published_year = book.published_year;
  genreText.value = book.genre.join(", ");
  step.value = 2;
};

const handleSubmit = async () => {
  saving.value = true;
  errorMsg.value = "";
  try {
    const bookData: BookInsert = {
      ...form,
      cover_url: form.cover_url || null,
      pros: prosText.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      cons: consText.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      genre: genreText.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      owner_rating: form.owner_rating || null,
    };
    const book = await createBook(bookData);
    await navigateTo(`/admin`);
  } catch (e: any) {
    errorMsg.value = e.message || "Gagal menyimpan buku.";
  } finally {
    saving.value = false;
  }
};
</script>
```

**Acceptance criteria:**

- Bisa search buku dan data otomatis terisi
- Form bisa disubmit dan buku muncul di Supabase
- Hanya bisa diakses kalau sudah login

---

### ISSUE #16 — Admin: moderasi komentar

**Buat `pages/admin/komentar.vue`:**

```vue
<template>
  <div>
    <h1 class="text-xl font-semibold text-gray-900 mb-6">
      Moderasi Komentar
      <span v-if="pendingComments?.length" class="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-sm rounded-full"> {{ pendingComments.length }} pending </span>
    </h1>

    <div v-if="!pendingComments?.length" class="text-center py-12 text-gray-400">Tidak ada komentar yang perlu dimoderasi 🎉</div>

    <div class="space-y-3">
      <div v-for="comment in pendingComments" :key="comment.id" class="p-4 border border-gray-200 rounded-xl bg-white">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-sm text-gray-900">{{ comment.name }}</span>
              <span class="text-xs text-gray-400">{{ formatDate(comment.created_at) }}</span>
              <span class="text-xs text-blue-600">→ {{ comment.books?.title }}</span>
            </div>
            <p class="text-sm text-gray-700 leading-relaxed">{{ comment.content }}</p>
            <p v-if="comment.email" class="text-xs text-gray-400 mt-1">{{ comment.email }}</p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button @click="handleApprove(comment.id)" class="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600">Approve</button>
            <button @click="handleSpam(comment.id)" class="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200">Spam</button>
            <button @click="handleDelete(comment.id)" class="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-medium rounded-lg hover:bg-red-100">Hapus</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });

const { getPendingComments, approveComment, markAsSpam, deleteComment } = useComments();

const { data: pendingComments, refresh } = await useAsyncData("pending-comments", () => getPendingComments());

const handleApprove = async (id: string) => {
  await approveComment(id);
  await refresh();
};
const handleSpam = async (id: string) => {
  await markAsSpam(id);
  await refresh();
};
const handleDelete = async (id: string) => {
  if (!confirm("Yakin hapus komentar ini?")) return;
  await deleteComment(id);
  await refresh();
};

const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
</script>
```

**Acceptance criteria:**

- Komentar pending tampil di halaman ini
- Tombol Approve membuat komentar tampil di halaman publik
- Tombol Spam dan Hapus berfungsi

---

## PHASE 6 — SEO & FINISHING

> Estimasi: 2 jam

---

### ISSUE #17 — SEO: OG tags dan sitemap

**Tambahkan ke `nuxt.config.ts`:**

```typescript
modules: [
  // ... modules sebelumnya ...
  '@nuxtjs/sitemap',
],

site: {
  url: 'https://namawebsite.com',  // ganti dengan domain kamu
  name: 'Nama Kamu — Book Review',
},
```

Install module sitemap:

```bash
npm install @nuxtjs/sitemap
```

Di setiap halaman yang belum punya SEO meta, tambahkan:

```vue
<script setup>
useSeoMeta({
  title: "Judul Halaman",
  description: "Deskripsi halaman maksimal 160 karakter.",
  ogTitle: "Judul Halaman",
  ogDescription: "Deskripsi untuk preview WhatsApp/Twitter.",
  ogImage: "https://url-gambar-cover.jpg",
  twitterCard: "summary_large_image",
});
</script>
```

**Acceptance criteria:**

- Setiap halaman punya title yang unik
- Share link ke WhatsApp menampilkan preview yang benar
- `/sitemap.xml` dapat diakses dan berisi semua URL buku

---

### ISSUE #18 — Halaman About / Profil

**Buat `pages/about.vue`:**

```vue
<template>
  <div v-if="profile" class="max-w-lg">
    <div class="flex items-center gap-4 mb-6">
      <img v-if="profile.avatar_url" :src="profile.avatar_url" class="w-16 h-16 rounded-full object-cover" />
      <div>
        <h1 class="text-xl font-bold text-gray-900">{{ profile.name }}</h1>
        <p class="text-sm text-gray-500">{{ profile.location }}</p>
      </div>
    </div>

    <p class="text-gray-700 leading-relaxed mb-6">{{ profile.bio }}</p>

    <div class="flex flex-wrap gap-3 mb-8">
      <a v-if="profile.instagram" :href="`https://instagram.com/${profile.instagram}`" target="_blank" class="text-sm text-gray-600 hover:text-gray-900"> Instagram → </a>
      <a v-if="profile.twitter" :href="`https://twitter.com/${profile.twitter}`" target="_blank" class="text-sm text-gray-600 hover:text-gray-900"> Twitter → </a>
      <a v-if="profile.goodreads" :href="profile.goodreads" target="_blank" class="text-sm text-gray-600 hover:text-gray-900"> Goodreads → </a>
    </div>

    <!-- Donasi -->
    <div v-if="profile.saweria_url || profile.trakteer_url" class="border border-gray-100 rounded-xl p-5">
      <h2 class="font-semibold text-gray-900 mb-2">Support saya ☕</h2>
      <p class="text-sm text-gray-500 mb-3">Kalau review ini membantu, traktir saya kopi!</p>
      <div class="flex gap-2">
        <a v-if="profile.saweria_url" :href="profile.saweria_url" target="_blank" class="px-4 py-2 bg-yellow-400 text-yellow-900 text-sm font-medium rounded-lg hover:bg-yellow-300"> Saweria </a>
        <a v-if="profile.trakteer_url" :href="profile.trakteer_url" target="_blank" class="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600"> Trakteer </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });
useSeoMeta({ title: "Tentang Saya" });

const supabase = useSupabaseClient();
const { data: profile } = await useAsyncData("profile", async () => {
  const { data } = await supabase.from("profile").select("*").single();
  return data;
});
</script>
```

**Acceptance criteria:**

- Halaman about tampil data dari tabel `profile` Supabase
- Link sosmed bisa diklik
- Tombol donasi tampil kalau URL diisi

---

## CHECKLIST FINAL SEBELUM DEPLOY

```
[ ] Semua issue #01 — #18 selesai dan tidak ada error
[ ] npm run build tidak error
[ ] Test di browser: daftar buku, detail, komentar, rating semua jalan
[ ] Login admin berfungsi, tambah buku berfungsi, moderasi berfungsi
[ ] .env tidak ter-commit ke git
[ ] Ganti seed data nama pemilik dengan nama asli
[ ] Set up akun Supabase Auth (buat user lewat Supabase dashboard → Authentication → Users → Add User)
[ ] Deploy ke Vercel: connect GitHub repo → set env variables di Vercel dashboard → deploy
```

---

_Dokumen ini dibuat untuk: nuxt terbaru + Tailwind CSS + Supabase | Website Book Review Pribadi_
