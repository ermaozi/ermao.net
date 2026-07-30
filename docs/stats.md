---
title: 二毛博客内容统计
description: 查看二毛博客的文章数量、分类分布、更新情况和站内内容变化趋势。
pageClass: custom-page-class
layout: Layout
sidebar: false
aside: false
comments: false
stats: false
permalink: /stats/
---

<StatsPage />

<style>
.custom-page-class .vp-doc,
.custom-page-class .vp-doc-container .content,
.custom-page-class .vp-doc-container .content-container {
  max-width: 1180px !important;
}

.custom-page-class .vp-doc > h1 {
  max-width: 860px;
}

@media (max-width: 719px) {
  .custom-page-class .vp-doc {
    padding-inline: 16px;
  }
}
</style>
<script setup>
import StatsPage from '@stats/StatsPage.vue'
</script>
