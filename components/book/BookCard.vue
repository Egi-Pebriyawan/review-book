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
          <span class="text-xs text-gray-400">{{ (book.avg_rating ?? book.owner_rating) ? (book.avg_rating ? book.avg_rating.toFixed(1) : book.owner_rating) : "" }}</span>
        </div>

        <div class="flex flex-wrap gap-1 mt-2">
          <GenreBadge v-for="g in (book.genre || []).slice(0, 3)" :key="g" :genre="g" />
        </div>

        <!-- Affiliate Links Icons -->
        <div v-if="hasAffiliateLinks" class="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
          <span class="text-xs text-gray-500">Beli:</span>
          <a v-if="book.shopee_url" :href="book.shopee_url" target="_blank" @click.stop class="inline-flex items-center justify-center w-6 h-6 text-orange-600 hover:text-orange-700 hover:scale-110 transition-all" title="Beli di Shopee">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M6.918 13.037c1.264-.375 2.242-.955 2.932-1.737.38-.43.674-.927.88-1.473a4.472 4.472 0 00-.88-1.473c-.69-.782-1.668-1.362-2.932-1.737-.228-.067-.46-.12-.694-.16-.115.384-.18.788-.18 1.207 0 .42.065.824.18 1.208.234-.04.466-.093.694-.16zm10.164 0c.228.067.46.12.694.16.115-.384.18-.788.18-1.207 0-.42-.065-.824-.18-1.208-.234.04-.466.093-.694.16-1.264.375-2.242.955-2.932 1.737-.38.43-.674.927-.88 1.473a4.472 4.472 0 00.88 1.473c.69.782 1.668 1.362 2.932 1.737z"
              />
            </svg>
          </a>
          <a v-if="book.tokped_url" :href="book.tokped_url" target="_blank" @click.stop class="inline-flex items-center justify-center w-6 h-6 text-green-600 hover:text-green-700 hover:scale-110 transition-all" title="Beli di Tokopedia">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
              />
            </svg>
          </a>
          <a v-if="book.tiktok_url" :href="book.tiktok_url" target="_blank" @click.stop class="inline-flex items-center justify-center w-6 h-6 text-gray-900 hover:text-gray-800 hover:scale-110 transition-all" title="Beli di TikTok Shop">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
              />
            </svg>
          </a>
          <a v-if="book.gramedia_url" :href="book.gramedia_url" target="_blank" @click.stop class="inline-flex items-center justify-center w-6 h-6 text-red-600 hover:text-red-700 hover:scale-110 transition-all" title="Beli di Gramedia">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V6c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v13z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Book } from "~/types";
import StarRating from "~/components/ui/StarRating.vue";
import GenreBadge from "~/components/ui/GenreBadge.vue";

const props = defineProps<{ book: Book }>();

// Check if book has any affiliate links
const hasAffiliateLinks = computed(() => {
  return !!(props.book.shopee_url || props.book.tokped_url || props.book.tiktok_url || props.book.gramedia_url);
});
</script>
