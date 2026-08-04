<script setup lang="ts">
import ThemeVPPosts from 'vuepress-theme-plume/components/Posts/VPPosts.vue'
import { useRouteLocale } from 'vuepress/client'
import { collectionItemRef, collectionsRef } from 'vuepress-theme-plume/client'

const props = defineProps<{
  homePosts?: boolean
  type?: string
  onlyOnce?: boolean
  collection?: string
}>()

// The theme updates the homepage collection through a watcher. During SSR that
// can happen after VPPostList has already rendered, leaving the initial HTML
// empty. Select it synchronously before the theme component creates its children.
if (props.homePosts) {
  const routeLocale = useRouteLocale()
  collectionItemRef.value = collectionsRef.value[routeLocale.value]?.find(item =>
    props.collection ? item.dir === props.collection : item.type === 'post',
  )
}
</script>

<template>
  <ThemeVPPosts v-bind="props">
    <template v-for="(_, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </ThemeVPPosts>
</template>
