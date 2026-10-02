<script setup lang="ts">
import VPPostItem from '@theme/Posts/VPPostItem.vue'
import { computed } from 'vue'
import { useRoute, useRouteLocale } from 'vuepress/client'
import { useLocalePostList } from 'vuepress-theme-plume/client'

const { homePosts } = defineProps<{ homePosts?: boolean }>()
const route = useRoute()
const locale = useRouteLocale()
const list = useLocalePostList()
const perPage = 15
const page = computed(() => Number(route.path.match(/\/page\/(\d+)\/$/)?.[1] || 1))
const sortedList = computed(() => {
  const sticky = list.value.filter(item => item.sticky === true || typeof item.sticky === 'number')
  const other = list.value.filter(item => item.sticky === undefined || item.sticky === false)
  return [...sticky.sort((a, b) => Number(b.sticky) - Number(a.sticky)), ...other]
})
const totalPage = computed(() => Math.ceil(sortedList.value.length / perPage))
const postList = computed(() => sortedList.value.slice((page.value - 1) * perPage, page.value * perPage))
const pageHref = (number: number) => number === 1 ? locale.value : `${locale.value}page/${number}/`
const isEnglish = computed(() => locale.value === '/en/')

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
    <nav v-if="totalPage > 1" class="vp-pagination" :aria-label="isEnglish ? 'Pagination' : '文章分页'">
      <RouterLink v-if="page > 1" :to="pageHref(page - 1)" rel="prev">{{ isEnglish ? 'Previous' : '上一页' }}</RouterLink>
      <template v-for="item in pageRange" :key="item.value">
        <span v-if="item.more" aria-hidden="true">…</span>
        <RouterLink v-else :to="pageHref(Number(item.value))" :aria-current="item.value === page ? 'page' : undefined">{{ item.value }}</RouterLink>
      </template>
      <RouterLink v-if="page < totalPage" :to="pageHref(page + 1)" rel="next">{{ isEnglish ? 'Next' : '下一页' }}</RouterLink>
    </nav>
    <slot name="posts-post-list-pagination-after" />
  </div>
</template>

<style scoped>
.vp-pagination { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; padding: 16px; }
.vp-pagination a { padding: 4px 8px; border-radius: 4px; }
.vp-pagination [aria-current="page"] { background: var(--vp-c-bg-alt); color: var(--vp-c-brand-1); font-weight: bold; }

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
