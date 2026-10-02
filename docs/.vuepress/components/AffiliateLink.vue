<script setup lang="ts">
defineProps<{ href: string }>()
</script>

<template>
  <a :href="href" target="_blank" rel="sponsored nofollow noopener"><slot /></a>
</template>
