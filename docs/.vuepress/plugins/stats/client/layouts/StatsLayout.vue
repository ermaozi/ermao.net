<script setup>
import { Layout } from 'vuepress-theme-plume/client'
import { computed } from 'vue'
import { usePageData } from '@vuepress/client'
import { useRoute } from 'vue-router'

import ArticleLikeButton from '../components/ArticleLikeButton.vue'
import PageViews from '../components/PageViews.vue'

const route = useRoute()
const page = usePageData()
const isArticle = computed(() => page.value.filePathRelative?.startsWith('blog/'))
</script>

<template>
  <Layout>
    <template #doc-meta-after>
      <div class="article-engagement-meta">
        <PageViews :path="route.path" />
        <ArticleLikeButton v-if="isArticle" :path="route.path" />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.article-engagement-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
