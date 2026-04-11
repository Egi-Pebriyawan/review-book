<template>
  <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors">
    {{ genre }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ genre: string }>();
</script>
