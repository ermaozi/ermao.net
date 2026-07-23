<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vuepress/client'

const route = useRoute()

const headings: Record<string, string> = {
  '/': '2026年机场VPN评测与科学上网教程',
  '/blog/': '二毛博客文章',
  '/friends/': '友情链接',
}

const heading = computed(() => headings[route.path])
</script>

<template>
  <h1 v-if="heading" class="seo-route-heading">
    {{ heading }}
  </h1>
</template>

<style scoped>
.seo-route-heading {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
