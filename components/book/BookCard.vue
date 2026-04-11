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

        <!-- Affiliate Links -->
        <div v-if="hasAffiliateLinks" class="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
          <span class="text-xs text-gray-500 font-medium">Beli:</span>

          <a
            v-if="book.shopee_url"
            :href="book.shopee_url"
            target="_blank"
            @click.stop
            class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-all"
            title="Beli di Shopee"
          >
            <svg class="w-3.5 h-3.5 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.5 4h2v16h-2V4zm4 0h2v16h-2V4zm4 0h2v16h-2V4zm4 0h2v16h-2V4z" />
            </svg>
            <span class="text-xs font-medium text-orange-700">Shopee</span>
          </a>

          <a
            v-if="book.tokped_url"
            :href="book.tokped_url"
            target="_blank"
            @click.stop
            class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-all"
            title="Beli di Tokopedia"
          >
            <svg class="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.5 4h-13A3.5 3.5 0 002 7.5v9A3.5 3.5 0 005.5 20h13a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0018.5 4zm-13 2h13a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 16.5v-9A1.5 1.5 0 015.5 6z" />
            </svg>
            <span class="text-xs font-medium text-green-700">Tokopedia</span>
          </a>

          <a
            v-if="book.tiktok_url"
            :href="book.tiktok_url"
            target="_blank"
            @click.stop
            class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-all"
            title="Beli di TikTok Shop"
          >
            <svg class="w-3.5 h-3.5 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15V11.7a4.83 4.83 0 01-3.77-1.78V6.69h3.77z"
              />
            </svg>
            <span class="text-xs font-medium text-gray-900">TikTok</span>
          </a>

          <a
            v-if="book.gramedia_url"
            :href="book.gramedia_url"
            target="_blank"
            @click.stop
            class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-all"
            title="Beli di Gramedia"
          >
            <svg class="w-3.5 h-3.5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm7 1.5L18.5 9H14a1 1 0 01-1-1V3.5z" />
            </svg>
            <span class="text-xs font-medium text-red-700">Gramedia</span>
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
