<script setup>
import { Layout } from 'vuepress-theme-plume/client'
import PageViews from '../components/PageViews.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <Layout>
    <template #doc-meta-after>
      <div style="display: flex; align-items: center;">
         <PageViews :path="route.path" />
      </div>
    </template>
  </Layout>
</template>
