<template>
  <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
    {{ genre }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ genre: string }>();
</script>
