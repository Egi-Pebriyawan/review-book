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

        <!-- Affiliate Links with SVG Logos from Assets -->
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
            <img src="@/assets/shopee.svg" alt="Shopee" class="w-4 h-4" />
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
            <img src="@/assets/tokopedia.svg" alt="Tokopedia" class="w-4 h-4" />
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
            <img src="@/assets/tiktok.svg" alt="TikTok" class="w-4 h-4" />
            <span class="text-xs font-semibold text-gray-900">TikTok</span>
          </a>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
/**
 * Book Card (Komponen Vue UI Re-Usable Component)
 * Mengontrol rendering modul bingkai kotak (card) bergambar satu judul entri buku. 
 * Komponen portabel ini dipanggil dan dicetak berulang-ulang menggunakan directive `v-for` loop 
 * dibekali dengan property (Props) 'book'.
 */
import { computed } from "vue";
import type { Book } from "~/types";
import StarRating from "~/components/ui/StarRating.vue";
import GenreBadge from "~/components/ui/GenreBadge.vue";

const props = defineProps<{ book: Book }>();

// Check if book has any affiliate links
const hasAffiliateLinks = computed(() => {
  return !!(props.book.shopee_url || props.book.tokped_url || props.book.tiktok_url);
});
</script>
