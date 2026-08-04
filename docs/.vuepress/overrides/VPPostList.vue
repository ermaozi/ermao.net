<script setup lang="ts">
import VPPagination from '@theme/Posts/VPPagination.vue'
import VPPostItem from '@theme/Posts/VPPostItem.vue'
import { computed } from 'vue'
import { usePostListControl } from 'vuepress-theme-plume/client'

const { homePosts } = defineProps<{
  homePosts?: boolean
}>()

const {
  postList,
  page,
  totalPage,
  isLastPage,
  isFirstPage,
  isPaginationEnabled,
  changePage,
} = usePostListControl(computed(() => !!homePosts))

const pageRange = computed(() => {
  const visible = [...new Set([1, page.value - 1, page.value, page.value + 1, totalPage.value])]
    .filter(value => value > 0 && value <= totalPage.value)
    .sort((a, b) => a - b)

  return visible.flatMap((value, index) =>
    index && value - visible[index - 1] > 1
      ? [{ value: `more-${value}`, more: true as const }, { value }]
      : [{ value }],
  )
})
</script>

<template>
  <div class="vp-post-list">
    <slot name="posts-post-list-before" />
    <VPPostItem
      v-for="(post, index) in postList"
      :key="post.path"
      :post="post"
      :index="index"
    />
    <slot name="posts-post-list-after" />
    <VPPagination
      v-if="isPaginationEnabled"
      :page="page"
      :total-page="totalPage"
      :page-range="pageRange"
      :is-last-page="isLastPage"
      :is-first-page="isFirstPage"
      @change="changePage"
    />
    <slot name="posts-post-list-pagination-after" />
  </div>
</template>

<style scoped>
.vp-post-list {
  display: flex;
  flex: 1 2;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  max-width: 100%;
  margin: 0 auto;
}

@media (min-width: 419px) {
  .vp-post-list {
    gap: 24px;
    padding-bottom: 24px;
  }
}
</style>
