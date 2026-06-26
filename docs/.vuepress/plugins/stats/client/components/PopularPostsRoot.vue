<script setup>
import { defineAsyncComponent, onMounted, ref } from 'vue'

const canLoad = ref(false)
const PopularPosts = defineAsyncComponent(() => import('./PopularPosts.vue'))

const loadWhenIdle = (callback) => {
  if (typeof window === 'undefined') return

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 2000 })
  }
  else {
    window.setTimeout(callback, 800)
  }
}

onMounted(() => {
  loadWhenIdle(() => {
    canLoad.value = true
  })
})
</script>

<template>
  <PopularPosts v-if="canLoad" />
</template>
