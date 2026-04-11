<template>
  <div class="flex items-center gap-0.5" role="group" aria-label="Star rating">
    <button
      v-for="star in 5"
      :key="star"
      @click="interactive ? emit('update:modelValue', star) : null"
      @mouseenter="interactive && (hoverRating = star)"
      @mouseleave="interactive && (hoverRating = 0)"
      :class="['transition-all hover:scale-105', interactive ? 'cursor-pointer' : 'cursor-default', star <= (hoverRating || displayRating) ? 'text-rose-400' : 'text-gray-300']"
      type="button"
      :aria-label="`${star} star${star > 1 ? 's' : ''}`"
    >
      <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    </button>
    <span v-if="showLabel && displayRating" class="ml-1 text-sm font-medium text-gray-700">{{ displayRating.toFixed(1) }}</span>
    <span v-if="showCount && count" class="text-sm text-gray-500 ml-1">({{ count }} rating{{ count > 1 ? "s" : "" }})</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  modelValue?: number;
  rating?: number;
  count?: number;
  interactive?: boolean;
  showCount?: boolean;
  showLabel?: boolean;
}>();

const emit = defineEmits<{ "update:modelValue": (value: number) => void }>();

const hoverRating = ref(0);

const displayRating = computed(() => {
  const val = props.interactive ? props.modelValue || 0 : Math.round((props.rating || 0) * 10) / 10;
  return val;
});
</script>
