<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Loading State -->
    <div v-if="pending" class="animate-pulse space-y-8">
      <div class="flex items-center gap-6">
        <div class="w-32 h-32 bg-gray-200 rounded-full"></div>
        <div class="flex-1 space-y-3">
          <div class="h-6 bg-gray-200 rounded w-1/3"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div class="space-y-3">
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="profile" class="space-y-8">
      <!-- Profile Header -->
      <div class="bg-white rounded-xl shadow-sm border p-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img
              v-if="profile.avatar_url"
              :src="profile.avatar_url"
              :alt="profile.name"
              class="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
            />
            <div v-else class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-100">
              {{ profile.name.charAt(0).toUpperCase() }}
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ profile.name }}</h1>
            <div v-if="profile.location" class="flex items-center justify-center sm:justify-start gap-2 text-gray-600 mb-4">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.5l-4.95-4.45a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              <span>{{ profile.location }}</span>
            </div>

            <!-- Social Links -->
            <div v-if="hasSocialLinks" class="flex items-center justify-center sm:justify-start gap-4">
              <a
                v-if="profile.instagram"
                :href="profile.instagram"
                target="_blank"
                class="text-gray-600 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                v-if="profile.twitter"
                :href="profile.twitter"
                target="_blank"
                class="text-gray-600 hover:text-blue-500 transition-colors"
                aria-label="Twitter"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                v-if="profile.goodreads"
                :href="profile.goodreads"
                target="_blank"
                class="text-gray-600 hover:text-yellow-700 transition-colors"
                aria-label="Goodreads"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.43 23.995c-3.586-.196-6.296-2.078-7.14-5.196-.27-1.012-.362-2.14-.46-4.653-.098-2.509-.192-3.643-.459-4.65-.99-3.664-3.63-5.613-7.23-5.363l-.531.037V.165h.531c3.6.25 6.24-1.7 7.23-5.363.267-1.007.36-2.141.459-4.65.098-2.513.19-3.642.46-4.653.844-3.118 3.554-5 7.14-5.196.36-.02.74-.02 1.1 0 3.586.196 6.296 2.078 7.14 5.196.27 1.012.362 2.14.46 4.653.098 2.509.192 3.643.459 4.65.99 3.664 3.63 5.613 7.23 5.363l.531-.037v3.997h-.531c-3.6-.25-6.24 1.7-7.23 5.363-.267 1.007-.36 2.141-.459 4.65-.098 2.513-.19 3.642-.46 4.653-.844 3.118-3.554 5-7.14 5.196-.36.02-.74.02-1.1 0z"/>
                </svg>
              </a>
              <a
                v-if="profile.tiktok"
                :href="profile.tiktok"
                target="_blank"
                class="text-gray-600 hover:text-black transition-colors"
                aria-label="TikTok"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Bio -->
        <div v-if="profile.bio" class="mt-8 pt-8 border-t border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Tentang Saya</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ profile.bio }}</p>
        </div>

        <!-- Reading Stats -->
        <div v-if="profile.yearly_target" class="mt-8 pt-8 border-t border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Target Baca</h2>
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div class="text-4xl font-bold text-blue-600 mb-2">{{ profile.yearly_target }} Buku</div>
            <div class="text-gray-600">Target tahun {{ new Date().getFullYear() }}</div>
          </div>
        </div>
      </div>

      <!-- Donation Section -->
      <div v-if="hasDonationLinks" class="bg-white rounded-xl shadow-sm border p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">☕ Dukung Saya</h2>
        <p class="text-gray-600 mb-6">Jika Anda menyukai review saya dan ingin mendukung, Anda bisa traktir kopi melalui:</p>
        
        <div class="flex flex-wrap gap-4">
          <a
            v-if="profile.saweria_url"
            :href="profile.saweria_url"
            target="_blank"
            class="flex items-center gap-3 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Saweria
          </a>
          <a
            v-if="profile.trakteer_url"
            :href="profile.trakteer_url"
            target="_blank"
            class="flex items-center gap-3 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            Trakteer
          </a>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Profil Tidak Ditemukan</h2>
      <p class="text-gray-600">Data profil belum tersedia di database.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

useSeoMeta({
  title: 'Tentang Saya — Review Buku',
  description: 'Kenali lebih dekat dengan penulis review buku. Bio, media sosial, dan cara mendukung.'
});

const supabase = useSupabaseClient();

// Fetch profile
const { data: profile, pending } = await useAsyncData('profile-about', async () => {
  const { data } = await supabase.from('profile').select('*').single();
  return data;
});

// Check if has social links
const hasSocialLinks = computed(() => {
  if (!profile.value) return false;
  return !!(profile.value.instagram || profile.value.twitter || profile.value.goodreads || profile.value.tiktok);
});

// Check if has donation links
const hasDonationLinks = computed(() => {
  if (!profile.value) return false;
  return !!(profile.value.saweria_url || profile.value.trakteer_url);
});
</script>
