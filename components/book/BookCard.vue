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

        <!-- Affiliate Links with Official SVG Logos -->
        <div v-if="hasAffiliateLinks" class="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-gray-100">
          <span class="text-xs text-gray-500 font-medium">Beli:</span>

          <!-- Shopee -->
          <a
            v-if="book.shopee_url"
            :href="book.shopee_url"
            target="_blank"
            @click.stop
            class="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all"
            title="Beli di Shopee"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M5.5 4C4.67 4 4 4.67 4 5.5V18.5C4 19.33 4.67 20 5.5 20H18.5C19.33 20 20 19.33 20 18.5V5.5C20 4.67 19.33 4 18.5 4H5.5Z" fill="#EE4D2D" />
              <path d="M14.5 7.5L17 10L14.5 12.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 7H16" stroke="white" stroke-width="1.5" stroke-linecap="round" />
              <path d="M10 17H16" stroke="white" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <span class="text-xs font-semibold text-orange-700">Shopee</span>
          </a>

          <!-- Tokopedia -->
          <a
            v-if="book.tokped_url"
            :href="book.tokped_url"
            target="_blank"
            @click.stop
            class="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all"
            title="Beli di Tokopedia"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#42B549" />
              <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text-xs font-semibold text-green-700">Tokopedia</span>
          </a>

          <!-- TikTok Shop -->
          <a
            v-if="book.tiktok_url"
            :href="book.tiktok_url"
            target="_blank"
            @click.stop
            class="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all"
            title="Beli di TikTok Shop"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M16.6 5.82S16.27 5 15.01 5C13.5 5 12.5 6.26 12.5 8V13C12.5 15.76 10.26 18 7.5 18C4.74 18 2.5 15.76 2.5 13C2.5 10.24 4.74 8 7.5 8V10.5C6.12 10.5 5 11.62 5 13C5 14.38 6.12 15.5 7.5 15.5C8.88 15.5 10 14.38 10 13V5H12.5V8.74C13.19 7.62 14.37 7 15.65 7C16.16 7 16.65 7.08 17.11 7.22L16.6 5.82Z"
                fill="black"
              />
              <path
                d="M19.59 6.69C19.09 5.66 18.33 4.82 17.4 4.21V7.27C17.97 7.69 18.46 8.23 18.83 8.85C18.53 8.87 18.23 8.89 17.93 8.89C14.74 8.89 12.15 11.48 12.15 14.67C12.15 15.28 12.24 15.87 12.4 16.43C12.56 17 12.8 17.54 13.1 18.04V15C13.1 13.45 14.1 12.13 15.48 11.56C15.36 10.78 15.48 9.96 15.84 9.23C16.2 8.5 16.78 7.89 17.5 7.48V6.69H19.59Z"
                fill="#25F4EE"
              />
            </svg>
            <span class="text-xs font-semibold text-gray-900">TikTok</span>
          </a>

          <!-- Gramedia -->
          <a
            v-if="book.gramedia_url"
            :href="book.gramedia_url"
            target="_blank"
            @click.stop
            class="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all"
            title="Beli di Gramedia"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M4 4H15.5L19 7.5V20C19 20.55 18.55 21 18 21H4C3.45 21 3 20.55 3 20V4H4Z" fill="#ED1C24" />
              <path d="M15 4V8H19L15 4Z" fill="#C4161C" />
              <path d="M7 12H12M7 15H15" stroke="white" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <span class="text-xs font-semibold text-red-700">Gramedia</span>
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
