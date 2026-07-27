<script setup lang="ts">
import ThemeVPPostsExtract from 'vuepress-theme-plume/components/Posts/VPPostsExtract.vue'
import { useRouteLocale } from 'vuepress/client'
import {
  collectionItemRef,
  collectionsRef,
  useData,
} from 'vuepress-theme-plume/client'

const { frontmatter } = useData()
const routeLocale = useRouteLocale()
const homeConfig = frontmatter.value.config
const hasHomePosts = frontmatter.value.pageLayout === 'home'
  && Array.isArray(homeConfig)
  && homeConfig.some(item => item?.type === 'blog' || item?.type === 'posts')

// The theme selects the homepage post collection in a deferred watcher during
// SSR. Its extract navigation can therefore render the root fallbacks
// (/tags/, /categories/, /archives/) before the collection is available.
if (hasHomePosts && !collectionItemRef.value) {
  collectionItemRef.value = collectionsRef.value[routeLocale.value]
    ?.find(item => item.type === 'post')
}
</script>

<template>
  <ThemeVPPostsExtract>
    <template #posts-extract-before>
      <slot name="posts-extract-before" />
    </template>
    <template #posts-extract-after>
      <slot name="posts-extract-after" />
    </template>
  </ThemeVPPostsExtract>
</template>
